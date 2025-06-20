import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth service running on port ${PORT}`);
});
