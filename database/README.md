# Base de Datos DICTA - Instrucciones de Instalación

## 📋 Descripción
Este directorio contiene los scripts SQL para crear la base de datos del sistema DICTA (transcripciones jurídicas).

## 🗃️ Estructura de la Base de Datos

### Schema: `negocio`
Contiene todas las tablas principales del sistema:

1. **👤 usuario** - Usuarios del sistema
2. **🏢 estudio** - Estudios jurídicos
3. **📁 expediente** - Expedientes jurídicos
4. **⚖️ audiencia** - Audiencias programadas
5. **🎤 transcripcion** - Transcripciones de audio/video
6. **🔗 usuario_estudio** - Relación usuarios-estudios

## 🚀 Instalación

### 1. Conectar a PostgreSQL
```bash
psql -h localhost -p 5432 -U dicta -d dicxta
```

### 2. Ejecutar el script
```sql
\i database/schema_negocio.sql
```

### 3. Verificar instalación
```sql
-- Ver todas las tablas creadas
\dt negocio.*

-- Ver el schema creado
\dn

-- Ver las vistas creadas
\dv negocio.*
```

## 🔧 Configuración del Backend

Ya tienes configurado en tu `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=dicta
DB_PASSWORD=dicta
DB_NAME=dicxta
```

## 📊 Características del Schema

### ✅ **Implementado:**
- ✅ Schema `negocio` creado
- ✅ Todas las tablas del diagrama
- ✅ Relaciones Foreign Key correctas
- ✅ Índices para optimizar consultas
- ✅ Triggers para actualizar `updated_at`
- ✅ Constraints para validación de datos
- ✅ Vistas útiles para consultas complejas
- ✅ Búsqueda de texto completo en transcripciones
- ✅ Campos de auditoría (created_at, updated_at, is_active)
- ✅ Soft delete (is_active)

### 🔐 **Seguridad:**
- Passwords hasheados
- Foreign keys con CASCADE apropiados
- Constraints de validación
- Prevención de duplicados

### 📈 **Optimización:**
- Índices en campos de búsqueda frecuente
- Índice GIN para búsqueda full-text
- Vistas para consultas complejas

## 🧪 Datos de Prueba

El script incluye:
- Usuario admin por defecto: `admin@dicta.com`
- Estudio jurídico de ejemplo
- Relación usuario-estudio

## 📝 Próximos Pasos

1. **Ejecutar el script SQL**
2. **Probar la conexión** desde el backend
3. **Crear endpoints** para cada tabla
4. **Implementar autenticación** con la tabla usuario
5. **Agregar validaciones** en el backend

## 🔍 Consultas Útiles

```sql
-- Ver todos los expedientes con información completa
SELECT * FROM negocio.v_expedientes_completos;

-- Estadísticas de transcripciones
SELECT * FROM negocio.v_estadisticas_transcripciones;

-- Buscar en transcripciones por texto
SELECT * FROM negocio.transcripcion 
WHERE to_tsvector('spanish', contenido) @@ to_tsquery('spanish', 'palabra_a_buscar');

-- Expedientes de un estudio específico
SELECT e.*, est.nombre as estudio 
FROM negocio.expediente e
JOIN negocio.estudio est ON e.estudio_id = est.id
WHERE est.id = 1;
```

## ⚠️ Notas Importantes

- El script es **idempotente** - se puede ejecutar múltiples veces
- Usa **soft delete** - los registros se marcan como inactivos, no se eliminan
- Los **passwords** deben hashearse antes de insertar
- Las **transcripciones** incluyen hash SHA-256 para detectar duplicados