import { useSugerencias } from '../hooks/useSugerencias';
import { HelpCircle, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import './estilos/Sugerencias.css';

interface SugerenciasProps {
  readonly mode?: 'api' | 'socket';
  readonly hash: string;
}

export default function Sugerencias({ mode = 'api', hash }: SugerenciasProps) {
  const { parsedSugerencias, loading, error, isReady } = useSugerencias(mode, hash);
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);
  
  // Auto-scroll to top when content loads
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isReady && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isReady]);

  // Función para copiar pregunta al portapapeles
  const copyToClipboard = async (question: string, index: number) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedQuestion(index);
      setTimeout(() => setCopiedQuestion(null), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">
            {mode === 'socket' ? 'Conectando al servidor...' : 'Generando sugerencias...'}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="text-destructive font-medium">Error al cargar las sugerencias</span>
          <span className="text-sm text-muted-foreground">{error}</span>
          {mode === 'socket' && (
            <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
              <p><strong>Sugerencias:</strong></p>
              <p>• Verifica que el servidor esté ejecutándose en puerto 5000</p>
              <p>• Intenta usar el modo API en su lugar</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!parsedSugerencias) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <HelpCircle className="h-8 w-8 text-muted-foreground" />
          <span className="text-muted-foreground">No hay sugerencias disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-hidden min-h-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {/* Mostrar preguntas directamente sin categorización */}
          {parsedSugerencias?.categories[0]?.questions.map((pregunta, preguntaIndex) => (
            <div 
              key={`pregunta-${preguntaIndex}`}
              className="border rounded-lg p-4 bg-card hover:bg-muted/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-medium text-foreground text-sm leading-relaxed flex-1">
                  {pregunta.question}
                </h4>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(pregunta.question, preguntaIndex)}
                    title="Copiar pregunta"
                  >
                    {copiedQuestion === preguntaIndex ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-md p-3 border-l-2 border-primary/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Justificación:</strong> {pregunta.reasoning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}