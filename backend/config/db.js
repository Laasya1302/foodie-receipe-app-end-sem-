const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodie_db');
    console.log(`[FOODIE-DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[FOODIE-DB] Error connecting to MongoDB: ${error.message}`);
    console.log(`[FOODIE-DB] Tip: If connecting to Atlas, check your network access whitelist (0.0.0.0/0) and credentials in .env`);
    // Do not terminate process immediately so developer sees clear error
  }
};

module.exports = connectDB;
