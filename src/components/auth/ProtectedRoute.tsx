import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { getPath } from '@/data/paths.data'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({ children, redirectTo }: ProtectedRouteProps) => {
  const { authState } = useAuth()
  const location = useLocation()

  if (authState.isLoading) {
    // Mostrar un spinner o loading mientras se verifica la autenticación
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    const from = location.pathname + location.search
    const loginPath = getPath('login').url

    return <Navigate to={`${loginPath}?from=${encodeURIComponent(from)}`} replace />
  }

  // Si hay redirectTo y el usuario está autenticado, redirigir
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
