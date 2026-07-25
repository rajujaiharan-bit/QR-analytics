import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qr_advertising_platform';

  // 1. Try local / custom MongoDB daemon with 2.5s timeout
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2500 });
    console.log(`[Database] Connected successfully to MongoDB at: ${mongoURI}`);
    return;
  } catch (error) {
    console.warn(`[Database] Local MongoDB server not responding at ${mongoURI}. Starting In-Memory Fallback...`);
  }

  // 2. Fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'qr_advertising_platform' }
    });
    const inMemoryURI = mongoMemoryServer.getUri();
    await mongoose.connect(inMemoryURI);
    console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${inMemoryURI}`);
  } catch (memErr) {
    console.error('[Database] Critical error initializing in-memory fallback:', memErr);
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
