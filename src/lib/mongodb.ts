import mongoose from "mongoose";

// Global connection cache to prevent multiple connections
let isConnected = false;
let cachedConnection: typeof mongoose | null = null;

const dbConnect = async () => {
  // If we already have a cached connection and it's active, return it
  if (isConnected && cachedConnection && mongoose.connection.readyState === 1) {
    console.log('📋 Using existing MongoDB connection');
    return cachedConnection;
  }

  try {
    if (!process.env.DATABASE) {
      throw new Error('Invalid/Missing environment variable: "DATABASE"')
    }

    console.log('🔄 Establishing new MongoDB connection...');
    
    // If mongoose is already connected but we lost track, disconnect first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Configure mongoose options for better connection handling and Atlas compatibility
    const connection = await mongoose.connect(process.env.DATABASE, {
      serverSelectionTimeoutMS: 30000, // 30s timeout for Atlas
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering for immediate errors
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      heartbeatFrequencyMS: 10000, // Check connection health every 10s
    });
    
    // Cache the connection
    cachedConnection = connection;
    isConnected = true;
    
    // Add connection event listeners (only add once)
    if (!mongoose.connection.listeners('connected').length) {
      mongoose.connection.on('connected', () => {
        console.log('✅ Mongoose connected to MongoDB Atlas');
        isConnected = true;
      });
      
      mongoose.connection.on('error', (err) => {
        console.log('❌ Mongoose connection error:', err);
        isConnected = false;
        cachedConnection = null;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Mongoose disconnected from MongoDB');
        isConnected = false;
        cachedConnection = null;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 Mongoose reconnected to MongoDB');
        isConnected = true;
      });
    }
    
    console.log("✅ MongoDB connected successfully");
    return cachedConnection;
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
    isConnected = false;
    cachedConnection = null;
    throw error;
  }
};

// Initialize connection on server startup
const initializeDatabase = async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
    // Don't throw here - let individual requests handle reconnection
  }
};

// Auto-connect when this module is imported (only on server-side)
if (typeof window === 'undefined') {
  // Only run on server-side
  initializeDatabase();
}

export default dbConnect;

// Enhanced health check function with reconnection capability
export const checkDatabaseConnection = async () => {
  const currentState = {
    isConnected,
    readyState: mongoose.connection.readyState,
    states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
  };
  
  // If not properly connected, attempt reconnection
  if (!isConnected || mongoose.connection.readyState !== 1) {
    console.log('🔄 Database not ready, attempting to establish connection...');
    try {
      await dbConnect();
      return {
        ...currentState,
        isConnected: true,
        readyState: 1,
        reconnected: true
      };
    } catch (error) {
      console.error('Failed to establish database connection:', error);
      return {
        ...currentState,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  return currentState;
};

// Enhanced database getter with automatic connection
export async function getDatabase() {
  try {
    // Ensure we have a valid connection
    await dbConnect();
    
    // Double-check the connection is active
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    return mongoose.connection.db;
  } catch (error) {
    console.error('Error getting database:', error);
    throw new Error('Database connection not available');
  }
}
