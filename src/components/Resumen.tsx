import { useResumen } from '../hooks/useResumen';
import { FileText, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './estilos/Resumen.css';

interface ResumenProps {
  readonly hash: string;
}

export default function Resumen({ hash }: ResumenProps) {
  const { parsedResumen, loading, error, isReady } = useResumen(hash);
  
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
          {/* Contenido del resumen renderizado como markdown */}
          <div className="max-w-none text-foreground markdown-content">
            <ReactMarkdown
              components={{
                // Personalizar estilos de los elementos markdown
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold text-foreground mb-4 pb-2 border-b">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-medium text-foreground flex items-center gap-2 mb-2 mt-4">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 ml-4 mb-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-1 ml-4 mb-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-muted-foreground leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-muted-foreground">
                    {children}
                  </em>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
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