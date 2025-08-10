// src/app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import breweriesRouter from './routes/breweries.js';
import beersRouter from './routes/beers.js';
import { notFound, errorHandler } from './middleware/error.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();

// __dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parsing
app.use(express.json());

// Static root doc
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/breweries', breweriesRouter);
app.use('/api/beers', beersRouter);

// Health / hello
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from BrewxellesAPI 🍺' });
});

// 404 for unknown API routes
app.use('/api', notFound);

// Global error handler
app.use(errorHandler);

// --- Swagger UI ---
const openapi = JSON.parse(
  fs.readFileSync(path.join(__dirname, './docs/openapi.json'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

export default app;
