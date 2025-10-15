import { useEmociones } from '../hooks/useEmociones';
import { Badge } from './ui/badge';
import { Brain, AlertCircle, TrendingUp, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './estilos/Emociones.css';

interface EmocionesProps {
  readonly hash: string;
}

export default function Emociones({ hash }: EmocionesProps) {
  const { parsedEmociones, error, isReady } = useEmociones(hash);
  
  console.log('🎭 Componente Emociones - Estado actual:', {
    hash,
    error,
    hasParsedEmociones: !!parsedEmociones,
    isReady,
    parsedEmociones
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isReady && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isReady]);

  // Mostrar información de debug en desarrollo
  if (import.meta.env.MODE === 'development') {
    console.log('🔍 Debug Emociones:', {
      hash,
      error,
      parsedEmociones,
      isReady
    });
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="text-destructive font-medium">Error al cargar el análisis</span>
          <span className="text-sm text-muted-foreground">{error}</span>
          <span className="text-xs text-muted-foreground">Hash: {hash} | Socket.IO</span>
        </div>
      </div>
    );
  }

  if (!parsedEmociones) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando análisis de emociones...</span>
        </div>
      </div>
    );
  }

  // Si no hay datos de emociones, mostrar mensaje específico
  if (parsedEmociones && parsedEmociones.todasLasEmociones.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Brain className="h-8 w-8 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">No se detectaron emociones</span>
          <span className="text-sm text-muted-foreground">
            El análisis no pudo identificar emociones en el audio
          </span>
          <span className="text-xs text-muted-foreground">
            Orador: {parsedEmociones.oradorDetectado} | Precisión: {parsedEmociones.precision}%
          </span>
        </div>
      </div>
    );
  }

  // Crear el gráfico de donut con CSS
  const createDonutChart = () => {
    let cumulativePercentage = 0;
    return parsedEmociones.todasLasEmociones.map((emocion) => {
      const startAngle = cumulativePercentage * 3.6; // 360deg / 100%
      const endAngle = (cumulativePercentage + emocion.porcentaje) * 3.6;
      cumulativePercentage += emocion.porcentaje;
      
      return {
        ...emocion,
        startAngle,
        endAngle,
        isLarge: emocion.porcentaje > 50
      };
    });
  };

  const chartData = createDonutChart();

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-hidden min-h-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold text-foreground">Análisis de emociones en el discurso</h1>
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Orador detectado: <span className="text-primary font-medium">{parsedEmociones.oradorDetectado}</span>
              </span>
            </div>
          </div>

          {/* Gráfico principal */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              {/* Círculo base */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
              
              {/* Gráfico de donut con CSS cónico */}
              <div 
                className="absolute inset-2 rounded-full"
                style={{
                  background: `conic-gradient(${chartData.map((item) => 
                    `${item.color} ${item.startAngle}deg ${item.endAngle}deg`
                  ).join(', ')})`
                }}
              ></div>
              
              {/* Círculo interno */}
              <div className="absolute inset-1/4 bg-background rounded-full flex items-center justify-center shadow-sm">
                <div className="text-center">
                  <div className="text-xs font-medium text-muted-foreground">PRECISIÓN</div>
                  <div className="text-lg font-bold text-primary">{parsedEmociones.precision}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {parsedEmociones.todasLasEmociones.map((emocion, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded mb-2 flex items-center justify-center"
                  style={{ backgroundColor: emocion.color }}
                >
                  <span className="text-white text-xs font-bold">
                    {emocion.tipo === 'Felicidad' ? '😊' : 
                     emocion.tipo === 'Tristeza' ? '😢' : 
                     emocion.tipo === 'Enojo' ? '😠' : 
                     emocion.tipo === 'Miedo' ? '😨' : 
                     emocion.tipo === 'Neutral' ? '😐' : '🤔'}
                  </span>
                </div>
                <div className="text-xs font-medium text-center">{emocion.tipo}</div>
                <div className="text-sm font-bold text-primary">{emocion.porcentaje}%</div>
              </div>
            ))}
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Emoción dominante</div>
                <div className="font-medium">{parsedEmociones.emocionPrincipal.tipo}</div>
              </div>
            </div>
            
            {parsedEmociones.confianzaGeneral && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Confianza general</div>
                  <div className="font-medium">{parsedEmociones.confianzaGeneral}%</div>
                </div>
              </div>
            )}
            
            {parsedEmociones.cached && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <Badge variant="secondary" className="text-xs">
                  Análisis previo
                </Badge>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-4 mt-8">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Análisis generado automáticamente</span>
              <span>
                {new Date(parsedEmociones.fechaAnalisis).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}