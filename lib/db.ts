import mongoose from 'mongoose';
import { envServer } from './env.server';

declare global {
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn || { conn: null, promise: null };

function normalizeMongoUri(uri: string) {
  return uri.trim();
}

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(normalizeMongoUri(envServer.MONGODB_URI), { autoIndex: true });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Cannot initialize MongoDB connection');
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    const message = error instanceof Error ? error.message : 'MongoDB connection failed';
    if (message.includes('querySrv') || message.includes('EBADNAME')) {
      throw new Error('Invalid MONGODB_URI: verify hostname and remove trailing invalid characters (for example `$`).');
    }
    throw error;
  }

  global.mongooseConn = cached;
  return cached.conn;
}
