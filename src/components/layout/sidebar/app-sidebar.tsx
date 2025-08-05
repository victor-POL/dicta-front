import {
  IconCalendarWeek,
  IconHome,
  IconBrandHipchat,
  IconTimeline,
  IconGavel,
  IconHelp,
  IconMessage2,
  IconMap,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'

import { NavHerramientas } from '@/components/layout/sidebar/nav-herramientas'
import { NavMain } from '@/components/layout/sidebar/nav-main'
import { NavSecondary } from '@/components/layout/sidebar/nav-secondary'
import { NavUser } from '@/components/layout/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Inicio',
      url: '#',
      icon: IconHome,
    },
    {
      title: 'Grabaciones',
      url: '#',
      icon: IconMessage2,
    },
    {
      title: 'Calendario',
      url: '#',
      icon: IconCalendarWeek,
    },
    {
      title: 'Casos',
      url: '#',
      icon: IconGavel,
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: 'Configuración',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Ayuda',
      url: '#',
      icon: IconHelp,
    },
  ],
  herramientas: [
    {
      name: 'Chatbot',
      url: '#',
      icon: IconBrandHipchat,
    },
    {
      name: 'Mapa Mental',
      url: '#',
      icon: IconMap,
    },
    {
      name: 'Linea Tiempo',
      url: '#',
      icon: IconTimeline,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <img src="/public/imagotipo_dicta.svg" alt="Dicta" className="size-6 object-contain" />
                <span className="text-base font-semibold">DICTA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavHerramientas items={data.herramientas} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
