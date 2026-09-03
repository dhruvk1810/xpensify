import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGODB_URI environment variable is missing. Please set MONGODB_URI in your environment or .env file.'
      );
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.MONGODB_URI && (process.env.MONGODB_URI.includes('127.0.0.1') || process.env.MONGODB_URI.includes('localhost'))) {
      console.error(
        'Note: If running in production (e.g. Render), you cannot connect to localhost/127.0.0.1. Please use a MongoDB Atlas cloud database URI.'
      );
    }
    process.exit(1);
  }
};

export default connectDB;

