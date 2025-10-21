import { Button } from '@/components/ui/button'
import { IconInfoCircle } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranscripcionContext } from '@/contexts/TranscripcionContext'
import { useState } from 'react'
import TranscripcionInfoModal from '@/components/TranscripcionInfoModal'


export function SiteHeader() {
  const { title } = usePageTitle()
  const { transcripcion } = useTranscripcionContext()
  const [showTranscripcionInfo, setShowTranscripcionInfo] = useState(false)

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex flex-wrap items-center min-w-0">
          <h1 className="text-base font-medium truncate max-w-[120px]">{title}</h1>
          {transcripcion && (
            <>
              <span className="ml-2 px-2 py-0.5 rounded bg-muted text-[10px] font-semibold truncate max-w-[60px]">
                {transcripcion.tipo}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 p-1 h-6 w-6 flex items-center justify-center"
                onClick={() => setShowTranscripcionInfo(true)}
                aria-label="Más info"
              >
                <IconInfoCircle size={16} />
              </Button>
                <span className="ml-2 text-[11px] font-normal max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hidden sm:inline">
                  {transcripcion.nombre || transcripcion.hash}
                </span>
                <span className="w-full text-[11px] font-normal max-w-full mt-1 ml-0 sm:hidden">
                  {transcripcion.nombre || transcripcion.hash}
                </span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://www.unlam.edu.ar/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              UNLaM
            </a>
          </Button> */}
        </div>
      </div>
      {/* Modal de info de transcripción */}
      {transcripcion && (
        <TranscripcionInfoModal open={showTranscripcionInfo} onOpenChange={setShowTranscripcionInfo} transcripcion={transcripcion} />
      )}
    </header>
  )
}
