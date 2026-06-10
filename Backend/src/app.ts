import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes     from './routes/auth.routes';
import gameRoutes     from './routes/game.routes';
import progressRoutes from './routes/progress.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/game',     gameRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default app;