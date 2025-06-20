

import express from 'express';
import jwt from 'jsonwebtoken';
import healthRoutes from './routes/healthRoutes';
import logger from '../shared/logger';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
dotenv.config();

const app = express();
app.use(express.json());

// Proxy /api/users to users service
app.use('/api/users', createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
}));

// JWT middleware stub
app.use((req, res, next) => {
  // TODO: Implement JWT validation
  next();
});

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

export default app;
