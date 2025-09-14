-- ============================================
-- Creación de Tablas - Schema Negocio
-- ============================================

-- Crear schema negocio
CREATE SCHEMA IF NOT EXISTS negocio;

-- ============================================
-- TABLA: Usuario
-- ============================================
CREATE TABLE negocio.usuario (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

-- ============================================
-- TABLA: Estudio
-- ============================================
CREATE TABLE negocio.estudio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    propietario_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_estudio_propietario FOREIGN KEY (propietario_id) 
        REFERENCES negocio.usuario(id)
);

-- ============================================
-- TABLA: Equipo
-- ============================================
CREATE TABLE negocio.equipo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estudio_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_equipo_estudio FOREIGN KEY (estudio_id) 
        REFERENCES negocio.estudio(id)
);

-- ============================================
-- TABLA: Equipo_Miembro (Relación Usuario-Equipo)
-- ============================================
CREATE TABLE negocio.equipo_miembro (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    fecha_invitacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_aceptacion TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'pendiente',
    
    CONSTRAINT fk_equipo_miembro_equipo FOREIGN KEY (equipo_id) 
        REFERENCES negocio.equipo(id) ON DELETE CASCADE,
    CONSTRAINT fk_equipo_miembro_usuario FOREIGN KEY (usuario_id) 
        REFERENCES negocio.usuario(id) ON DELETE CASCADE,
    
    -- Un usuario no puede estar invitado dos veces al mismo equipo
    CONSTRAINT uk_equipo_miembro UNIQUE (equipo_id, usuario_id),
    
    -- Estados válidos para la invitación
    CONSTRAINT chk_equipo_miembro_estado CHECK (estado IN ('pendiente', 'aceptado', 'rechazado'))
);

-- ============================================
-- TABLA: Usuario_Estudio (Relación Usuario-Estudio con Roles)
-- ============================================
CREATE TABLE negocio.usuario_estudio (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    estudio_id INTEGER NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'miembro',
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usuario_estudio_usuario FOREIGN KEY (usuario_id) 
        REFERENCES negocio.usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_estudio_estudio FOREIGN KEY (estudio_id) 
        REFERENCES negocio.estudio(id) ON DELETE CASCADE,
    
    -- Un usuario no puede tener múltiples roles en el mismo estudio
    CONSTRAINT uk_usuario_estudio UNIQUE (usuario_id, estudio_id),
    
    -- Roles válidos
    CONSTRAINT chk_usuario_estudio_rol CHECK (rol IN ('propietario', 'miembro'))
);

-- ============================================
-- TABLA: Expediente
-- ============================================
CREATE TABLE negocio.expediente (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    cliente VARCHAR(200) NOT NULL,
    fecha_inicio DATE NOT NULL,
    descripcion TEXT,
    estudio_id INTEGER NOT NULL,
    
    CONSTRAINT fk_expediente_estudio FOREIGN KEY (estudio_id) 
        REFERENCES negocio.estudio(id),
    
    -- El número debe ser único solo dentro del mismo estudio
    CONSTRAINT uk_expediente_numero_estudio UNIQUE (numero, estudio_id)
);

-- ============================================
-- TABLA: Audiencia
-- ============================================
CREATE TABLE negocio.audiencia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    lugar VARCHAR(200),
    descripcion TEXT,
    expediente_id INTEGER NOT NULL,
    
    CONSTRAINT fk_audiencia_expediente FOREIGN KEY (expediente_id) 
        REFERENCES negocio.expediente(id)
);

-- ============================================
-- TABLA: Transcripcion
-- ============================================
CREATE TABLE negocio.transcripcion (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'audio',
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    audiencia_id INTEGER NOT NULL,
    
    CONSTRAINT fk_transcripcion_audiencia FOREIGN KEY (audiencia_id) 
        REFERENCES negocio.audiencia(id),
    
    -- Constraints para validar tipos y estados específicos
    CONSTRAINT chk_transcripcion_tipo CHECK (tipo IN ('youtube', 'audio', 'realtime')),
    CONSTRAINT chk_transcripcion_estado CHECK (estado IN ('pendiente', 'procesado', 'error'))
);

-- ============================================
-- DOCUMENTACIÓN DE LA ESTRUCTURA MULTIUSUARIO
-- ============================================

/*
FLUJO DE TRABAJO:
1. Un usuario crea un estudio -> Se convierte automáticamente en PROPIETARIO
2. El propietario puede crear equipos dentro de su estudio
3. A los equipos se pueden invitar otros usuarios como MIEMBROS
4. Los miembros de equipos también pueden tener sus propios estudios donde son PROPIETARIOS
5. Un usuario puede ser PROPIETARIO de algunos estudios y MIEMBRO de equipos en otros estudios

TABLAS PRINCIPALES:
- usuario: Información básica de usuarios
- estudio: Estudios jurídicos con propietario definido
- equipo: Equipos de trabajo dentro de cada estudio
- equipo_miembro: Miembros de cada equipo (con estados de invitación)
- usuario_estudio: Relación usuario-estudio con roles (propietario/miembro)

CASOS DE USO:
- Un abogado crea su estudio -> Propietario
- Invita a otros abogados a su equipo -> Miembros
- Esos miembros pueden tener sus propios estudios en paralelo
- Un usuario puede participar en múltiples equipos de diferentes estudios
*/