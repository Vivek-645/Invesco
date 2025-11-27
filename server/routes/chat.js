const express = require('express');
const { body, validationResult } = require('express-validator');
const verifyClerk = require('../middleware/verifyClerk');
const {
  generateRAGResponse,
  generateChatResponse,
  ingestDocument,
  getKnowledgeBaseStats,
} = require('../services/ragService');
const { getDB } = require('../db');

const router = express.Router();

/**
 * POST /api/chat/query
 * Ask a question using RAG
 * 
 * Request body:
 * - query (string, required) - The user's question
 * - useRAG (boolean, optional) - Whether to use RAG or simple chat (default: true)
 */
router.post(
  '/query',
  verifyClerk,
  [
    body('query').isString().trim().isLength({ min: 3, max: 1000 }),
    body('useRAG').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { query, useRAG = true } = req.body;
      const { clerkId, email } = req.clerk;

      // Get user context
      const db = getDB();
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ clerkId });

      const userContext = {
        userName: user ? `${user.firstName} ${user.lastName}` : null,
        email: email,
        portfolioValue: 1247890, // In production, fetch from portfolio service
      };

      let response;

      if (useRAG) {
        // Use RAG for knowledge-based queries
        try {
          response = await generateRAGResponse(query, userContext);
        } catch (ragError) {
          // Fallback to simple chat if RAG fails
          console.warn('RAG failed, falling back to simple chat:', ragError.message);
          const answer = await generateChatResponse(
            `As an investment advisor, answer this question: ${query}`,
            []
          );
          response = {
            answer,
            sources: [],
            confidence: 'medium',
          };
        }
      } else {
        // Use simple chat for conversational queries
        const answer = await generateChatResponse(query, []);
        response = {
          answer,
          sources: [],
          confidence: 'medium',
        };
      }

      // Store conversation in MongoDB
      const conversationsCollection = db.collection('conversations');
      await conversationsCollection.insertOne({
        userId: clerkId,
        query: query,
        response: response.answer,
        sources: response.sources,
        confidence: response.confidence,
        useRAG: useRAG,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        data: {
          query: query,
          answer: response.answer,
          sources: response.sources,
          confidence: response.confidence,
        },
      });
    } catch (error) {
      console.error('Chat query error:', error);
      
      // Check if it's a quota error
      const isQuotaError = error.message?.includes('quota') || error.message?.includes('429');
      
      res.status(isQuotaError ? 429 : 500).json({
        success: false,
        error: isQuotaError 
          ? 'API quota exceeded. Please try again later or upgrade your API plan.'
          : 'Failed to process query',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * GET /api/chat/history
 * Get user's conversation history
 */
router.get('/history', verifyClerk, async (req, res) => {
  try {
    const { clerkId } = req.clerk;
    const { limit = 20, skip = 0 } = req.query;

    const db = getDB();
    const conversationsCollection = db.collection('conversations');

    const conversations = await conversationsCollection
      .find({ userId: clerkId })
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        conversations,
        count: conversations.length,
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/chat/ingest
 * Ingest document into knowledge base (Admin only - add auth check in production)
 * 
 * Request body:
 * - content (string, required) - Document content
 * - metadata (object, optional) - Document metadata
 */
router.post(
  '/ingest',
  verifyClerk,
  [
    body('content').isString().trim().isLength({ min: 100 }),
    body('metadata').optional().isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { content, metadata = {} } = req.body;
      const { clerkId } = req.clerk;

      // Add user info to metadata
      const enrichedMetadata = {
        ...metadata,
        uploadedBy: clerkId,
        uploadedAt: new Date(),
        source: metadata.source || 'manual_upload',
      };

      const result = await ingestDocument(content, enrichedMetadata);

      res.status(200).json({
        success: true,
        data: {
          message: 'Document ingested successfully',
          stats: result,
        },
      });
    } catch (error) {
      console.error('Document ingestion error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to ingest document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * GET /api/chat/stats
 * Get knowledge base statistics
 */
router.get('/stats', verifyClerk, async (req, res) => {
  try {
    const stats = await getKnowledgeBaseStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch knowledge base stats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/chat/suggestions
 * Get suggested questions based on context
 */
router.post('/suggestions', verifyClerk, async (req, res) => {
  try {
    // Return pre-defined suggestions (can be made dynamic with Gemini)
    const suggestions = [
      "What's my current portfolio performance?",
      "How should I diversify my investments?",
      "What are the best investment strategies for long-term growth?",
      "Explain the current market trends",
      "How can I minimize investment risk?",
      "What are the tax implications of my investments?",
    ];

    res.status(200).json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
    });
  }
});

module.exports = router;
