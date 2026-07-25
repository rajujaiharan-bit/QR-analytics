import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qr_advertising_platform';

  try {
    // Attempt standard connection first
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] Connected successfully to MongoDB at: ${mongoURI}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB server not detected at ${mongoURI}. Starting In-Memory MongoDB Fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryURI = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryURI);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${inMemoryURI}`);
    } catch (memErr) {
      console.error('[Database] Failed to start In-Memory MongoDB fallback:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
