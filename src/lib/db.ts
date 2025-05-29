import mongoose from 'mongoose'

let cached = (global as any).mongoose || { conn: null, promise: null }

async function connectDB() {
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
