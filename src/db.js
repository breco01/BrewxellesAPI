import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
