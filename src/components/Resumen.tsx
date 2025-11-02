import { useResumen } from '../hooks/useResumen';
import { AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './estilos/Resumen.css';

interface ResumenProps {
  readonly hash: string;
  readonly isRecording?: boolean;
}

export default function Resumen({ hash, isRecording = false }: ResumenProps) {
  const { parsedResumen, error, isReady } = useResumen(hash, isRecording);
  
  // Auto-scroll to top when content loads
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isReady && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isReady]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="text-destructive font-medium">Error al cargar el resumen</span>
          <span className="text-sm text-muted-foreground">{error}</span>
        </div>
      </div>
    );
  }

  if (!parsedResumen) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando resumen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-hidden min-h-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 space-y-6"
        >
          {/* Contenido del resumen renderizado como markdown */}
          <div className="max-w-none text-foreground markdown-content">
            <ReactMarkdown>
              {parsedResumen}
            </ReactMarkdown>
          </div>
          
          {/* Footer con información adicional */}
          <div className="border-t pt-4 mt-8">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Resumen generado automáticamente</span>
              <span>
                {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}