const { getDB } = require('../db');

/**
 * Create required database indexes
 */
async function createIndexes() {
  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    console.log('📊 Creating database indexes...');

    // Create unique index on clerkId
    await usersCollection.createIndex(
      { clerkId: 1 },
      { 
        unique: true,
        name: 'clerkId_unique',
        background: false
      }
    );
    console.log('✓ Created unique index on clerkId');

    // Create index on email for faster lookups (optional but recommended)
    await usersCollection.createIndex(
      { email: 1 },
      { 
        name: 'email_index',
        background: true,
        sparse: true // Only index documents that have email field
      }
    );
    console.log('✓ Created index on email');

    // Create index on lastSeen for analytics/cleanup queries
    await usersCollection.createIndex(
      { lastSeen: -1 },
      { 
        name: 'lastSeen_index',
        background: true
      }
    );
    console.log('✓ Created index on lastSeen');

    console.log('✓ All indexes created successfully');
    
  } catch (error) {
    // If index already exists, that's okay
    if (error.code === 85 || error.message.includes('already exists')) {
      console.log('✓ Indexes already exist');
    } else {
      console.error('✗ Error creating indexes:', error.message);
      throw error;
    }
  }
}

module.exports = {
  createIndexes,
};
