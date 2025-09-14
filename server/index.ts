import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { generateToken } from './utils/jwt.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';
import type { AuthenticatedRequest } from './utils/jwt.js';

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


// Endpoint básico de registro
app.post('/api/auth/register', async (req, res) => {
  const { nombres, apellidos, email, contraseña } = req.body;

  // Validaciones básicas
  if (!nombres || !apellidos || !email || !contraseña) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son requeridos',
      timestamp: new Date().toISOString()
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'El formato del email no es válido',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { Pool } = await import('pg');
    const bcrypt = await import('bcryptjs');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM negocio.usuario WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      await pool.end();
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado',
        timestamp: new Date().toISOString()
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 12);

    // Insertar nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO negocio.usuario (nombres, apellidos, email, contraseña) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nombres, apellidos, email`,
      [nombres.trim(), apellidos.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const user = newUser.rows[0];
    await pool.end();

    console.log(`✅ Nuevo usuario registrado: ${user.email} (ID: ${user.id})`);

    // Generar JWT token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        },
        token: token
      },
      message: 'Usuario registrado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en registro de usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint de login
app.post('/api/auth/login', async (req, res) => {
  const { email, contraseña } = req.body;

  // Validar datos requeridos
  if (!email || !contraseña) {
    return res.status(400).json({
      success: false,
      error: 'Email y contraseña son requeridos',
      timestamp: new Date().toISOString()
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de email inválido',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { Pool } = await import('pg');
    const bcrypt = await import('bcryptjs');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    // Buscar usuario por email
    const userResult = await pool.query(
      'SELECT id, nombres, apellidos, email, contraseña FROM negocio.usuario WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      await pool.end();
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas',
        timestamp: new Date().toISOString()
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      await pool.end();
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas',
        timestamp: new Date().toISOString()
      });
    }

    await pool.end();

    console.log(`✅ Usuario logueado: ${user.email} (ID: ${user.id})`);

    // Generar JWT token
    const token = generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        },
        token: token
      },
      message: 'Login exitoso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en login de usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para verificar si el token JWT es válido
app.get('/api/auth/verify', authenticateToken, (req: AuthenticatedRequest, res) => {
  // Si llegamos aquí, el token es válido (el middleware ya lo verificó)
  res.status(200).json({
    success: true,
    data: {
      user: {
        userId: req.user?.userId,
        email: req.user?.email,
        iat: req.user?.iat,
        exp: req.user?.exp
      },
      valid: true
    },
    message: 'Token válido',
    timestamp: new Date().toISOString()
  });
});

// Endpoint protegido de ejemplo - perfil del usuario
app.get('/api/user/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { Pool } = await import('pg');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    // Buscar datos del usuario usando el ID del token
    const userResult = await pool.query(
      'SELECT id, nombres, apellidos, email, created_at FROM negocio.usuario WHERE id = $1',
      [req.user?.userId]
    );

    await pool.end();

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    const user = userResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          createdAt: user.created_at
        }
      },
      message: 'Perfil del usuario obtenido',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para actualizar perfil del usuario
app.put('/api/user/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { nombres, apellidos, email } = req.body;

  // Validar datos requeridos
  if (!nombres || !apellidos || !email) {
    return res.status(400).json({
      success: false,
      error: 'Nombres, apellidos y email son requeridos',
      timestamp: new Date().toISOString()
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de email inválido',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { Pool } = await import('pg');
    
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'dicta',
      password: process.env.DB_PASSWORD || 'dicta',
      database: process.env.DB_NAME || 'dicxta',
    });

    // Verificar si el email ya está en uso por otro usuario
    const emailCheckResult = await pool.query(
      'SELECT id FROM negocio.usuario WHERE email = $1 AND id != $2',
      [email.toLowerCase(), req.user?.userId]
    );

    if (emailCheckResult.rows.length > 0) {
      await pool.end();
      return res.status(409).json({
        success: false,
        error: 'El email ya está en uso por otro usuario',
        timestamp: new Date().toISOString()
      });
    }

    // Actualizar los datos del usuario
    const updateResult = await pool.query(
      'UPDATE negocio.usuario SET nombres = $1, apellidos = $2, email = $3 WHERE id = $4 RETURNING id, nombres, apellidos, email',
      [nombres.trim(), apellidos.trim(), email.toLowerCase(), req.user?.userId]
    );

    await pool.end();

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    const updatedUser = updateResult.rows[0];

    console.log(`✅ Perfil actualizado: ${updatedUser.email} (ID: ${updatedUser.id})`);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          nombres: updatedUser.nombres,
          apellidos: updatedUser.apellidos,
          email: updatedUser.email
        }
      },
      message: 'Perfil actualizado correctamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Import and use more specific routes (to be added later)
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
  console.log(`👤 Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`✅ Verify Token: GET http://localhost:${PORT}/api/auth/verify (requires JWT)`);
  console.log(`👥 User Profile: GET http://localhost:${PORT}/api/user/profile (requires JWT)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
  
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