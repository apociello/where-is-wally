import express from 'express';
import mapRoutes from './routes/mapRoutes.js';
import { notFound, errorHandler } from './middlewares/errors.js';

const app = express();
const port = process.env.PORT || 3000;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/maps', mapRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
