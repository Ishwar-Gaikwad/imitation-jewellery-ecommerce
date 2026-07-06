import mongoose from 'mongoose';

// console.log('MongoDB connected:', conn.connection.host);
// console.log('Connected to DB:', conn.connection.name);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;