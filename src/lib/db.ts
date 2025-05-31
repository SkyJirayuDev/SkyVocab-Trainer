import mongoose from 'mongoose'

interface Cached {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached: Cached = (globalThis as any).mongoose

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  }
  ;(globalThis as any).mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined')

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'skyvocab',
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
