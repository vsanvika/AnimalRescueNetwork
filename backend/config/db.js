const mongoose = require('mongoose');

const connectDB = async (retries = 5, wait = 2000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (retries > 0) {
      console.log(`Retrying MongoDB connection in ${wait / 1000}s... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, Math.min(wait * 2, 30000)), wait);
    } else {
      console.error('All MongoDB connection retries failed. Exiting process.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
