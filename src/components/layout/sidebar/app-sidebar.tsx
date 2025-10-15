import { getPath, SIDEBAR_CONFIG } from '@/data/paths.data'
import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavSecondary } from '@/components/layout/sidebar/nav-secondary'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import { Link } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const data = {
  navMain: SIDEBAR_CONFIG.navMain,
  navSecondary: SIDEBAR_CONFIG.navSecondary,
  herramientas: SIDEBAR_CONFIG.herramientas,
  mainOperation: SIDEBAR_CONFIG.mainOperation,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar()

  const handleLogoClick = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={getPath('inicio').url} onClick={handleLogoClick}>
                <img src="/logos/logo_mejorado_4x_sin_letras.png" alt="Dicta" className="size-6 object-contain" />
                <span className="text-base font-semibold">DICTA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} mainOperation={data.mainOperation} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
