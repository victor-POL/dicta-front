import { useState } from 'react';
import { useTranscripcion } from '../hooks/useTranscripcion';
import Resumen from './Resumen';
import './estilos/Transcripcion.css';

export default function Transcripcion({ mode = 'api', hash }: { mode?: 'api' | 'socket'; hash: string }) {
  const { segments, loading, error } = useTranscripcion(mode, hash);
  const [tab, setTab] = useState<'transcripcion' | 'resumen'>('transcripcion');

  return (
    <div className="transcripcion-panel">
      <div className="transcripcion-tabs">
        <button
          className={tab === 'transcripcion' ? 'active' : ''}
          onClick={() => setTab('transcripcion')}
        >
          Transcripción
        </button>
        <button
          className={tab === 'resumen' ? 'active' : ''}
          onClick={() => setTab('resumen')}
        >
          Resumen
        </button>
      </div>
      <div className="transcripcion-tab-content">
        {tab === 'transcripcion' && (
          <div className="transcripcion-scroll">
            {error && <div className="transcripcion-error">{error}</div>}
            {loading && <div className="transcripcion-loading">Cargando...</div>}
            {segments.length === 0 && !loading ? (
              <div className="no-segments">No hay transcripciones disponibles</div>
            ) : (
              segments.map((segment) => (
                <div key={segment.id} className="transcripcion-msg">
                  <div>
                    <span className="transcripcion-time">[{segment.start}]</span>{' '}
                    <span className="transcripcion-speaker">{segment.speaker}</span>
                  </div>
                  <div className="transcripcion-text">{segment.text}</div>
                </div>
              ))
            )}
          </div>
        )}
        {tab === 'resumen' && <Resumen />}
      </div>
    </div>
  );
}