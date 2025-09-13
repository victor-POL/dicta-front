# Backend API - Dicta Front

Este proyecto incluye un backend API construido con Express.js y TypeScript.

## Estructura del Backend

```
server/
├── index.ts              # Archivo principal del servidor
├── tsconfig.json         # Configuración TypeScript para el servidor
├── routes/               # Definición de rutas
│   └── index.ts         # Rutas principales
├── controllers/          # Lógica de controladores (vacío, listo para uso)
├── middleware/           # Middleware personalizado
│   └── responseHandler.ts # Helpers para respuestas de API
├── models/               # Modelos y tipos TypeScript
│   └── types.ts         # Tipos principales
└── services/            # Servicios de negocio (vacío, listo para uso)
```

## Scripts Disponibles

### Desarrollo
- `npm run dev` - Solo frontend (puerto 5173)
- `npm run dev:full` - Frontend + Backend simultáneamente
- `npm run server:dev` - Solo backend con auto-reload (puerto 3001)

### Producción
- `npm run build:full` - Build frontend y backend
- `npm run server:build` - Solo build del backend
- `npm run server:start` - Ejecutar backend en producción

## Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno necesarias
3. El servidor corre en puerto 3001 por defecto
4. CORS configurado para el frontend (puerto 5173)

## Endpoints Disponibles

### Health Check
- **GET** `/api/health` - Estado del servidor

### Test
- **GET** `/api/test` - Endpoint de prueba

## Desarrollo

El proxy de Vite está configurado para redirigir todas las peticiones `/api/*` al backend en `http://localhost:3001`.

### Ejemplo de uso desde el frontend:
```typescript
// Esto se redirige automáticamente a http://localhost:3001/api/test
const response = await fetch('/api/test');
```

## Próximos Pasos

Para agregar nuevos endpoints:

1. Crear controladores en `server/controllers/`
2. Crear rutas en `server/routes/`
3. Importar y usar las rutas en `server/index.ts`
4. Agregar modelos/tipos en `server/models/`
5. Crear servicios en `server/services/`

## Testing

Para probar que el backend funciona correctamente:

1. Ejecuta `npm run server:dev`
2. Visita `http://localhost:3001/api/health`
3. Deberías ver: `{"status":"OK","message":"Server is running","timestamp":"..."}`