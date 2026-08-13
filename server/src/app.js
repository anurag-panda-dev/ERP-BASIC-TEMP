import express from 'express';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { globalErrorHandler } from './utils/errorHandler.js';
import apiRoutes from './routes/index.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Clerk authentication middleware
app.use(clerkMiddleware());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    statusCode: 404,
  });
});

// Global error handler
app.use(globalErrorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.warn('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
