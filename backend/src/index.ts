import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { cardRouter } from './routes/cards';
import { filterRouter } from './routes/filters';
import { adminRouter } from './routes/admin';
import { startDailySyncJob } from './jobs/syncJob';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/cards', cardRouter);
app.use('/api/filters', filterRouter);
app.use('/api/admin', adminRouter);

// Start scheduled jobs
if (process.env.NODE_ENV !== 'test') {
  startDailySyncJob();
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV });
});

export default app;
