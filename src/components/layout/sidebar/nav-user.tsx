import { IconDotsVertical, IconLogout } from '@tabler/icons-react'
import { useNavigate } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { useAuthUser, useAuthActions } from '@/hooks/useAuth'
import { getPath } from '@/data/paths.data'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, isLoading } = useAuthUser()
  const navigate = useNavigate()
  const { logout } = useAuthActions()

  const pathPerfil = getPath('perfil')

  // No renderizar si no hay usuario
  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse"></div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse mt-1"></div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const userInitials = user?.nombre && user?.apellido 
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
    : 'U'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isLoading}
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.urlFotoPerfil} alt={`${user.nombre} ${user.apellido}`} />
                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user.nombre} ${user.apellido}`}</span>
                <span className="text-muted-foreground truncate text-xs">{user.correo}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.urlFotoPerfil} alt={`${user.nombre} ${user.apellido}`} />
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user.nombre} ${user.apellido}`}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.correo}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigate(pathPerfil.url)
                }}
              >
                {<pathPerfil.icon />}
                {pathPerfil.title}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              {isLoading ? <Spinner variant="circle" size={16} /> : <IconLogout />}
              {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
