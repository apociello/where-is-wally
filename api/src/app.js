import express from 'express';
import cors from 'cors';
import mapRoutes from './routes/mapRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { notFound, errorHandler } from './middlewares/errors.js';

const app = express();

// Middleware
// Only the client's origin can read the API responses in a browser
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/maps', mapRoutes);
app.use('/games', gameRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;
