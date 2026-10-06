const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("MONGO_URI not set — chatbot running in knowledge-base-only mode (no live catalog/scheme lookups).");
    return false;
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Chatbot connected to MongoDB — live catalog/scheme/crop-tip lookups enabled.");
    return true;
  } catch (err) {
    console.warn("Chatbot could not connect to MongoDB, falling back to knowledge-base-only mode:", err.message);
    return false;
  }
}

function dbAvailable() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, dbAvailable };
