import { useEffect, useState } from 'react';
import { getResumenData } from '../services/api/resumenService';
import { useSocketSubscription } from '@/contexts/SocketContext';
import type { ResumenData, ParsedResumen, ResumenSection } from '../models/resumenModels';

// Función para parsear el markdown del resumen
function parseResumenMarkdown(summary: string): ParsedResumen {
  const lines = summary.split('\n').filter(line => line.trim());
  const sections: ResumenSection[] = [];
  let currentSection: ResumenSection | null = null;
  let title = 'Resumen de la Audiencia';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Título principal (#)
    if (trimmedLine.startsWith('# ')) {
      title = trimmedLine.replace('# ', '');
      continue;
    }
    
    // Secciones principales (##)
    if (trimmedLine.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine.replace('## ', ''),
        content: [],
        subsections: []
      };
      continue;
    }
    
    // Subsecciones (###)
    if (trimmedLine.startsWith('### ')) {
      if (currentSection) {
        currentSection.subsections = currentSection.subsections || [];
        currentSection.subsections.push({
          title: trimmedLine.replace('### ', ''),
          content: []
        });
      }
      continue;
    }
    
    // Subsecciones numeradas (1., 2., etc.)
    if (trimmedLine.match(/^\d+\.\s+\*\*.*\*\*:/)) {
      if (currentSection) {
        const subsectionTitle = trimmedLine.replace(/^\d+\.\s+\*\*(.*)\*\*:.*/, '$1');
        const subsectionContent = trimmedLine.replace(/^\d+\.\s+\*\*.*\*\*:\s*/, '');
        
        currentSection.subsections = currentSection.subsections || [];
        currentSection.subsections.push({
          title: subsectionTitle,
          content: subsectionContent ? [subsectionContent] : []
        });
      }
      continue;
    }
    
    // Elementos con bullets (-)
    if (trimmedLine.startsWith('- ')) {
      if (currentSection) {
        if (currentSection.subsections && currentSection.subsections.length > 0) {
          // Agregar a la última subsección
          const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
          lastSubsection.content.push(trimmedLine.replace('- ', ''));
        } else {
          currentSection.content.push(trimmedLine.replace('- ', ''));
        }
      }
      continue;
    }
    
    // Elementos numerados (1., 2., etc.)
    if (trimmedLine.match(/^\d+\.\s+/)) {
      if (currentSection) {
        currentSection.content.push(trimmedLine.replace(/^\d+\.\s+/, ''));
      }
      continue;
    }
    
    // Texto normal
    if (trimmedLine && currentSection) {
      if (currentSection.subsections && currentSection.subsections.length > 0) {
        // Agregar a la última subsección
        const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
        lastSubsection.content.push(trimmedLine);
      } else {
        currentSection.content.push(trimmedLine);
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return { title, sections };
}

export function useResumen(hash: string) {
  const [resumenData, setResumenData] = useState<ResumenData | null>(null);
  const [parsedResumen, setParsedResumen] = useState<ParsedResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suscripción a actualizaciones de resumen en tiempo real
  useSocketSubscription<ResumenData>('resumen_update', (data: ResumenData) => {
    setResumenData(data);
    setLoading(false);
    setError(null);
  }, []);

  // Parsear el resumen cuando cambie
  useEffect(() => {
    if (resumenData?.summary) {
      const parsed = parseResumenMarkdown(resumenData.summary);
      setParsedResumen(parsed);
    } else {
      setParsedResumen(null);
    }
  }, [resumenData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getResumenData(hash);
        
        if (response.status === 'success') {
          setResumenData(response.data);
        } else {
          setError(response.message || 'Error al cargar el resumen');
        }
      } catch (err) {
        setError('Error al cargar el resumen');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { 
    resumenData, 
    parsedResumen, 
    loading, 
    error,
    isReady: !!parsedResumen 
  };
}