import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  // 1. Try environment MONGODB_URI if specified
  if (mongoURI) {
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 4000 });
      console.log(`[Database] Connected successfully to MongoDB Atlas / Custom URI`);
      return;
    } catch (error) {
      console.warn(`[Database] Failed to connect to specified MONGODB_URI:`, error);
    }
  }

  // 2. Try local MongoDB daemon
  try {
    const localURI = 'mongodb://127.0.0.1:27017/qr_advertising_platform';
    await mongoose.connect(localURI, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] Connected successfully to local MongoDB at: ${localURI}`);
    return;
  } catch (error) {
    console.warn(`[Database] Local MongoDB server not detected. Attempting In-Memory MongoDB Server...`);
  }

  // 3. Fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'qr_advertising_platform' }
    });
    const inMemoryURI = mongoMemoryServer.getUri();
    await mongoose.connect(inMemoryURI);
    console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${inMemoryURI}`);
  } catch (memErr) {
    console.error('[Database] Warning: In-Memory MongoDB unavailable on this container. Server will stay online.', memErr);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    // Ignore shutdown errors
  }
};
