
import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes';
import logger from '../shared/logger';
dotenv.config();

const app = express();
app.use(express.json());

app.use(healthRoutes);

// Global error handler
import { Request, Response, NextFunction } from 'express';
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.headers['x-request-id'] || '',
  });
  res.status(500).json({ status: 'error', message: 'Internal Server Error', errorCode: 'INTERNAL_ERROR' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
});

export default app;
