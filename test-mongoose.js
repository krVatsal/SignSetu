const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB with Mongoose...');
    
    if (!process.env.DATABASE) {
      throw new Error('DATABASE environment variable is not set');
    }
    
    console.log('Using connection string:', process.env.DATABASE.replace(/:[^@]*@/, ':****@'));
    
    await mongoose.connect(process.env.DATABASE);
    console.log('✅ Successfully connected to MongoDB with Mongoose!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
