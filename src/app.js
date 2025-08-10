// src/app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import breweriesRouter from './routes/breweries.js';
import beersRouter from './routes/beers.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/breweries', breweriesRouter);
app.use('/api/beers', beersRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from BrewxellesAPI 🍺' });
});

app.use('/api', notFound);

app.use(errorHandler);

export default app;
