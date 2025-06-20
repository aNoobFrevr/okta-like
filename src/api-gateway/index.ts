import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// JWT middleware stub
app.use((req, res, next) => {
  // TODO: Implement JWT validation
  next();
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway running on port ${PORT}`);
});
