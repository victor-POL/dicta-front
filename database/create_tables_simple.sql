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
    telefono VARCHAR(20)
);

-- ============================================
-- TABLA: Expediente
-- ============================================
CREATE TABLE negocio.expediente (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    cliente VARCHAR(200) NOT NULL,
    fecha_inicio DATE NOT NULL,
    descripcion TEXT,
    estudio_id INTEGER NOT NULL,
    
    CONSTRAINT fk_expediente_estudio FOREIGN KEY (estudio_id) 
        REFERENCES negocio.estudio(id)
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