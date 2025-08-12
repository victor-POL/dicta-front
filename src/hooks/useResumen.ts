import { useEffect, useState } from 'react';
import { getResumenData } from '../services/api/resumenService';
import { connectResumenSocket, closeResumenSocket } from '../services/socket/resumenSocket';
import type { ResumenData, ParsedResumen, ResumenSection } from '../models/resumenModels';

// Función para parsear el markdown del resumen
function parseResumenMarkdown(summary: string): ParsedResumen {
  const lines = summary.split('\n').filter(line => line.trim());
  const sections: ResumenSection[] = [];
  let currentSection: ResumenSection | null = null;
  let title = 'Resumen de la Audiencia';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Título principal (###)
    if (trimmedLine.startsWith('### ')) {
      title = trimmedLine.replace('### ', '');
      continue;
    }
    
    // Secciones principales (####)
    if (trimmedLine.startsWith('#### ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine.replace('#### ', ''),
        content: [],
        subsections: []
      };
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
    
    // Texto normal
    if (trimmedLine && currentSection) {
      currentSection.content.push(trimmedLine);
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return { title, sections };
}

export function useResumen(mode: 'api' | 'socket', hash: string) {
  const [resumenData, setResumenData] = useState<ResumenData | null>(null);
  const [parsedResumen, setParsedResumen] = useState<ParsedResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (mode === 'api') {
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
    } else if (mode === 'socket') {
      setLoading(true);
      
      connectResumenSocket(
        (data: ResumenData) => {
          setResumenData(data);
          setLoading(false);
          setError(null);
        },
        (errorMessage: string) => {
          setError(errorMessage);
          setLoading(false);
        },
        hash
      );

      // Cleanup
      return () => {
        closeResumenSocket();
      };
    }
  }, [mode, hash]);

  return { 
    resumenData, 
    parsedResumen, 
    loading, 
    error,
    isReady: !!parsedResumen 
  };
}