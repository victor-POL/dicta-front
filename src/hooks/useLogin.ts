import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import type { LoginCredentials, User } from '@/models/authModels'
import * as authService from '@/services/api/authService'

interface UseLoginOptions {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}

/**
 * Hook personalizado para el login de usuarios usando React Query
 */
export const useLogin = (options?: UseLoginOptions) => {
  const { setAuthenticatedUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<User> => authService.login(credentials),
    
    onSuccess: (user: User) => {
      // Marcar el usuario como autenticado en el contexto
      setAuthenticatedUser(user)
      
      // Invalidar y refrescar queries relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      
      // Ejecutar callback personalizado si existe
      options?.onSuccess?.(user)
    },
    
    onError: (error: Error) => {
      console.error('Error en login:', error)
      options?.onError?.(error)
    },
    
    // Configuración adicional
    retry: 0,
    mutationKey: ['login']
  })
}

/**
 * Hook más simple que devuelve directamente las funciones necesarias
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<User> => authService.login(credentials),
    retry: 0,
    mutationKey: ['login']
  })
}

/**
 * Hook para logout usando React Query
 */
export const useLogout = (options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
  const { logout: logoutAuth } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (): Promise<void> => authService.logout(),
    
    onSuccess: () => {
      // Actualizar el contexto de autenticación
      logoutAuth().then(() => {
        // Limpiar todas las queries en cache
        queryClient.clear()
        
        // Ejecutar callback personalizado si existe
        options?.onSuccess?.()
      }).catch((error) => {
        console.error('Error actualizando contexto después del logout:', error)
        options?.onError?.(error)
      })
    },
    
    onError: (error: Error) => {
      console.error('Error en logout:', error)
      options?.onError?.(error)
    },
    
    mutationKey: ['logout']
  })
}