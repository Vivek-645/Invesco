/**
 * Script to check user roles in MongoDB
 * Usage: node scripts/checkUserRole.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkUserRoles() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB_NAME);
    const usersCollection = db.collection('users');

    // Get all users
    const users = await usersCollection.find({}).toArray();
    
    console.log('\n📊 Current Users in Database:');
    console.log('═'.repeat(80));
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User:`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   User Type: ${user.userType || 'NOT SET (will default to "user")'}`);
        console.log(`   Created: ${user.createdAt || 'N/A'}`);
        console.log(`   Last Seen: ${user.lastSeen || 'N/A'}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 Summary:');
    const adminCount = users.filter(u => u.userType === 'admin').length;
    const userCount = users.filter(u => u.userType === 'user').length;
    const noRoleCount = users.filter(u => !u.userType).length;
    
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Regular Users: ${userCount}`);
    console.log(`   No Role Set: ${noRoleCount} (will be treated as regular users)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✓ Disconnected from MongoDB\n');
  }
}

checkUserRoles();
