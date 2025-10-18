import { type Icon } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
  mainOperation,
}: {
  readonly items: readonly {
    readonly title: string
    readonly url: string
    readonly icon: Icon
  }[]
  readonly mainOperation: {
    readonly title: string
    readonly url: string
    readonly icon: Icon
  }
}) {
  const { setOpenMobile } = useSidebar()
  const location = useLocation()

  const isActive = (url: string) =>
    location.pathname === url || location.pathname.startsWith(`${url}/`)

  const handleClick = () => {
    setOpenMobile(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-7 w-auto duration-200 ease-linear h-10 flex items-center justify-center"
              isActive={isActive(mainOperation.url)}
              asChild
            >
              <Link className="flex flex-row gap-2 items-center justify-center" to="/transcripciones" onClick={handleClick}>
                <mainOperation.icon />
                {mainOperation.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} onClick={handleClick}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
