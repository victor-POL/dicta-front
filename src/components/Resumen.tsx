import { useResumen } from '../hooks/useResumen';
import { Badge } from './ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './estilos/Resumen.css';

interface ResumenProps {
  readonly mode?: 'api' | 'socket';
  readonly hash: string;
}

export default function Resumen({ mode = 'api', hash }: ResumenProps) {
  const { parsedResumen, resumenData, loading, error, isReady } = useResumen(mode, hash);
  
  // Auto-scroll to top when content loads
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isReady && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isReady]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Generando resumen...</span>
        </div>
      </div>
    );
  }

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
          <FileText className="h-8 w-8 text-muted-foreground" />
          <span className="text-muted-foreground">No hay resumen disponible</span>
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
          {/* Header del resumen */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-foreground">
                {parsedResumen.title}
              </h1>
              <div className="flex items-center gap-2">
                {resumenData?.cached ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Cacheado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Reciente
                  </Badge>
                )}
              </div>
            </div>
            
            {resumenData?.audio_hash && (
              <p className="text-sm text-muted-foreground">
                ID de Audio: <code className="text-xs bg-muted px-1 rounded">{resumenData.audio_hash.slice(0, 16)}...</code>
              </p>
            )}
          </div>

          {/* Contenido del resumen */}
          <div className="space-y-6">
            {parsedResumen.sections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`} className="space-y-4">
                {/* Título de la sección */}
                <h2 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">
                  {section.title}
                </h2>
                
                {/* Contenido de la sección */}
                {section.content.length > 0 && (
                  <div className="space-y-2">
                    {section.content.map((content, contentIndex) => (
                      <p key={`content-${sectionIndex}-${contentIndex}`} className="text-sm text-muted-foreground leading-relaxed">
                        {content}
                      </p>
                    ))}
                  </div>
                )}
                
                {/* Subsecciones */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-4 ml-4">
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <div key={`subsection-${sectionIndex}-${subsectionIndex}`} className="space-y-2">
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {subsection.title}
                        </h3>
                        <div className="space-y-1 ml-4">
                          {subsection.content.map((content, contentIndex) => (
                            <p key={`subcontent-${subsectionIndex}-${contentIndex}`} className="text-sm text-muted-foreground leading-relaxed">
                              {content}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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