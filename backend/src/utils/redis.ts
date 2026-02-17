import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redis.on('error', (err) => {
      logger.error('Redis connection error', { error: err });
    });

    redis.on('connect', () => {
      logger.info('Redis connected');
    });
  }

  return redis;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed');
  }
});
