# 🚀 Servidor Socket.IO Simulado para Dicta

Este servidor simula completamente la API Socket.IO de backend para que puedas desarrollar y probar tu aplicación sin necesidad del servidor real.

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias del servidor mock
npm install socket.io nodemon

# 2. Ejecutar el servidor
node mock-socket-server.cjs

# O con auto-reload para desarrollo:
npx nodemon mock-socket-server.cjs
```

## 📡 Conexión

El servidor se ejecuta en: **http://localhost:4001**

Tu aplicación se conectará automáticamente usando el `socketService.ts`.

## 🎯 Eventos Simulados

### 🔐 **Autenticación**
- `auth_login` → `auth_login_response`
- `auth_register` → `auth_register_response` 
- `auth_logout` → `auth_logout_response`

**Usuarios de prueba:**
```javascript
// Admin
correo: "admin@dicta.com"
password: "admin123"

// Usuario normal
correo: "usuario@dicta.com" 
password: "usuario123"
```

### 💬 **Chat**
- `send_chat_message` → `send_chat_message_response`
- Evento en tiempo real: `chat_message`

### 📝 **Transcripción** 
- `get_transcripcion` → `get_transcripcion_response`
- Evento en tiempo real: `transcription_update`

### 😊 **Emociones**
- `get_emotions` → `get_emotions_response`
- `get_analisis_emociones` → `get_analisis_emociones_response`

### 📄 **Resumen**
- `get_resumen` → `get_resumen_response`
- Evento en tiempo real: `resumen_update`

### 💡 **Sugerencias**
- `get_sugerencias` → `get_sugerencias_response`
- Evento en tiempo real: `sugerencias_update`

### ⚡ **Contradicciones**
- `get_contradicciones` → `get_contradicciones_response`

### ⏰ **Cronología**
- `get_cronologia` → `get_cronologia_response`

### 🗺️ **Mapa Conceptual**
- `get_mapa` → `get_mapa_response`

## 🔄 Funcionamiento

1. **Conexión**: Los clientes se conectan automáticamente
2. **Autenticación**: Login/registro con usuarios mock
3. **Datos**: Respuestas realistas con delays simulados
4. **Tiempo Real**: Eventos automáticos (nuevos mensajes, segmentos, etc.)
5. **Logs**: Actividad detallada en consola

## ✨ Características

- ✅ **Datos realistas** con estructura completa
- ✅ **Delays simulados** para experiencia real
- ✅ **Eventos en tiempo real** automáticos
- ✅ **Logs detallados** para debugging
- ✅ **Usuarios mock** para testing
- ✅ **Respuestas de chat** dinámicas
- ✅ **CORS habilitado** para desarrollo

## 🎮 Uso con tu aplicación

```bash
# Terminal 1: Iniciar servidor mock
node mock-socket-server.cjs

# Terminal 2: Iniciar tu aplicación React
npm run dev
```

¡Tu aplicación funcionará completamente con datos simulados!

## 🐛 Debugging

El servidor muestra logs detallados:
```
✅ Cliente conectado: abc123
💬 Mensaje de chat: ¿Cómo estuvo la audiencia?
📝 Solicitando transcripción para: donadonadonadona
🆕 Nuevo segmento enviado: La audiencia queda suspendida...
```

## 🔧 Personalización

Para modificar los datos simulados, edita las constantes en `mock-socket-server.cjs`:

```javascript
const MOCK_DATA = {
  emociones: { /* tus datos */ },
  transcripcion: { /* tus datos */ },
  // etc...
};
```

---

**¡Ahora puedes desarrollar tu aplicación completamente offline!** 🎉
