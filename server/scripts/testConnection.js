/**
 * Script to manually test user creation and check database connection
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log('URI:', MONGODB_URI?.substring(0, 50) + '...');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    console.log('📦 Database:', db.databaseName);

    const usersCollection = db.collection('users');
    
    // List all users
    const users = await usersCollection.find({}).toArray();
    console.log(`\n👥 Found ${users.length} users in database\n`);

    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  - Email: ${user.email}`);
        console.log(`  - Name: ${user.firstName} ${user.lastName}`);
        console.log(`  - Clerk ID: ${user.clerkId}`);
        console.log(`  - Role: ${user.role || 'NOT SET'}`);
        console.log(`  - Created: ${user.createdAt}`);
        console.log('');
      });
    }

    // Test if we can write
    console.log('🧪 Testing write permission...');
    const testDoc = {
      test: true,
      timestamp: new Date()
    };
    
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne(testDoc);
    console.log('✅ Write test successful');
    
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete test successful\n');

    console.log('✅ Database connection is working properly!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication failed. Check your MongoDB credentials.');
    }
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

testConnection();
