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

