import { connectDB, closeDB } from '../config/db';
import { seedDatabase } from './seedData';

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await closeDB();
    console.log('[SeedRunner] Seeding script completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[SeedRunner] Seeding failed:', error);
    process.exit(1);
  }
};

run();
