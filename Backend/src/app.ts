import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes'

dotenv.config();

const app = express();

//middleware
app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

//Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

export default app;