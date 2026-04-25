const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn("⚠️  MongoDB is not running locally. The server will continue running, but chat history will not be saved.");
    // Removed process.exit(1) to prevent the server from crashing if DB is offline.
  }
};

module.exports = connectDB;
