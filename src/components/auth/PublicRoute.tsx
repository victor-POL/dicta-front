import { Navigate, useSearchParams } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { getPath } from '@/data/paths.data'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

export const PublicRoute = ({ children, redirectTo }: PublicRouteProps) => {
  const { authState } = useAuth()
  const [searchParams] = useSearchParams()

  if (authState.isLoading) {
    // Mostrar un spinner o loading mientras se verifica la autenticación
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (authState.isAuthenticated) {
    // Si el usuario está autenticado, redirigir
    const from = searchParams.get('from')
    const defaultRedirect = redirectTo || getPath('inicio').url

    return <Navigate to={from || defaultRedirect} replace />
  }

  return <>{children}</>
}
