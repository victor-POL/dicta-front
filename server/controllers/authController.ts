import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  type RegisterRequest,
  type LoginRequest,
  type Usuario,
  type UsuarioSinPassword,
  isValidEmail,
  isValidPassword,
  isValidName
} from '../models/userModels';
import { sendSuccess, sendError, asyncHandler } from '../middleware/responseHandler';

// Crear un pool de conexión a la base de datos
import { Pool } from 'pg';
import type { AuthenticatedRequest } from '../utils/jwt';
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'dicta',
  password: process.env.DB_PASSWORD || 'dicta',
  database: process.env.DB_NAME || 'dicta',
});

// Función para limpiar datos de usuario (sin contraseña)
const cleanUserData = (user: Usuario): UsuarioSinPassword => {
  const { ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { nombres, apellidos, email, contraseña }: RegisterRequest = req.body;

  // Validaciones básicas
  if (!nombres || !apellidos || !email || !contraseña) {
    return sendError(res, 'Todos los campos son requeridos', 400);
  }

  // Validar formato de email
  if (!isValidEmail(email)) {
    return sendError(res, 'El formato del email no es válido', 400);
  }

  // Validar nombres y apellidos
  if (!isValidName(nombres)) {
    return sendError(res, 'El nombre debe tener entre 2 y 100 caracteres y solo contener letras', 400);
  }

  if (!isValidName(apellidos)) {
    return sendError(res, 'El apellido debe tener entre 2 y 100 caracteres y solo contener letras', 400);
  }

  // Validar contraseña
  if (!isValidPassword(contraseña)) {
    return sendError(res, 'La contraseña debe tener al menos 8 caracteres, una letra y un número', 400);
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM negocio.usuario WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return sendError(res, 'El email ya está registrado', 400);
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Insertar nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO negocio.usuario (nombres, apellidos, email, contraseña) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nombres, apellidos, email`,
      [
        nombres.trim(),
        apellidos.trim(),
        email.toLowerCase().trim(),
        hashedPassword
      ]
    );

    const user = newUser.rows[0];

    // Generar token JWT para el usuario recién registrado
    const { generateToken } = await import('../utils/jwt.js');
    const token = generateToken(user.id, user.email);

    sendSuccess(res, {
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email
      },
      token
    }, 'Usuario registrado exitosamente', 201);

  } catch (error) {
    console.error('Error en registro de usuario:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, contraseña }: LoginRequest = req.body;

  if (!email || !contraseña) {
    return sendError(res, 'Email y contraseña son requeridos', 400);
  }

  try {
    // Buscar usuario por email
    const userResult = await pool.query(
      'SELECT id, nombres, apellidos, email, contraseña FROM negocio.usuario WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return sendError(res, 'Credenciales incorrectas', 401);
    }

    const user: Usuario = userResult.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

    if (!isPasswordValid) {
      return sendError(res, 'Credenciales incorrectas', 401);
    }

    // Generar token JWT
    const { generateToken } = await import('../utils/jwt.js');
    const token = generateToken(user.id, user.email);

    console.log(`✅ Usuario logueado: ${user.email} (ID: ${user.id})`);

    sendSuccess(res, {
      user: cleanUserData(user),
      token
    }, 'Login exitoso');

  } catch (error) {
    console.error('Error en login de usuario:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});


export const verifyToken = (req: AuthenticatedRequest, res: Response) => {
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
}