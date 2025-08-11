import axios from 'axios'

// Crear una instancia de axios con configuración personalizada
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
})

// Interceptor para añadir el token a todas las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
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

    // Si el error es 401 (No autorizado) y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Intentar renovar el token
        const response = await fetch(`${apiClient.defaults.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('auth_token', data.token)

          // Actualizar el header de autorización y reintentar la request original
          originalRequest.headers.Authorization = `Bearer ${data.token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si falla la renovación del token, limpiar datos y redirigir al login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        window.location.href = '/login'
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'))
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error('Response error'))
  }
)

export default apiClient
