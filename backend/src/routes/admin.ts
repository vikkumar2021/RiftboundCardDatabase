import { Router, Request, Response } from 'express';
import { triggerManualSync } from '../jobs/syncJob';
import { logger } from '../utils/logger';

const router = Router();

// Middleware to check admin secret
const checkAdminAuth = (req: Request, res: Response, next: () => void): void => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret) {
    logger.warn('ADMIN_SECRET not configured');
    res.status(503).json({ error: 'Admin features not configured' });
    return;
  }

  if (adminSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

router.post('/sync', checkAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    await triggerManualSync();
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    logger.error('Manual sync failed', { error });
    res.status(500).json({ error: 'Sync failed' });
  }
});

export { router as adminRouter };
