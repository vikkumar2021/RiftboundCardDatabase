import cron from 'node-cron';
import { logger } from '../utils/logger';
import { dataIngestionService } from '../services/dataIngestion';

/**
 * Daily sync job - runs at 2 AM UTC
 */
export const startDailySyncJob = (): void => {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting scheduled daily sync job');
    try {
      await dataIngestionService.syncCards();
      logger.info('Daily sync job completed successfully');
    } catch (error) {
      logger.error('Daily sync job failed', { error });
    }
  });

  logger.info('Daily sync job scheduled (runs at 2 AM UTC)');
};

/**
 * Manual sync trigger endpoint handler
 */
export const triggerManualSync = async (): Promise<void> => {
  logger.info('Manual sync triggered');
  try {
    await dataIngestionService.syncCards();
    logger.info('Manual sync completed successfully');
  } catch (error) {
    logger.error('Manual sync failed', { error });
    throw error;
  }
};
