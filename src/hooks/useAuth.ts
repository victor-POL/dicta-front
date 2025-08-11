import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/models/authModels'

export const useAuthUser = () => {
  const { authState } = useAuth()

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
  }
}

export const useAuthActions = () => {
  const { login, logout, register, updateUser } = useAuth()

  return {
    login,
    logout,
    register,
    updateUser,
  }
}

// Hook que fuerza la autenticación (para componentes que requieren usuario autenticado)
export const useRequireAuth = (): User => {
  const { authState } = useAuth()

  if (!authState.isAuthenticated || !authState.user) {
    throw new Error('Usuario no autenticado')
  }

  return authState.user
}

// Hook para verificar permisos específicos
export const usePermissions = () => {
  const { user } = useAuthUser()

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false

    // Aquí puedes implementar la lógica de permisos según tu sistema
    // Por ejemplo, verificar el perfil del usuario
    return user.perfil === 'admin' || user.perfil === requiredPermission
  }

  const isAdmin = (): boolean => {
    return user?.perfil === 'admin' || false
  }

  const canAccess = (resource: string): boolean => {
    if (!user) return false

    // Implementa aquí la lógica específica de acceso a recursos
    switch (user.perfil) {
      case 'admin':
        return true
      case 'editor':
        return ['transcripcion', 'casos', 'calendario'].includes(resource)
      case 'viewer':
        return ['transcripcion'].includes(resource)
      default:
        return false
    }
  }

  return {
    hasPermission,
    isAdmin,
    canAccess,
    userProfile: user?.perfil,
  }
}
