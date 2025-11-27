const { MongoClient } = require('mongodb');

let client = null;
let db = null;

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 */
async function connectDB(retries = 5, delay = 3000) {
  // Validate required environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  if (!process.env.MONGODB_DB_NAME) {
    throw new Error('MONGODB_DB_NAME environment variable is required');
  }

  // Return existing connection if already connected
  if (client && db) {
    console.log('✓ Using existing MongoDB connection');
    return { client, db };
  }

  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Connecting to MongoDB (attempt ${attempt}/${retries})...`);
      
      // Create MongoDB client with recommended options
      client = new MongoClient(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      // Connect to MongoDB
      await client.connect();
      
      // Verify connection
      await client.db('admin').command({ ping: 1 });
      
      // Get database instance
      db = client.db(process.env.MONGODB_DB_NAME);
      
      console.log(`✓ Connected to MongoDB database: ${process.env.MONGODB_DB_NAME}`);
      return { client, db };
      
    } catch (error) {
      lastError = error;
      console.error(`✗ MongoDB connection attempt ${attempt} failed:`, error.message);
      
      // Close client if connection failed
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Error closing failed connection:', closeError.message);
        }
        client = null;
      }
      
      // Wait before retrying (except on last attempt)
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay = Math.min(delay * 1.5, 30000);
      }
    }
  }
  
  // All retries failed
  throw new Error(
    `Failed to connect to MongoDB after ${retries} attempts. Last error: ${lastError.message}`
  );
}

/**
 * Get the MongoDB database instance
 * @returns {Db} MongoDB database instance
 */
function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
}

/**
 * Close MongoDB connection gracefully
 */
async function closeDB() {
  if (client) {
    console.log('🔌 Closing MongoDB connection...');
    await client.close();
    client = null;
    db = null;
    console.log('✓ MongoDB connection closed');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
