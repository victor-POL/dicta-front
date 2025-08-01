# Dicta Front - README

Sistema de transcripción y chat en tiempo real con soporte para API REST y WebSockets.

## 🏗️ Arquitectura General

El proyecto está organizado en capas:

```
src/
├── components/          # Componentes React
├── hooks/              # Hooks personalizados
├── services/           # Servicios de comunicación
│   ├── api/           # Servicios REST
│   └── socket/        # Servicios WebSocket
└── models/            # Tipos y modelos de datos
```

## 🔧 Componentes Principales

### Paneles
Contenedor principal que maneja:
- **Hash de sesión**: `dona` (configurable)
- **Modo de comunicación**: `api` o `socket` para cada panel
- **Estados de minimizado**: Para cada panel individual

### Chat
Sistema de mensajería bidireccional que soporta:
- **API REST**: Para comunicación request/response
- **WebSocket**: Para mensajes en tiempo real

### Transcripción
Sistema de transcripción de audio que muestra:
- **Pestañas**: Transcripción y Resumen
- **Segmentos**: Con timestamp, speaker y texto
- **Scroll automático**: Para nuevos mensajes

## 📡 Comunicación - Chat

### API REST
**Envía (POST a `http://localhost:4000/api/chat`):**
```json
{
  "text": "Hola, ¿cómo estás?",
  "hash": "donadonadonadona"
}
```

**Headers:**
```
Content-Type: application/json
X-Session-Hash: donadonadonadona
```

**Recibe:**
```json
{
  "reply": "¡Hola! Estoy bien, gracias por preguntar."
}
```

### WebSocket
**Conecta a:** `ws://localhost:4000/chat/donadonadonadona`

**Envía:**
```json
{
  "text": "Hola mundo",
  "hash": "donadonadonadona"
}
```

**Recibe:**
```json
{
  "reply": "Respuesta del servidor"
}
```

## 📡 Comunicación - Transcripción

### API REST
**Envía (POST a `http://localhost:5000/api/transcription`):**
```json
{
  "hash": "donadonadonadona"
}
```

**Headers:**
```
Content-Type: application/json
X-Session-Hash: donadonadonadona
```

**Recibe:**
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
  "final_transcription_path": "/path/to/file.srt",
  "cached": false,
  "audio_hash": "a1b2c3d4e5f6..."
}
```

### WebSocket
**Conecta a:** `ws://localhost:5000/transcription/donadonadonadona`

**Autenticación inicial:**
```json
{
  "type": "auth",
  "hash": "donadonadonadona"
}
```

**Recibe (un segmento):**
```json
{
  "type": "segment",
  "data": {
    "id": 3,
    "start": "00:00:07,200",
    "end": "00:00:11,000",
    "speaker": "María González",
    "text": "Entendido, fiscal."
  },
  "timestamp": "2025-08-01T15:48:48.263Z"
}
```

**Recibe (múltiples segmentos):**
```json
{
  "type": "segments",
  "data": [
    {
      "id": 4,
      "start": "00:00:11,000",
      "end": "00:00:15,000",
      "speaker": "Juez Martínez",
      "text": "Pueden proceder."
    },
    {
      "id": 5,
      "start": "00:00:15,000",
      "end": "00:00:19,000",
      "speaker": "Juan Pérez",
      "text": "Gracias, su señoría."
    }
  ],
  "timestamp": "2025-08-01T15:48:48.263Z"
}
```

## 🚀 Configuración

### Cambiar modo de comunicación
En `Paneles.tsx`:
```tsx
// Usar API
<Chat mode="api" hash={sessionHash} />
<Transcripcion mode="api" hash={sessionHash} />

// Usar WebSocket
<Chat mode="socket" hash={sessionHash} />
<Transcripcion mode="socket" hash={sessionHash} />
```

### Cambiar hash de sesión
```tsx
const [sessionHash] = useState('tu-hash-personalizado');
```

### URLs de servicios
- **Chat API**: `http://localhost:4000/api/chat`
- **Chat WebSocket**: `ws://localhost:4000/chat/{hash}`
- **Transcripción API**: `http://localhost:5000/api/transcription`
- **Transcripción WebSocket**: `ws://localhost:5000/transcription/{hash}`

## 🔄 Flujo de Datos

### Chat (API)
1. Usuario escribe mensaje
2. Frontend envía POST con texto y hash
3. Servidor responde con reply
4. Frontend muestra respuesta

### Chat (WebSocket)
1. Usuario escribe mensaje
2. Frontend envía mensaje por WebSocket
3. Servidor responde en tiempo real
4. Frontend recibe y muestra respuesta

### Transcripción (API)
1. Componente se monta
2. Frontend solicita transcripción con hash
3. Servidor responde con todos los segmentos
4. Frontend muestra transcripción completa

### Transcripción (WebSocket)
1. Componente se monta y conecta WebSocket
2. Servidor envía segmentos conforme se generan
3. Frontend agrega cada segmento al estado
4. Vista se actualiza automáticamente

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **WebSocket API** - Comunicación en tiempo real
- **Fetch API** - Comunicación REST

## 🎨 Estilos

Los estilos están organizados por componente en `components/estilos/` y usan variables CSS para consistencia:
- `--color-panel`: Color de fondo de paneles
- `--color-contorno`: Color de bordes y elementos activos
- `--color-botones`: Color de botones