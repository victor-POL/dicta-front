import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import type { RegisterData, User } from '@/models/authModels'
import * as authService from '@/services/api/authService'

interface UseRegisterOptions {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}

/**
 * Hook personalizado para el registro de usuarios usando React Query
 */
export const useRegister = (options?: UseRegisterOptions) => {
  const { setAuthenticatedUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData): Promise<User> => authService.register(data),
    
    onSuccess: (user: User) => {
      // Marcar el usuario como autenticado en el contexto
      setAuthenticatedUser(user)
      
      // Invalidar queries relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      
      // Ejecutar callback personalizado si existe
      options?.onSuccess?.(user)
    },
    
    onError: (error: Error) => {
      console.error('Error en registro:', error)
      options?.onError?.(error)
    },
    
    // Configuración adicional
    retry: 0,
    mutationKey: ['register']
  })
}

/**
 * Hook más simple que devuelve directamente las funciones necesarias
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterData): Promise<User> => authService.register(data),
    retry: 0,
    mutationKey: ['register']
  })
}