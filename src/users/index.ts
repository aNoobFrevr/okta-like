import express from 'express';

const app = express();
app.use(express.json());

// CRUD routes stub
app.get('/users', (_req, res) => res.json([]));
app.post('/users', (_req, res) => res.status(201).json({}));
app.get('/users/:id', (_req, res) => res.json({}));
app.put('/users/:id', (_req, res) => res.json({}));
app.delete('/users/:id', (_req, res) => res.status(204).send());

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`User service running on port ${PORT}`);
});
