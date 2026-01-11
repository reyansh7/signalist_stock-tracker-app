import { connectToDatabase } from '@/database/mongoose';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test 1: Check if MONGODB_URI is defined
    console.log('Test 1: Checking environment variables...');
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('   Please create a .env.local file with MONGODB_URI');
      process.exit(1);
    }
    console.log('✅ MONGODB_URI is defined\n');

    // Test 2: Attempt connection
    console.log('Test 2: Attempting to connect to MongoDB...');
    await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB\n');

    // Test 3: Check connection state
    console.log('Test 3: Checking connection state...');
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    console.log(`   Connection state: ${states[connectionState as keyof typeof states]}`);
    
    if (connectionState === 1) {
      console.log('✅ Connection is active\n');
    } else {
      console.log('❌ Connection is not active\n');
      process.exit(1);
    }

    // Test 4: Get database name
    console.log('Test 4: Getting database information...');
    const dbName = mongoose.connection.db?.databaseName;
    console.log(`   Database name: ${dbName}`);
    console.log('✅ Database info retrieved\n');

    // Test 5: List collections (if any)
    console.log('Test 5: Listing collections...');
    const collections = await mongoose.connection.db?.listCollections().toArray();
    if (collections && collections.length > 0) {
      console.log(`   Found ${collections.length} collection(s):`);
      collections.forEach((col) => console.log(`   - ${col.name}`));
    } else {
      console.log('   No collections found (this is normal for a new database)');
    }
    console.log('✅ Collections listed\n');

    // Success message
    console.log('🎉 All tests passed! Database connection is working properly.');
    console.log('✅ Connection remains open for use\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Database connection test failed:');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    } else {
      console.error(`   Error: ${error}`);
    }
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
