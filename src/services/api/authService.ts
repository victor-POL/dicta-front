import apiClient from '@/lib/apiClient'
import type { LoginCredentials, RegisterData, User, AuthResponse, UpdateProfileData } from '@/models/authModels'

/**
 * Servicio de autenticación que maneja login, registro y validación de tokens
 */

/**
 * Realiza el login del usuario
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    const { data } = response.data
    
    // Combinar datos del usuario con el token y mapear campos
    const userWithToken: User = {
      ...data.user,
      token: data.token,
      correo: data.user.email, // Mapear email a correo para compatibilidad
      urlFotoPerfil: undefined // Por ahora sin foto de perfil
    }
    
    return userWithToken
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Error al iniciar sesión')
  }
}

/**
 * Registra un nuevo usuario
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    
    const { data: responseData } = response.data
    
    // Combinar datos del usuario con el token y mapear campos
    const userWithToken: User = {
      ...responseData.user,
      token: responseData.token,
      correo: responseData.user.email, // Mapear email a correo para compatibilidad
      urlFotoPerfil: undefined // Por ahora sin foto de perfil
    }
    
    return userWithToken
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Error al registrar usuario')
  }
}

/**
 * Valida un token JWT guardado
 */
export const validateToken = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (!token || !userData) {
      return null
    }

    // Verificar que el token sea válido con el servidor
    const response = await apiClient.get<{
      success: boolean
      data: { user: any; valid: boolean }
      message: string
      timestamp: string
    }>('/auth/verify')
    
    if (response.data.success && response.data.data.valid) {
      // Combinar datos guardados localmente con el token
      const user = JSON.parse(userData) as User
      return { ...user, token }
    }
    
    // Si el token no es válido, limpiar datos
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    return null
    
  } catch (_error) {
    // Si hay error validando, limpiar datos
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    return null
  }
}

/**
 * Obtiene el perfil del usuario autenticado
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{
      success: boolean
      data: { user: Omit<User, 'token'> }
      message: string
      timestamp: string
    }>('/user/profile')
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('No hay token de autenticación')
    }
    
    return {
      ...response.data.data.user,
      token
    }
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Error al obtener perfil de usuario')
  }
}

/**
 * Actualiza el perfil del usuario
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const response = await apiClient.put<AuthResponse>('/user/profile', data)
    
    const { data: responseData } = response.data
    
    // Combinar datos del usuario actualizados con el token existente
    const token = localStorage.getItem('authToken') || ''
    const userWithToken: User = {
      ...responseData.user,
      token,
      correo: responseData.user.email, // Mapear email a correo para compatibilidad
      urlFotoPerfil: undefined // Por ahora sin foto de perfil
    }
    
    // Actualizar datos en localStorage
    localStorage.setItem('userData', JSON.stringify(userWithToken))
    
    return userWithToken
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Error al actualizar perfil')
  }
}

/**
 * Cierra la sesión del usuario
 */
export const logout = async (): Promise<void> => {
  // Limpiar datos locales
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  
  // Emitir evento de logout para sincronización entre pestañas
  window.dispatchEvent(new CustomEvent('auth:logout'))
}