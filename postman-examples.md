# Testing Socket.IO en Tiempo Real con Postman

## Configuración Inicial
- **Base URL**: `http://localhost:4001`
- **Headers necesarios**: `Content-Type: application/json`

## 1. Verificar Estado del Servidor
```
GET http://localhost:4001/api/status
```

**Respuesta esperada:**
```json
{
  "status": "running",
  "connectedClients": 2,
  "timestamp": "2025-09-12T..."
}
```

## 2. Agregar Segmento de Transcripción

```
POST http://localhost:4001/api/transcripcion/segment
Content-Type: application/json

{
  "sessionId": "donadonadonadona",
  "segment": {
    "texto": "Buenos días, señor juez. La defensa solicita la palabra para presentar un nuevo elemento probatorio que acaba de llegar a nuestro conocimiento.",
    "inicio": 185.5,
    "fin": 195.2,
    "hablante": "Lic. María García - Defensa"
  }
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Segmento enviado"
}
```

## 3. Agregar Nueva Sugerencia

```
POST http://localhost:4001/api/sugerencias/add
Content-Type: application/json

{
  "sessionId": "donadonadonadona",
  "sugerencia": {
    "tipo": "procesal",
    "titulo": "Solicitar receso técnico",
    "descripcion": "El testigo muestra signos de nerviosismo. Recomendamos solicitar un receso de 10 minutos para permitir que se tranquilice antes de continuar con el interrogatorio.",
    "prioridad": "alta"
  }
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sugerencia enviada"
}
```

#### 1. Actualizar Emociones
```
POST http://localhost:4001/api/emociones/update
Content-Type: application/json

{
  "sessionId": "session_123",
  "emociones": {
    "alegria": 45,
    "tristeza": 15,
    "miedo": 20,
    "enojo": 10,
    "sorpresa": 10
  },
  "orador_detectado": "Usuario Principal",
  "confianza_general": 0.92
}
```

```
POST http://localhost:4001/api/emociones/update
Content-Type: application/json

{
  "sessionId": "donadonadonadona",
  "emociones": {
    "nerviosismo": 45,
    "confianza": 25,
    "ansiedad": 20,
    "determinacion": 8,
    "confusion": 2
  }
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Emociones actualizadas"
}
```

### Campos adicionales para emociones:
- **sessionId**: Identificador de la sesión (requerido)
- **emociones**: Objeto con los valores de emociones (requerido, se normalizan automáticamente)
- **orador_detectado**: (Opcional) Nombre del orador detectado
- **confianza_general**: (Opcional) Nivel de confianza del análisis (0.0 - 1.0)

**Evento Socket.IO emitido:**
```json
{
  "sessionId": "session_123",
  "emociones": {
    "alegria": 45,
    "tristeza": 15,
    "miedo": 20,
    "enojo": 10,
    "sorpresa": 10
  },
  "orador_detectado": "Usuario Principal",
  "confianza_general": 0.92,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## 5. Enviar Mensaje de Chat

```
POST http://localhost:4001/api/chat/message
Content-Type: application/json

{
  "sessionId": "donadonadonadona",
  "message": "Atención: El testigo acaba de contradecir su declaración anterior sobre la hora del incidente.",
  "sender": "Sistema IA"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Mensaje enviado"
}
```

## Ejemplos de Pruebas en Secuencia

### Escenario 1: Simulando una audiencia en vivo

1. **Inicio de testimonio**:
```json
POST /api/transcripcion/segment
{
  "sessionId": "donadonadonadona",
  "segment": {
    "texto": "Mi nombre es Carlos López y el día de los hechos me encontraba en mi domicilio.",
    "inicio": 300.0,
    "fin": 306.5,
    "hablante": "Testigo Carlos López"
  }
}
```

2. **Detección de nerviosismo**:
```json
POST /api/emociones/update
{
  "sessionId": "donadonadonadona",
  "emociones": {
    "nerviosismo": 60,
    "ansiedad": 25,
    "confianza": 10,
    "determinacion": 3,
    "confusion": 2
  }
}
```

3. **Sugerencia del sistema**:
```json
POST /api/sugerencias/add
{
  "sessionId": "donadonadonadona",
  "sugerencia": {
    "tipo": "táctica",
    "titulo": "Cambiar enfoque de pregunta",
    "descripcion": "El testigo muestra alta ansiedad. Considera hacer preguntas más directas y específicas.",
    "prioridad": "media"
  }
}
```

4. **Continuación del testimonio**:
```json
POST /api/transcripcion/segment
{
  "sessionId": "donadonadonadona",
  "segment": {
    "texto": "Recuerdo perfectamente que eran las 9:30 PM porque acababa de terminar mi programa favorito.",
    "inicio": 320.0,
    "fin": 327.8,
    "hablante": "Testigo Carlos López"
  }
}
```

5. **Alert del sistema**:
```json
POST /api/chat/message
{
  "sessionId": "donadonadonadona",
  "message": "⚠️ CONTRADICCIÓN DETECTADA: En declaración previa el testigo mencionó que fueron las 10:00 PM",
  "sender": "Sistema IA - Análisis"
}
```

## Tips para Testing

1. **Mantén la ventana del navegador abierta** en `http://localhost:5173` para ver los cambios en tiempo real

2. **Usa el mismo sessionId** ("donadonadonadona") para que los eventos se muestren en tu aplicación

3. **Envía los requests en secuencia** para simular una audiencia real

4. **Experimenta con diferentes valores** de emociones para ver cómo cambia el gráfico

5. **Verifica que el servidor esté corriendo** con `GET /api/status` antes de enviar otros requests

## Eventos Socket.IO que se Disparan

Cuando envías requests HTTP, el servidor emite estos eventos Socket.IO:

- `transcripcion_segment` → Agrega segmentos a la transcripción
- `nueva_sugerencia` → Aparece en el panel de sugerencias  
- `emociones_actualizadas` → Actualiza el gráfico de emociones
- `nuevo_mensaje_chat` → Agrega mensaje al chat

¡Tu aplicación React recibirá estos eventos automáticamente y actualizará la UI en tiempo real! 🚀
