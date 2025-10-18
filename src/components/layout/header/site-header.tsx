import { Button } from '@/components/ui/button'
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
        <h1 className="text-base font-medium flex items-center gap-3">
          {title}
          {transcripcion && (
            <>
              <span className="ml-3 px-2 py-1 rounded bg-muted text-xs font-semibold">
                {transcripcion.tipo}
              </span>
              <span className="ml-2 text-sm font-normal">{transcripcion.nombre || transcripcion.hash}</span>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setShowTranscripcionInfo(true)}
              >
                Más info
              </Button>
            </>
          )}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://www.unlam.edu.ar/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              UNLaM
            </a>
          </Button>
        </div>
      </div>
      {/* Modal de info de transcripción */}
      {transcripcion && (
        <TranscripcionInfoModal open={showTranscripcionInfo} onOpenChange={setShowTranscripcionInfo} transcripcion={transcripcion} />
      )}
    </header>
  )
}
