import mongoose from 'mongoose';
import env from './env.js';

let connected = false;

/**
 * Try to connect to MongoDB.
 * If no MONGODB_URI is configured (or the connection fails) the server
 * keeps running and uses the in-memory store instead.
 */
export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn(
      '[database] MONGODB_URI is not set - running with the IN-MEMORY store (data is temporary).'
    );
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    connected = true;
    console.log('[database] Connected to MongoDB.');
  } catch (error) {
    connected = false;
    console.warn(
      '[database] Could not connect to MongoDB - falling back to the IN-MEMORY store.'
    );
    console.warn('[database] Reason:', error.message);
  }

  return connected;
}

export function isDatabaseConnected() {
  return connected && mongoose.connection.readyState === 1;
}
