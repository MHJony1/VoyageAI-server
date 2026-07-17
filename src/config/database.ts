import mongoose from 'mongoose';
import { config } from './environment';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.success('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.success('Database disconnected');
  } catch (error) {
    logger.error('Database disconnect error:', error);
  }
};

export default mongoose;
