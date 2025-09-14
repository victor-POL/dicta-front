import type { Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, type AuthenticatedRequest, type JwtPayload } from '../utils/jwt.js';
import { sendError } from './responseHandler.js';

/**
 * Middleware para verificar tokens JWT en rutas protegidas
 * Agrega la información del usuario decodificada a req.user
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      sendError(res, 'Token de acceso requerido', 401);

      return;
    }

    // Verificar y decodificar el token
    const decoded: JwtPayload = verifyToken(token);

    // Agregar la información del usuario a la request
    req.user = decoded;

    // Continuar con el siguiente middleware/ruta
    next();

  } catch (error) {
    let errorMessage = 'Token inválido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    sendError(res, errorMessage, 401);
  }
};

/**
 * Middleware opcional que verifica el token si está presente
 * No bloquea la request si no hay token, pero agrega user info si es válido
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded: JwtPayload = verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token inválido, pero no bloqueamos la request
        console.log('Token opcional inválido:', error instanceof Error ? error.message : 'Error desconocido');
      }
    }

    next();

  } catch (error) {
    // Error inesperado, pero no bloqueamos la request
    console.error('Error en autenticación opcional:', error);
    next();
  }
};