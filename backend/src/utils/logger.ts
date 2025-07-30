import winston from 'winston';
import { env } from '../config/env';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'memory-game-backend' },
  transports: [
    // Console transport with pretty formatting
    new winston.transports.Console({
      format: env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // File transport for combined logs
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Create a stream object with a 'write' function for Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};