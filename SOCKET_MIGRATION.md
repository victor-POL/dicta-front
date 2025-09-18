# Migración a Socket.IO - Documentación

## Resumen de la Migración

Esta aplicación ha sido completamente migrada de comunicación HTTP + WebSocket nativo a **Socket.IO únicamente**. Ahora toda la comunicación con el servidor se realiza através de Socket.IO, proporcionando:

- ✅ Conexión unificada y robusta
- ✅ Reconexión automática
- ✅ Manejo centralizado de errores
- ✅ Eventos en tiempo real
- ✅ Fallbacks automáticos

## Cambios Principales

### 1. Nuevo Servicio Centralizado (`socketService.ts`)
- **Ubicación**: `src/services/socketService.ts`
- **Funcionalidad**: Maneja todas las comunicaciones Socket.IO
- **Métodos principales**:
  - `connect()`: Establecer conexión
  - `disconnect()`: Cerrar conexión
  - `request()`: Hacer peticiones con respuesta
  - `subscribe()`: Suscribirse a eventos
  - Métodos específicos: `getEmociones()`, `sendChatMessage()`, etc.

### 2. Contexto React (`SocketContext.tsx`)
- **Ubicación**: `src/contexts/SocketContext.tsx`
- **Funcionalidad**: Maneja el estado de conexión globalmente
- **Hooks disponibles**:
  - `useSocket()`: Estado de conexión
  - `useAutoConnect()`: Conexión automática
  - `useSocketSubscription()`: Suscripción a eventos

### 3. Servicios de API Migrados
Todos los servicios en `src/services/api/` han sido migrados:
- ✅ `emocionesService.ts`
- ✅ `chatService.ts`
- ✅ `authService.ts`
- ✅ `resumenService.ts`
- ✅ `transcripcionService.ts`
- ✅ `sugerenciasService.ts`
- ✅ `contradiccionesService.ts`
- ✅ `cronologiaService.ts`
- ✅ `mapaService.ts`
- ✅ `analisisEmocionesService.ts`

### 4. Hooks Actualizados
Los hooks ya no requieren el parámetro `mode`:
```typescript
// ❌ Antes
const { data } = useEmociones('socket', hash);

// ✅ Ahora
const { data } = useEmociones(hash);
```

### 5. Componentes Actualizados
- **Emociones**: Removido prop `mode`
- **Chat**: Removido prop `mode`
- **Transcripcion**: Removido prop `mode`
- **Resumen**: Removido prop `mode`

### 6. Servicios WebSocket Legacy
Los archivos en `src/services/socket/` mantienen compatibilidad pero están deprecated:
- `chatSocket.ts` → **Deprecated**
- `emocionesSocket.ts` → **Deprecated**
- Usar `SocketContext` y `socketService` directamente

## Integración en la Aplicación

### App.tsx
```tsx
import { SocketProvider } from '@/contexts/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider autoConnect={false}>
        {/* Tu aplicación */}
      </SocketProvider>
    </AuthProvider>
  );
}
```

### Componente con Conexión
```tsx
import { useSocket, useAutoConnect } from '@/contexts/SocketContext';

function MiComponente() {
  const { isConnected, connectionStatus } = useSocket();
  
  // Auto-conectar cuando hay un hash de sesión
  useAutoConnect(sessionHash);
  
  return (
    <div>
      {isConnected ? 'Conectado' : 'Desconectado'}
    </div>
  );
}
```

### Suscripción a Eventos
```tsx
import { useSocketSubscription } from '@/contexts/SocketContext';

function ComponenteEmociones() {
  useSocketSubscription('emotions_update', (data) => {
    console.log('Nueva emoción:', data);
  });
  
  return <div>Escuchando emociones...</div>;
}
```

## Componente de Estado de Conexión

Usa el componente `ConnectionStatus` para mostrar el estado de la conexión:

```tsx
import ConnectionStatus from '@/components/ConnectionStatus';

<ConnectionStatus showDetails={true} />
```

## Eventos Socket.IO Disponibles

### Eventos de Escucha (Cliente → Servidor)
- `get_emotions`
- `send_chat_message`
- `get_resumen`
- `get_sugerencias`
- `get_contradicciones`
- `get_cronologia`
- `get_mapa`
- `get_analisis_emociones`
- `get_transcripcion`
- `auth_login`
- `auth_register`
- `auth_logout`

### Eventos de Respuesta (Servidor → Cliente)
- `emotions_update`
- `emotions_complete`
- `emotions_error`
- `chat_message`
- `transcription_update`
- `resumen_update`
- `analisis_emociones_update`
- `error`

## Configuración del Servidor

Asegúrate de que tu servidor Socket.IO esté configurado para manejar estos eventos:

```javascript
// Ejemplo de servidor
io.on('connection', (socket) => {
  socket.on('get_emotions', async (data) => {
    try {
      const result = await processEmotions(data.hash);
      socket.emit('get_emotions_response', result);
    } catch (error) {
      socket.emit('emotions_error', error.message);
    }
  });
  
  // ... otros eventos
});
```

## Manejo de Errores

El sistema incluye manejo robusto de errores:
- Reconexión automática
- Timeouts configurables
- Fallbacks a datos locales (en auth)
- Estados de error claros

## Migración desde Versión Anterior

Si vienes de la versión anterior:

1. **Actualiza las props de componentes**: Remover `mode`
2. **Envuelve tu app** con `SocketProvider`
3. **Conecta cuando sea necesario**: Usar `useAutoConnect`
4. **Maneja estados de conexión**: Usar `useSocket`

## Dependencias Añadidas

```json
{
  "socket.io-client": "^4.x.x"
}
```

## Próximos Pasos

- [ ] Implementar tests para Socket.IO
- [ ] Añadir métricas de conexión
- [ ] Optimizar reconexión automática
- [ ] Añadir compresión de datos
