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
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    data: { message: 'API funcionando correctamente' },
    message: 'Test endpoint successful',
    timestamp: new Date().toISOString()
  });
});

// Database test route
app.get('/api/db/test', async (req, res) => {
  try {
    const { Pool } = await import('pg');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, $1 as test_value', ['PostgreSQL connected!']);
    client.release();
    await pool.end();
    
    res.json({
      success: true,
      data: {
        connected: true,
        currentTime: result.rows[0].current_time,
        testValue: result.rows[0].test_value
      },
      message: 'Database connection test successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database test failed',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Database info route
app.get('/api/db/info', async (req, res) => {
  try {
    const { Pool } = await import('pg');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    const client = await pool.connect();
    const testQuery = await client.query('SELECT version() as version, current_database() as database');
    client.release();
    await pool.end();
    
    res.json({
      success: true,
      data: {
        database: testQuery.rows[0].database,
        version: testQuery.rows[0].version.split(',')[0],
        environment: process.env.NODE_ENV || 'development'
      },
      message: 'Database info retrieved',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve database info',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
// app.use('/api', indexRoutes);

// Import and use more specific routes (to be added later)
// app.use('/api/auth', authRoutes);
// app.use('/api/transcriptions', transcriptionRoutes);
// app.use('/api/emotions', emotionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🐘 Database test: http://localhost:${PORT}/api/db/test`);
  console.log(`📋 Database info: http://localhost:${PORT}/api/db/info`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection on startup
  console.log('\n🔌 Testing database connection...');
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    client.release();
    await pool.end();
    
    console.log('✅ Database connection successful');
    console.log(`🕒 Database time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
  }
});

export default app;