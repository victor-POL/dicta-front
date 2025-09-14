import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Genera un token JWT para un usuario
 * @param userId - ID del usuario
 * @param email - Email del usuario
 * @returns Token JWT firmado
 */
export const generateToken = (userId: number, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifica y decodifica un token JWT
 * @param token - Token JWT a verificar
 * @returns Payload del token decodificado
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token JWT inválido');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token JWT expirado');
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token JWT no es válido aún');
    }
    throw new Error('Error al verificar token JWT');
  }
};

/**
 * Extrae el token del header Authorization
 * @param authHeader - Header Authorization de la request
 * @returns Token extraído o null si no es válido
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Verifica si un token está próximo a expirar (menos de 1 hora)
 * @param token - Token JWT a verificar
 * @returns true si está próximo a expirar
 */
export const isTokenNearExpiry = (token: string): boolean => {
  try {
    const decoded = verifyToken(token);
    if (!decoded.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    
    // Consideramos "próximo a expirar" si quedan menos de 1 hora (3600 segundos)
    return timeUntilExpiry < 3600;
  } catch (error) {
    return true; // Si no podemos verificar el token, asumimos que está expirado
  }
};