import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const diagnostic = async () => {
  console.log('\n🔍 MongoDB Connection Diagnostic\n');
  console.log('=' .repeat(60));

  // Check environment variable
  const mongoUri = process.env.MONGODB_URI;
  console.log('\n✅ STEP 1: Environment Variable Check');
  console.log('-' .repeat(60));
  if (!mongoUri) {
    console.log('❌ ERROR: MONGODB_URI not found in .env');
    console.log('   Fix: Add MONGODB_URI to server/.env file');
    process.exit(1);
  }
  console.log('✅ MONGODB_URI found');
  console.log(`   Length: ${mongoUri.length} characters`);
  
  // Parse connection string
  console.log('\n✅ STEP 2: Connection String Parsing');
  console.log('-' .repeat(60));
  try {
    const urlObj = new URL(mongoUri);
    console.log(`✅ Valid MongoDB connection string format`);
    console.log(`   Protocol: ${urlObj.protocol}`);
    console.log(`   Username: ${urlObj.username}`);
    console.log(`   Host: ${urlObj.hostname}`);
    console.log(`   Database: ${urlObj.pathname.replace('/', '')}`);
    console.log(`   Search params: ${urlObj.search}`);
  } catch (err) {
    console.log(`❌ ERROR: Invalid connection string format`);
    console.log(`   Error: ${err.message}`);
    console.log(`   Check your MONGODB_URI format`);
    process.exit(1);
  }

  // Test DNS resolution
  console.log('\n✅ STEP 3: DNS Resolution Check');
  console.log('-' .repeat(60));
  try {
    const dns = await import('dns').then(m => m.promises);
    const host = mongoUri.split('@')[1].split('/')[0];
    console.log(`   Testing DNS for: ${host}`);
    const addresses = await dns.resolve4(host);
    console.log(`✅ DNS resolution successful`);
    console.log(`   Resolved to: ${addresses.join(', ')}`);
  } catch (err) {
    console.log(`❌ ERROR: DNS resolution failed`);
    console.log(`   Error: ${err.message}`);
    console.log(`   This means:`);
    console.log(`   - Your internet connection may be down`);
    console.log(`   - DNS server not responding`);
    console.log(`   - Check your network connection`);
  }

  // Test MongoDB connection
  console.log('\n✅ STEP 4: MongoDB Connection Attempt');
  console.log('-' .repeat(60));
  try {
    console.log('   Connecting to MongoDB (timeout: 10 seconds)...');
    
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(`✅ SUCCESS: Connected to MongoDB!`);
    console.log(`   Database: ${connection.connection.db.databaseName}`);
    console.log(`   Host: ${connection.connection.host}`);
    console.log(`   Port: ${connection.connection.port}`);
    
    await mongoose.disconnect();
    console.log(`✅ Disconnected successfully`);
    
  } catch (err) {
    console.log(`❌ ERROR: MongoDB connection failed`);
    console.log(`   Error Type: ${err.name}`);
    console.log(`   Error: ${err.message}`);
    console.log(`\n   Possible causes:`);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log(`   1. ⚠️  Cluster might be PAUSED in MongoDB Atlas`);
      console.log(`      → Go to https://cloud.mongodb.com`);
      console.log(`      → Find your cluster and click Resume`);
      console.log(`      → Wait 3-5 minutes for it to start`);
      console.log(`\n   2. ⚠️  Network Access not configured`);
      console.log(`      → Go to Network Access`);
      console.log(`      → Add 0.0.0.0/0 to allow all IPs`);
      console.log(`      → Or add your specific IP address`);
    } else if (err.message.includes('authentication failed')) {
      console.log(`   1. ⚠️  Wrong username or password`);
      console.log(`      → Check Database Access in MongoDB Atlas`);
      console.log(`      → Verify username and password match`);
    } else if (err.message.includes('getaddrinfo')) {
      console.log(`   1. ⚠️  Network or DNS issue`);
      console.log(`      → Check internet connection`);
      console.log(`      → Try restarting your router`);
      console.log(`      → Check firewall settings`);
    }
    
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All checks passed! Your MongoDB connection is working.\n');
};

diagnostic().catch(err => {
  console.error('❌ Diagnostic error:', err);
  process.exit(1);
});
