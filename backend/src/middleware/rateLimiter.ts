import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { RateLimitError } from '../types/errors';

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new RateLimitError('Too many requests, please try again later.');
  }
});

// Stricter rate limit for game creation
export const gameCreationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 games per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new RateLimitError('Too many games created, please try again later.');
  }
});