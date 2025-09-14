import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, AuthenticatedRequest, JwtPayload } from '../utils/jwt.js';

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
      res.status(401).json({
        success: false,
        error: 'Token de acceso requerido',
        message: 'Debes proporcionar un token válido en el header Authorization',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Verificar y decodificar el token
    const decoded: JwtPayload = verifyToken(token);
    
    // Agregar la información del usuario a la request
    req.user = decoded;
    
    // Continuar con el siguiente middleware/ruta
    next();
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    let errorMessage = 'Token inválido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware opcional que verifica el token si está presente
 * No bloquea la request si no hay token, pero agrega user info si es válido
 */
export const optionalAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
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