import { useTranscripcionProgress } from '@/contexts/TranscripcionProgressContext'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Upload, Link as LinkIcon, Mic } from 'lucide-react'

interface ProgressBarPersistenteProps {
  className?: string
}

export function ProgressBarPersistente({ className = '' }: ProgressBarPersistenteProps) {
  const { 
    transcripcionesEnProgreso, 
    removerTranscripcion, 
    estaSubiendoTranscripcion 
  } = useTranscripcionProgress()

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'audio':
        return <Upload className="h-4 w-4" />
      case 'youtube':
        return <LinkIcon className="h-4 w-4" />
      case 'en_vivo':
        return <Mic className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'audio':
        return 'Audio'
      case 'youtube':
        return 'YouTube'
      case 'en_vivo':
        return 'En Vivo'
      default:
        return 'Archivo'
    }
  }

  if (!estaSubiendoTranscripcion) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${className}`}
      style={{
        transform: estaSubiendoTranscripcion ? 'translateY(0)' : 'translateY(100%)',
        opacity: estaSubiendoTranscripcion ? 1 : 0
      }}
    >
      <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Procesando transcripciones
              </h3>
              <span className="text-xs text-muted-foreground">
                {transcripcionesEnProgreso.length} en progreso
              </span>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transcripcionesEnProgreso.map((transcripcion) => (
                <div
                  key={transcripcion.id}
                  className="space-y-2 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getIconForType(transcripcion.tipo)}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">
                          {transcripcion.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTypeLabel(transcripcion.tipo)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerTranscripcion(transcripcion.id)}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Progress 
                      value={transcripcion.progreso} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {transcripcion.progreso < 100 ? 'Procesando...' : 'Completado'}
                      </span>
                      <span>{Math.round(transcripcion.progreso)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {transcripcionesEnProgreso.length > 0 && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Las transcripciones aparecerán automáticamente cuando estén listas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}