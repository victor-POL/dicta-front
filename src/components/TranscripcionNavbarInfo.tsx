import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconInfoCircle } from '@tabler/icons-react'
import type { TranscripcionHistorial } from 'server/models/transcripcionModel'

interface Props {
  transcripcion: TranscripcionHistorial | undefined
  onShowInfo: () => void
}

export default function TranscripcionNavbarInfo({ transcripcion, onShowInfo }: Props) {
  if (!transcripcion) return null
  return (
    <div className="flex items-center gap-3 py-2 px-4 bg-background border-b">
      <Badge
        variant="default"
        className="bg-blue-100 text-blue-800 font-semibold px-3 py-1"
      >
        {transcripcion.tipo ? transcripcion.tipo.toUpperCase() : 'SIN TIPO'}
      </Badge>
      <span className="text-base font-medium text-gray-700 truncate">
        {transcripcion.nombre || 'Transcripción sin nombre'}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onShowInfo}
        className="flex-shrink-0"
      >
        <IconInfoCircle size={16} className="mr-1" />
        Más info
      </Button>
    </div>
  )
}
