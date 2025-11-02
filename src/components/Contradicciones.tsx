import { useContradicciones } from '../hooks/useContradicciones';
import { CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import './estilos/Contradicciones.css';

interface ContradiccionesProps {
  readonly hash: string;
  readonly isRecording?: boolean;
}

export default function Contradicciones({ hash, isRecording }: ContradiccionesProps) {
  const { parsedContradicciones, error, isReady } = useContradicciones(hash, isRecording);
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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="text-destructive font-medium">Error al cargar las contradicciones</span>
          <span className="text-sm text-muted-foreground">{error}</span>
        </div>
      </div>
    );
  }

  if (!parsedContradicciones) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando contradicciones...</span>
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
          {/* Mostrar contradicciones directamente sin categorización */}
          {parsedContradicciones?.categories[0]?.contradictions.map((contradiccion, contradiccionIndex) => (
            <div 
              key={`contradiccion-${contradiccionIndex}`}
              className="border rounded-lg p-4 bg-card hover:bg-muted/40 transition-colors group"
            >
              <div className="space-y-4">
                {/* Frase 1 */}
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-red-800 text-xs mb-1">FRASE 1</h5>
                      <p className="text-sm text-red-700 leading-relaxed">
                        {contradiccion.frase1}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(contradiccion.frase1, contradiccionIndex * 2)}
                        title="Copiar frase 1"
                      >
                        {copiedQuestion === contradiccionIndex * 2 ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Frase 2 */}
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-red-800 text-xs mb-1">FRASE 2</h5>
                      <p className="text-sm text-red-700 leading-relaxed">
                        {contradiccion.frase2}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(contradiccion.frase2, contradiccionIndex * 2 + 1)}
                        title="Copiar frase 2"
                      >
                        {copiedQuestion === contradiccionIndex * 2 + 1 ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-background/50 rounded-md p-3 border-l-2 border-amber-500">
                  <h5 className="font-medium text-amber-800 text-xs mb-2">ANÁLISIS DE LA CONTRADICCIÓN</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {contradiccion.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
