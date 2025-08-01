import { useState } from 'react';
import './estilos/Paneles.css';
import Transcripcion from './Transcripcion';
import Herramientas from './Herramientas';
import Chat from './Chat';

function Paneles() {
  const [mostrarTranscripcion, setMostrarTranscripcion] = useState(true);
  const [mostrarHerramientas, setMostrarHerramientas] = useState(true);
  const [mostrarChat, setMostrarChat] = useState(true);

  const [minTranscripcion, setMinTranscripcion] = useState(false);
  const [minHerramientas, setMinHerramientas] = useState(false);
  const [minChat, setMinChat] = useState(false);

  // Hash que se puede generar o recibir de algún lado
  const [sessionHash] = useState('dona'); 
  const [sessionMode] = useState<'socket' | 'api'>('socket'); // o 'api', dependiendo del modo de conexión deseado

  const renderPanel = (
    minimizado: boolean,
    onMinToggle: () => void,
    contenido: React.ReactNode
  ) => (
    <div className="panel" style={{ flex: minimizado ? '0 0 50px' : '1' }}>
      <button className="minimizar-btn" onClick={onMinToggle}>
        {minimizado ? '🗖' : '🗕'}
      </button>
      {!minimizado && contenido}
    </div>
  );

  return (
    <div className="paneles">
      {mostrarTranscripcion &&
        renderPanel(
          minTranscripcion,
          () => setMinTranscripcion(!minTranscripcion),
          <Transcripcion mode={sessionMode} hash={sessionHash} />
        )}
      {mostrarHerramientas &&
        renderPanel(
          minHerramientas,
          () => setMinHerramientas(!minHerramientas),
          <Herramientas />
        )}
      {mostrarChat &&
        renderPanel(
          minChat,
          () => setMinChat(!minChat),
          <Chat mode={sessionMode} hash={sessionHash} /> // puede cambiar a "api" si se desea usar la API
        )}
    </div>
  );
}

export default Paneles;
