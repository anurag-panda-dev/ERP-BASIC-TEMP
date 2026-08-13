import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { validateEnvironment, getConfig } from './config/environment.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate environment
try {
  validateEnvironment();
} catch (error) {
  logger.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

const { PORT } = getConfig();

const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('🔗 Connecting to MongoDB...');
    await connectDatabase();
    logger.info('✅ MongoDB connected successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

startServer();
