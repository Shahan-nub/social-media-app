import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URL in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log("Connected to mongodb (with cache).");
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
} 
