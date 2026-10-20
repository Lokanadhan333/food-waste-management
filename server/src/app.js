import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import donationRoutes from './routes/donationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { isDatabaseConnected } from './config/db.js';

const app = express();

// Required when running behind a hosting proxy (Render, Railway, etc.)
// so rate-limiting sees the real client IP. Harmless during local development.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.clientUrls }));
app.use(express.json({ limit: '100kb' }));

app.use('/api', apiLimiter);

/** GET /api/health - simple service check. */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FoodShare API is running',
    database: isDatabaseConnected() ? 'mongodb' : 'in-memory',
    time: new Date().toISOString(),
  });
});

app.use('/api/donations', donationRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
