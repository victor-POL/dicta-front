import { IconMicrophoneFilled, type Icon } from '@tabler/icons-react'
import { uploadAudio } from '@/services/api/audioService'
import { getSocket } from '@/services/socket/ioClient'
import { useNavigate, useLocation } from 'react-router'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  const navigate = useNavigate()
  const location = useLocation()

  const handleStartTranscription = async () => {
    try {
      // 1) Open file picker
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'audio/*'

      const fileSelected = await new Promise<File | null>((resolve) => {
        input.onchange = () => {
          const file = input.files && input.files[0] ? input.files[0] : null
          resolve(file)
        }
        input.click()
      })

      if (!fileSelected) return

      // 2) Upload to backend and obtain hash
      const res = await uploadAudio(fileSelected)
      const hash = res.hash

      // 3) Ensure we're on /herramientas and propagate hash in URL (e.g., ?hash=...)
      const params = new URLSearchParams(location.search)
      params.set('hash', hash)
      if (location.pathname !== '/herramientas') {
        navigate(`/herramientas?${params.toString()}`)
      } else {
        navigate(`${location.pathname}?${params.toString()}`, { replace: true })
      }

      // 4) Subscribe and request transcription over socket
      const socket = getSocket()

      const emitTranscribe = () => {
        // subscribe using current socket session id
        const unique_id = socket.id
        if (unique_id) {
          socket.emit('subscribe_to_messages', { unique_id })
        }
        // emit with both keys to satisfy backend expectations
        socket.emit('audio_transcribe', { audio_hash: hash, hash, case_name: hash })
      }

      if (socket.connected) {
        emitTranscribe()
      } else {
        socket.once('connect', emitTranscribe)
      }
    } catch (err) {
      console.error('Failed to start transcription:', err)
      alert('Error al iniciar la transcripción')
    }
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-7 w-auto duration-200 ease-linear"
              onClick={handleStartTranscription}
            >
              <a className="flex flex-row gap-2" href={mainOperation.url}>
                <mainOperation.icon />
                {mainOperation.title}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
