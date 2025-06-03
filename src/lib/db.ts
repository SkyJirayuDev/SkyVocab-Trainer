import mongoose from 'mongoose';

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: Cached;
};

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = {
    conn: null,
    promise: null,
  };
}

const cached = globalWithMongoose._mongooseCache;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'skyvocab',
    }).catch((err: unknown) => {
      if (err instanceof Error) {
        console.error("MongoDB error:", err.message);
      } else {
        console.error("Unknown MongoDB connection error");
      }
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
