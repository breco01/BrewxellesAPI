// src/app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

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

// ---------- Security & parsing ----------
app.use(
  helmet({
    // laat swagger statics correct laden
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.disable('x-powered-by');

// CORS: lees toegelaten origin uit .env (CORS_ORIGIN), of laat alles toe als leeg
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(allowedOrigin ? cors({ origin: allowedOrigin }) : cors());

// JSON body limit (klein maar veilig)
app.use(express.json({ limit: '100kb' }));

// Rate limit op alle /api routes (15 min window, 300 req/IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// ---------- Static root doc ----------
app.use(express.static(path.join(__dirname, '../public')));

// ---------- API routes ----------
app.use('/api/breweries', breweriesRouter);
app.use('/api/beers', beersRouter);

// Health / hello
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from BrewxellesAPI 🍺' });
});

// ---------- Swagger UI ----------
const openapi = JSON.parse(
  fs.readFileSync(path.join(__dirname, './docs/openapi.json'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// 404 for unknown API routes (only under /api)
app.use('/api', notFound);

// Global error handler
app.use(errorHandler);

export default app;
