import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../types/errors';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  // Log error details
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    ...(err instanceof AppError && { statusCode: err.statusCode }),
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: err.message,
    });
    return;
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if ((err as any).code === 11000) {
      res.status(409).json({
        status: 'error',
        message: 'Duplicate entry',
      });
      return;
    }
  }

  res.status(500).json({
    status: 'error',
    message: env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};