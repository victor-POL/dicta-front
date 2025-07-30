import { useTranscripcion } from '../hooks/useTranscripcion';
import './estilos/Transcripcion.css';

export default function Transcripcion({ mode = 'api' }: { mode?: 'api' | 'socket' }) {
  const { segments, loading, error } = useTranscripcion(mode);

  if (error) {
    return (
      <div className="transcripcion-container">
        <div className="transcripcion-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="transcripcion-container">
      <div className="transcripcion-header">
        Transcripción {loading && <span className="loading-indicator">🔄</span>}
      </div>

      <div className="transcripcion-content">
        {segments.length === 0 && !loading ? (
          <div className="no-segments">No hay transcripciones disponibles</div>
        ) : (
          <div className="segments-list">
            {segments.map((segment) => (
              <div key={segment.id} className="segment-item">
                <div className="segment-header">
                  <span className="segment-time">{segment.start} - {segment.end}</span>
                  <span className="segment-speaker">{segment.speaker}</span>
                </div>
                <div className="segment-text">{segment.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}