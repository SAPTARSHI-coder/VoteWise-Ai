const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️  MONGO_URI is not defined in .env file. Database features will be disabled.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn("⚠️  MongoDB connection failed. The server will continue running, but database features will be disabled.");
  }
};

module.exports = connectDB;
