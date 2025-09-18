import { QueryResultRow } from 'pg';

// Interfaz para el usuario en la base de datos
export interface Usuario extends QueryResultRow {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  contraseña: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

// Interfaz para el usuario sin contraseña (para respuestas)
export interface UsuarioSinPassword {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

// Request para registro de usuario
export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  email: string;
  contraseña: string;
}

// Request para login de usuario
export interface LoginRequest {
  email: string;
  contraseña: string;
}

// Response para operaciones de autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UsuarioSinPassword;
  token?: string; // Token JWT para autenticación
  timestamp: string;
}

// Response específico para login exitoso
export interface LoginResponse {
  success: true;
  data: {
    user: UsuarioSinPassword;
    token: string;
  };
  message: string;
  timestamp: string;
}

// Response específico para registro exitoso
export interface RegisterResponse {
  success: true;
  data: {
    user: UsuarioSinPassword;
    token: string;
  };
  message: string;
  timestamp: string;
}

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de contraseña
export const isValidPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una letra y un número
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

// Validación de nombres
export const isValidName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(name);
};