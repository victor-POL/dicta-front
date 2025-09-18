# Dicta Front

Sistema de transcripción y chat en tiempo real con comunicación basada completamente en **Socket.IO**.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura centralizada con Socket.IO para toda la comunicación:

```
src/
├── components/          # Componentes React
├── contexts/           # Contextos React (SocketContext)
├── hooks/              # Hooks personalizados
├── services/           # Servicios de comunicación
│   ├── api/           # Servicios Socket.IO
│   └── socketService.ts # Servicio centralizado Socket.IO
└── models/            # Tipos y modelos de datos
```

## 🔧 Componentes Principales

### Paneles
Contenedor principal que maneja:
- **Hash de sesión**: `donadonadonadona` (configurable)
- **Estados de minimizado**: Para cada panel individual
- **Conexión global**: Única conexión Socket.IO para toda la aplicación

### Chat
Sistema de mensajería bidireccional en tiempo real:
- **Socket.IO**: Comunicación bidireccional completa
- **Subscripciones**: Para respuestas automáticas del servidor
- **Estado global**: Compartido através del SocketContext

### Transcripción
Sistema de transcripción de audio en tiempo real:
- **Pestañas**: Transcripción y Resumen
- **Segmentos**: Con timestamp, speaker y texto
- **Actualizaciones en vivo**: Vía Socket.IO subscriptions

## 📡 Comunicación Socket.IO

### Conexión Global
La aplicación mantiene una única conexión Socket.IO gestionada por `SocketContext`:

```tsx
const { socket, isConnected } = useSocket();
```

### Chat
**Envía evento `chat:send`:**
```json
{
  "text": "Hola, ¿cómo estás?",
  "hash": "donadonadonadona"
}
```

**Recibe evento `chat:response`:**
```json
{
  "reply": "¡Hola! Estoy bien, gracias por preguntar.",
  "hash": "donadonadonadona"
}
```

### Transcripción
**Envía evento `transcription:get`:**
```json
{
  "hash": "donadonadonadona"
}
```

**Recibe evento `transcription:segments`:**
```json
{
  "segments": [
    {
      "id": 1,
      "start": "00:00:00,000",
      "end": "00:00:03,500",
      "speaker": "Juan Pérez",
      "text": "Buenos días, mi nombre es Juan Pérez."
    }
  ],
  "hash": "donadonadonadona"
}
```

**Recibe evento `transcription:new_segment`:**
```json
{
  "id": 3,
  "start": "00:00:07,200",
  "end": "00:00:11,000",
  "speaker": "María González",
  "text": "Entendido, fiscal.",
  "hash": "donadonadonadona"
}
```

## 🚀 Configuración

### Conexión Socket.IO
En `App.tsx` la aplicación está envuelta con `SocketProvider`:

```tsx
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <SocketProvider>
      {/* Tu aplicación */}
    </SocketProvider>
  );
}
```

### Usar Socket.IO en componentes
```tsx
import { useSocket, useSocketSubscription } from '../contexts/SocketContext';

function MiComponente() {
  const { socket, isConnected } = useSocket();
  
  // Subscripción automática a eventos
  useSocketSubscription('mi:evento', (data) => {
    console.log('Evento recibido:', data);
  });
  
  // Enviar eventos
  const enviarDatos = async () => {
    const response = await socketService.request('mi:evento', { datos: 'test' });
    console.log('Respuesta:', response);
  };
}
```

### Configurar servidor Socket.IO
La aplicación se conecta por defecto a `http://localhost:4000`. Para cambiar la URL:

```tsx
// En SocketContext.tsx
const socket = io('http://tu-servidor:puerto', {
  transports: ['websocket', 'polling'],
  // ... otras opciones
});
```

## 🔄 Flujo de Datos

### Chat en Tiempo Real
1. Usuario escribe mensaje
2. Componente envía evento `chat:send` vía Socket.IO
3. Servidor procesa y responde con `chat:response`
4. Componente recibe respuesta automáticamente vía subscripción
5. UI se actualiza en tiempo real

### Transcripción en Tiempo Real
1. Componente se monta y solicita transcripción inicial
2. Servidor envía segmentos existentes vía `transcription:segments`
3. Componente se suscribe a `transcription:new_segment`
4. Nuevos segmentos llegan automáticamente del servidor
5. UI se actualiza instantáneamente con cada nuevo segmento

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Socket.IO Client** - Comunicación en tiempo real bidireccional
- **Tailwind CSS** - Estilos utilitarios

## 🎨 Estilos

Los estilos están organizados por componente en `components/estilos/` y utilizan:
- **Variables CSS** para consistencia de colores y espaciado
- **Tailwind CSS** para clases utilitarias
- **Componentes shadcn/ui** para elementos de interfaz