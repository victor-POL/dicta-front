import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Routes
import testRoutes from './routes/testRouter.js';
app.use(testRoutes);

import profileRoutes from './routes/profileRoute.js';
app.use(profileRoutes);

import estudiosRoutes from './routes/estudiosRoutes.js';
app.use(estudiosRoutes);

import casosRoutes from './routes/casosRoutes.js';
app.use(casosRoutes);

import audienciasRoutes from './routes/audienciasRoute.js';
app.use(audienciasRoutes);

import authRoutes from './routes/authRoutes.js';
app.use(authRoutes);


// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🐘 Database test: http://localhost:${PORT}/api/db/test`);
  console.log(`📋 Database info: http://localhost:${PORT}/api/db/info`);
  console.log(`�🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);

  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicta',
    });

    const client = await pool.connect();
    await client.query('SELECT NOW() as current_time, version() as version');
    client.release();
    await pool.end();

    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
  }
});

export default app;