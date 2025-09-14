import type { Response } from 'express';

import { asyncHandler, sendError, sendSuccess } from '../middleware/responseHandler';

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

export const actualizarPerfil = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { nombres, apellidos, email } = req.body;
  // Validar que el usuario esté autenticado
  if (!req.user?.userId) {
    return sendError(res, 'Usuario no autenticado', 401);
  }

  // Validar datos requeridos
  if (!nombres || !apellidos || !email) {
    return sendError(res, 'Nombres, apellidos y email son requeridos', 400)
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendError(res, 'Formato de email inválido', 400)
  }

  try {
    // Verificar si el usuario existe primero
    const userExistsResult = await pool.query(
      'SELECT id, nombres, apellidos, email FROM negocio.usuario WHERE id = $1',
      [req.user.userId]
    );

    
    if (userExistsResult.rows.length === 0) {
      return sendError(res, 'Usuario no encontrado en la base de datos', 404);
    }

    // Verificar si el email ya está en uso por otro usuario
    const emailCheckResult = await pool.query(
      'SELECT id FROM negocio.usuario WHERE email = $1 AND id != $2',
      [email.toLowerCase(), req.user.userId]
    );

    if (emailCheckResult.rows.length > 0) {
      return sendError(res, 'El email ya está en uso por otro usuario', 400);
    }

    // Actualizar los datos del usuario
    const updateResult = await pool.query(
      'UPDATE negocio.usuario SET nombres = $1, apellidos = $2, email = $3 WHERE id = $4 RETURNING id, nombres, apellidos, email',
      [nombres.trim(), apellidos.trim(), email.toLowerCase(), req.user.userId]
    );


    if (updateResult.rows.length === 0) {
      return sendError(res, 'Error al actualizar usuario', 500)
    }

    const updatedUser = updateResult.rows[0];

    return sendSuccess(res, {
      user: {
        id: updatedUser.id,
        nombres: updatedUser.nombres,
        apellidos: updatedUser.apellidos,
        email: updatedUser.email
      }
    }, 'Perfil actualizado exitosamente')
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
})