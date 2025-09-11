import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.DATABASE) {
      throw new Error('Invalid/Missing environment variable: "DATABASE"')
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Configure mongoose options for better connection handling
    await mongoose.connect(process.env.DATABASE, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering
    });
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB');
      isConnected = false;
    });
    
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
    isConnected = false;
    throw error;
  }
};

// Initialize connection on server startup
const initializeDatabase = async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
  }
};

// Auto-connect when this module is imported
if (typeof window === 'undefined') {
  // Only run on server-side
  initializeDatabase();
}

export default dbConnect;

// Health check function
export const checkDatabaseConnection = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
  };
};

// For backward compatibility with existing code
export async function getDatabase() {
  await dbConnect();
  return mongoose.connection.db;
}
