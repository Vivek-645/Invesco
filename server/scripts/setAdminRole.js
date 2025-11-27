/**
 * Script to set a user's role to admin
 * Usage: node scripts/setAdminRole.js <email>
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function setAdminRole(email) {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: node scripts/setAdminRole.js <email>');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Update user role to admin
    const result = await usersCollection.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Successfully set ${email} as admin`);

    // Display updated user
    const user = await usersCollection.findOne({ email: email });
    console.log('\nUpdated user:');
    console.log(JSON.stringify(user, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

// Get email from command line arguments
const email = process.argv[2];
setAdminRole(email);
