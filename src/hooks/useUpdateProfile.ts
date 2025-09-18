import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import type { UpdateProfileData, User } from '@/models/authModels'
import * as authService from '@/services/api/authService'

interface UseUpdateProfileOptions {
  onSuccess?: (user: User) => void
  onError?: (error: Error) => void
}

/**
 * Hook personalizado para actualizar el perfil del usuario usando React Query
 */
export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const { updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData): Promise<User> => authService.updateProfile(data),
    
    onSuccess: (user: User) => {      
      // Actualizar el contexto de autenticación con los nuevos datos
      updateUser(user)
      
      // Invalidar y refrescar queries relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      // Ejecutar callback personalizado si existe
      options?.onSuccess?.(user)
    },
    
    onError: (error: Error) => {
      console.error('❌ Error actualizando perfil:', error)
      options?.onError?.(error)
    },
    
    // Configuración adicional
    retry: 0,
    mutationKey: ['updateProfile']
  })
}

export default useUpdateProfile