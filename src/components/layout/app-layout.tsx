import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { SiteHeader } from '@/components/layout/header/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet, useLocation } from 'react-router'

export const AppLayout = () => {
  const location = useLocation()
  const isHerramientasPage = location.pathname === '/herramientas'

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col h-screen">
        <SiteHeader />
        <main className={`flex-1 ${isHerramientasPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout
