// backend/config/mongodb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async () => {
  console.log('MongoDB connection bypassed (using MySQL completely)');
};

export default mongoose;
