
import express from 'express';
import userRoutes from './routes/userRoutes';
import logger from '../shared/logger';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use(userRoutes);

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

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});

export default app;
