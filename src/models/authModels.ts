export interface User {
  id: number
  nombres: string
  apellidos: string
  email: string
  token: string
  createdAt?: string
  correo?: string // Alias para email (compatibilidad)
  urlFotoPerfil?: string // URL de la foto de perfil
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  contraseña: string
}

export interface RegisterData {
  nombres: string
  apellidos: string
  email: string
  contraseña: string
}

// Datos para actualizar el perfil del usuario
export interface UpdateProfileData {
  nombres: string
  apellidos: string
  email: string
}

// Respuesta del servidor para login/register
export interface AuthResponse {
  success: boolean
  data: {
    user: Omit<User, 'token'>
    token: string
  }
  message: string
  timestamp: string
}

// Error response del servidor
export interface ErrorResponse {
  success: false
  error: string
  message?: string
  timestamp: string
}
