import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { gameService } from './services/gameService';

const startServer = async () => {
  try {
    const app = createApp();
    
    // Start periodic cleanup of old games
    setInterval(() => {
      gameService.cleanupOldGames();
    }, 30 * 60 * 1000); // Every 30 minutes

    const server = app.listen(env.PORT, () => {
      logger.info(`Server is running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`CORS enabled for: ${env.CORS_ORIGIN}`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      logger.info('Received shutdown signal, closing server...');
      
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();