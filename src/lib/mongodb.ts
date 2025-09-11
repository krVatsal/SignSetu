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

    await mongoose.connect(process.env.DATABASE);
    isConnected = true;
    console.log("Server connected to Database successfully");
  } catch (error) {
    console.log("Error connecting the database", error);
    throw error;
  }
};

export default dbConnect;

// For backward compatibility with existing code
export async function getDatabase() {
  await dbConnect();
  return mongoose.connection.db;
}
