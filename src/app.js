import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import breweriesRouter from './routes/breweries.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/breweries', breweriesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from BrewxellesAPI 🍺' });
});

export default app;
