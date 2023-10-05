import mongoose from "mongoose";

let cachedDb :any = null;

export default async function connectToDatabase(uri:string) {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(uri);
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// module.exports = { connectToDatabase };