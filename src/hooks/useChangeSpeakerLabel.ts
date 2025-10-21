import { useState, useCallback } from 'react';
import { changeSpeakerLabel } from '@/services/api/transcripcionService';

// Hook para cambiar la etiqueta del orador (solo emite al WS)
export function useChangeSpeakerLabel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeLabel = useCallback(async (oldLabel: string, newLabel: string, hash: string, onOptimistic?: () => void) => {
    setLoading(true);
    setError(null);
    try {
      // Optimistic UI update callback
      onOptimistic?.();
      changeSpeakerLabel(oldLabel, newLabel, hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar etiqueta');
    } finally {
      setLoading(false);
    }
  }, []);

  return { changeLabel, loading, error };
}
