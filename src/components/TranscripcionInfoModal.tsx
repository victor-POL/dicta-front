import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IconInfoCircle } from '@tabler/icons-react'
import type { TranscripcionHistorial } from 'server/models/transcripcionModel'

interface TranscripcionInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transcripcion: TranscripcionHistorial
}

export default function TranscripcionInfoModal({ open, onOpenChange, transcripcion }: Readonly<TranscripcionInfoModalProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconInfoCircle size={24} />
            Información de la Transcripción
          </DialogTitle>
          <DialogDescription>
            Detalles completos del historial de transcripción
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {transcripcion ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Hash en una fila completa */}
              <div className="space-y-1 col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Hash</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.hash}</p>
              </div>
              {/* Nombre en una fila completa */}
              <div className="space-y-1 col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Nombre</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.nombre ?? '-'}</p>
              </div>
              {/* Tipo y Estado en la misma fila */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Tipo</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.tipo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.estado}</p>
              </div>
              {/* URL en una fila completa */}
              {transcripcion.url && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">URL</p>
                  <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.url}</p>
                </div>
              )}
              {/* Fecha y Duración en la misma fila */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Fecha de creación</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.fecha_creacion}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Duración</p>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.duracion ?? '-'}</p>
              </div>
              {/* Archivo y vinculados si existen, en filas completas */}
              {transcripcion.archivo && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Archivo</p>
                  <p className="text-sm bg-gray-100 p-2 rounded break-all">{transcripcion.archivo}</p>
                </div>
              )}
              {transcripcion.audiencia_vinculada && transcripcion.audiencia_vinculada.length > 0 && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Audiencia vinculada</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded break-all whitespace-pre-wrap">
                    {JSON.stringify(transcripcion.audiencia_vinculada, null, 2)}
                  </pre>
                </div>
              )}
              {transcripcion.expediente_vinculado && transcripcion.expediente_vinculado.length > 0 && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Expediente vinculado</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded break-all whitespace-pre-wrap">
                    {JSON.stringify(transcripcion.expediente_vinculado, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay información de transcripción disponible.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
