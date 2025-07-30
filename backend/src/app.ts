import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env';
import { logger, stream } from './utils/logger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { NotFoundError } from './types/errors';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Compression middleware
  app.use(compression());

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging middleware
  app.use(morgan('combined', { stream }));

  // Rate limiting
  app.use('/api', apiLimiter);

  // Routes
  app.use(routes);

  // 404 handler
  app.use((req, res, next) => {
    throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};