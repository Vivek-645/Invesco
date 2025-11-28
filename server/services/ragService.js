const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Initialize Gemini AI
let genAI;
let model;
let embeddingModel;

/**
 * Initialize Gemini AI models
 */
function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set. RAG features will be disabled.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Main model for chat and generation
    // Using gemini-2.0-flash (available in API)
    model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Embedding model for vector generation
    embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    console.log('✓ Gemini AI initialized successfully (using gemini-2.0-flash)');
    return true;
  } catch (error) {
    console.error('✗ Failed to initialize Gemini AI:', error.message);
    return false;
  }
}

/**
 * Generate embeddings for text
 */
async function generateEmbedding(text) {
  if (!embeddingModel) {
    throw new Error('Gemini AI not initialized');
  }

  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Store document chunks with embeddings in MongoDB
 */
async function ingestDocument(content, metadata = {}) {
  const db = getDB();
  const documentsCollection = db.collection('rag_documents');

  // Split content into chunks (simple chunking by paragraphs)
  const chunks = content
    .split(/\n\n+/)
    .filter(chunk => chunk.trim().length > 50)
    .map(chunk => chunk.trim());

  console.log(`📄 Processing ${chunks.length} chunks...`);

  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    try {
      const embedding = await generateEmbedding(chunks[i]);
      
      documents.push({
        id: uuidv4(),
        text: chunks[i],
        content: chunks[i],
        embedding: embedding,
        metadata: {
          ...metadata,
          chunkIndex: i,
          totalChunks: chunks.length,
          ingestedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to process chunk ${i}:`, error.message);
      // Store without embedding for keyword search fallback
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        console.warn('⚠️  Quota exceeded, storing chunk without embedding for keyword search');
        documents.push({
          id: uuidv4(),
          text: chunks[i],
          content: chunks[i],
          embedding: null,
          metadata: {
            ...metadata,
            chunkIndex: i,
            totalChunks: chunks.length,
            ingestedAt: new Date(),
            hasEmbedding: false,
          },
        });
      }
    }
  }

  if (documents.length > 0) {
    await documentsCollection.insertMany(documents);
    console.log(`✓ Ingested ${documents.length} document chunks`);
  }

  return {
    totalChunks: chunks.length,
    successfulChunks: documents.length,
  };
}

/**
 * Fallback keyword-based search when embeddings are unavailable
 */
async function keywordBasedSearch(query, topK = 5) {
  const db = getDB();
  const documentsCollection = db.collection('rag_documents');
  
  // Extract keywords from query
  const keywords = query.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['what', 'where', 'when', 'how', 'should', 'could', 'would', 'will', 'does', 'have', 'with', 'this', 'that', 'from', 'they', 'been', 'were', 'their'].includes(word));
  
  if (keywords.length === 0) {
    // Return any documents if no keywords
    const docs = await documentsCollection.find({}).limit(topK).toArray();
    return docs.map(doc => ({ ...doc, score: 0.5 }));
  }
  
  // Search for documents containing keywords
  const documents = await documentsCollection.find({
    $or: [
      { text: { $regex: keywords.join('|'), $options: 'i' } },
      { 'metadata.title': { $regex: keywords.join('|'), $options: 'i' } },
      { 'metadata.category': { $regex: keywords.join('|'), $options: 'i' } },
    ]
  }).limit(topK * 3).toArray();
  
  // Score documents by keyword frequency
  const scoredDocs = documents.map(doc => {
    const text = (doc.text + ' ' + (doc.metadata?.title || '') + ' ' + (doc.metadata?.category || '')).toLowerCase();
    const score = keywords.reduce((sum, keyword) => {
      const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
      return sum + matches;
    }, 0);
    return { ...doc, score: Math.min(score / keywords.length, 1) };
  });
  
  return scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Retrieve relevant documents based on query
 */
async function retrieveRelevantDocs(query, topK = 5) {
  const db = getDB();
  const documentsCollection = db.collection('rag_documents');

  try {
    // Try embedding-based search first
    const queryEmbedding = await generateEmbedding(query);
    const allDocs = await documentsCollection.find({}).toArray();

    if (allDocs.length === 0) {
      return [];
    }

    // Calculate similarity scores
    const scoredDocs = allDocs.map(doc => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort by score and return top K
    return scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  } catch (embeddingError) {
    // Fallback to keyword search if embeddings fail (quota exceeded)
    console.warn('⚠️  Embeddings unavailable, using keyword search fallback');
    return await keywordBasedSearch(query, topK);
  }
}

/**
 * Generate answer using RAG
 */
async function generateRAGResponse(query, userContext = {}) {
  if (!model) {
    throw new Error('Gemini AI not initialized');
  }

  // Retrieve relevant documents
  const relevantDocs = await retrieveRelevantDocs(query, 5);

  if (relevantDocs.length === 0) {
    // Use simple chat when no documents found
    console.log('ℹ️  No relevant documents found, using direct LLM response');
    const directAnswer = await generateChatResponse(
      `As an investment advisor, answer this question professionally and concisely: ${query}`,
      []
    );
    return {
      answer: directAnswer,
      sources: [],
      confidence: 'medium',
    };
  }

  // Build context from retrieved documents
  const context = relevantDocs
    .map((doc, idx) => `[Source ${idx + 1}] ${doc.content}`)
    .join('\n\n');

  // Build prompt with context
  const prompt = `You are an expert financial analyst for FinSight, a financial analytics platform specializing in stock analysis for Microsoft (MSFT) and Netflix (NFLX). Use the following information from our knowledge base to answer the user's question accurately and professionally.

CONTEXT FROM KNOWLEDGE BASE:
${context}

USER INFORMATION:
${userContext.userName ? `Name: ${userContext.userName}` : ''}
${userContext.portfolioValue ? `Portfolio Value: $${userContext.portfolioValue.toLocaleString()}` : ''}

USER QUESTION:
${query}

INSTRUCTIONS:
1. Provide a clear, professional, and accurate answer based on the context provided
2. If the context doesn't fully answer the question, acknowledge the limitation
3. Use specific numbers and data from the context when available
4. Keep responses concise but informative (2-4 paragraphs)
5. End with a helpful suggestion or next step when appropriate
6. Maintain a professional, trustworthy tone suitable for financial analysis

ANSWER:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    return {
      answer: answer.trim(),
      sources: relevantDocs.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        metadata: doc.metadata,
        relevanceScore: doc.score.toFixed(3),
      })),
      confidence: relevantDocs[0].score > 0.7 ? 'high' : relevantDocs[0].score > 0.5 ? 'medium' : 'low',
    };
  } catch (error) {
    console.error('RAG response generation error:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Get conversation response with chat history
 */
async function generateChatResponse(message, chatHistory = []) {
  if (!model) {
    throw new Error('Gemini AI not initialized');
  }

  // Build conversation context
  const conversationContext = chatHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const prompt = `You are an expert financial analyst for FinSight, specializing in stock analysis for MSFT and NFLX. Continue this conversation naturally and professionally.

${conversationContext ? `CONVERSATION HISTORY:\n${conversationContext}\n\n` : ''}USER MESSAGE:
${message}

Provide a helpful, professional response focused on financial analytics, stock performance metrics, Maximum Drawdown analysis, WACC calculations, or beta computations.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Chat response generation error:', error);
    throw new Error('Failed to generate chat response');
  }
}

/**
 * Get document count in knowledge base
 */
async function getKnowledgeBaseStats() {
  const db = getDB();
  const documentsCollection = db.collection('rag_documents');
  
  const totalChunks = await documentsCollection.countDocuments();
  const uniqueDocs = await documentsCollection.distinct('metadata.source');
  
  return {
    totalChunks,
    uniqueDocuments: uniqueDocs.length,
  };
}

module.exports = {
  initializeGemini,
  generateEmbedding,
  ingestDocument,
  retrieveRelevantDocs,
  generateRAGResponse,
  generateChatResponse,
  getKnowledgeBaseStats,
};
