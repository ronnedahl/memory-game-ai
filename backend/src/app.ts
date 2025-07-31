import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env';
import {  stream } from './utils/logger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { NotFoundError } from './types/errors';

export const createApp = () => {
  const app = express();

  app.use(helmet());

  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  
  app.use(compression());

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(morgan('combined', { stream }));

  app.use('/api', apiLimiter);

  app.use(routes);

  app.use((req, _res, _next) => {
    throw new NotFoundError(`Route ${req.method} ${req.path} not found`);
  });

  app.use(errorHandler);

  return app;
};