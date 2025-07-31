import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { RateLimitError } from '../types/errors';

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res) => {
    throw new RateLimitError('Too many requests, please try again later.');
  }
});

export const gameCreationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res) => {
    throw new RateLimitError('Too many games created, please try again later.');
  }
});