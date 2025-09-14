import axios from 'axios'

// Crear una instancia de axios con configuración personalizada
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir el token a todas las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error('Request error'))
  }
)

// Interceptor para manejar respuestas y errores de autenticación
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (No autorizado)
    if (error.response?.status === 401) {
      // Si es un intento de login, no manejar como token expirado
      if (originalRequest.url?.includes('/auth/login')) {
        // Para login fallido, pasar el error original del servidor
        const message = error.response.data?.error || 'Credenciales incorrectas'
        return Promise.reject(new Error(message))
      }
      
      // Si no es login y no hemos intentado refresh, es token expirado
      if (!originalRequest._retry) {
        originalRequest._retry = true

        // Limpiar datos de autenticación y redirigir al login
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        
        // Emitir evento personalizado para notificar al AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout'))
        
        // Si no estamos en login, redirigir
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        
        return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'))
      }
    }

    // Manejar otros errores de forma más específica
    if (error.response) {
      // Error con respuesta del servidor
      const message = error.response.data?.error || error.response.data?.message || 'Error del servidor'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Error de red/conexión
      return Promise.reject(new Error('Error de conexión con el servidor'))
    } else {
      // Error de configuración
      return Promise.reject(error instanceof Error ? error : new Error('Error desconocido'))
    }
  }
)

export default apiClient
