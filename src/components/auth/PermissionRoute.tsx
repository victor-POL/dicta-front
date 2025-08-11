import { Navigate } from 'react-router'
import { usePermissions } from '@/hooks/useAuth'
import type { ReactNode } from 'react'

interface PermissionRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredProfile?: string
  resource?: string
  fallbackTo?: string
}

export const PermissionRoute = ({
  children,
  requiredPermission,
  requiredProfile,
  resource,
  fallbackTo = '/',
}: PermissionRouteProps) => {
  const { hasPermission, canAccess, userProfile } = usePermissions()

  // Verificar permisos específicos
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackTo} replace />
  }

  // Verificar perfil específico
  if (requiredProfile && userProfile !== requiredProfile) {
    return <Navigate to={fallbackTo} replace />
  }

  // Verificar acceso a recurso
  if (resource && !canAccess(resource)) {
    return <Navigate to={fallbackTo} replace />
  }

  return <>{children}</>
}

// Componente específico para rutas de admin
export const AdminRoute = ({ children, fallbackTo }: { children: ReactNode; fallbackTo?: string }) => {
  return (
    <PermissionRoute requiredProfile="admin" fallbackTo={fallbackTo}>
      {children}
    </PermissionRoute>
  )
}

// Componente para mostrar contenido basado en permisos
interface ConditionalRenderProps {
  children: ReactNode
  requiredPermission?: string
  requiredProfile?: string
  resource?: string
  fallback?: ReactNode
}

export const ConditionalRender = ({
  children,
  requiredPermission,
  requiredProfile,
  resource,
  fallback = null,
}: ConditionalRenderProps) => {
  const { hasPermission, canAccess, userProfile } = usePermissions()

  // Verificar permisos específicos
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  // Verificar perfil específico
  if (requiredProfile && userProfile !== requiredProfile) {
    return <>{fallback}</>
  }

  // Verificar acceso a recurso
  if (resource && !canAccess(resource)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
