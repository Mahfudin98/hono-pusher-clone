import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hono-pusher';
    console.log('Attempting to connect to MongoDB:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.warn('⚠️  App will continue without database. Please check MONGO_URI environment variable.');
    return false;
  }
};

export const isConnected = () => mongoose.connection.readyState === 1;
