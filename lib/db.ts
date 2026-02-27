import mongoose from 'mongoose';
import { envServer } from './env.server';

declare global {
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn || { conn: null, promise: null };

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(envServer.MONGODB_URI, { autoIndex: true });
  }
  cached.conn = await cached.promise;
  global.mongooseConn = cached;
  return cached.conn;
}
