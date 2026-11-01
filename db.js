import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://dev:devpassword@mongo:27017/tennis?authSource=admin';

export const connectDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');
};
