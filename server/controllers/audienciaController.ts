import type { Response } from 'express'
import { type AudienciaRequest, type AudienciaCreada, isValidAudiencia } from '../models/casoModels.js';
import { sendSuccess, sendError, asyncHandler } from '../middleware/responseHandler.js';
import type { AuthenticatedRequest } from '../utils/jwt.js';

// Crear un pool de conexión a la base de datos
import { Pool } from 'pg';
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'dicta',
  password: process.env.DB_PASSWORD || 'dicta',
  database: process.env.DB_NAME || 'dicta',
});


// Crear nueva audiencia
export const crearAudiencia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { titulo, fecha_hora, lugar, descripcion }: AudienciaRequest = req.body;
  const { expedienteId } = req.params;

  // Validaciones
  const audienciaData: AudienciaRequest = {
    titulo,
    fecha_hora,
    lugar: lugar || null,
    descripcion: descripcion || null
  };

  if (!isValidAudiencia(audienciaData)) {
    return sendError(res, 'Datos de la audiencia inválidos. Verifique que el título tenga máximo 300 caracteres y la fecha tenga formato válido', 400);
  }

  if (!expedienteId || Number.isNaN(parseInt(expedienteId))) {
    return sendError(res, 'ID del expediente requerido y debe ser un número válido', 400);
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el expediente existe y que el usuario tenga permisos
      const expedienteResult = await client.query(
        `SELECT e.id, e.estudio_id, ue.rol
         FROM negocio.expediente e
         INNER JOIN negocio.estudio est ON e.estudio_id = est.id
         INNER JOIN negocio.usuario_estudio ue ON est.id = ue.estudio_id
         WHERE e.id = $1 AND ue.usuario_id = $2`,
        [parseInt(expedienteId), req.user?.userId]
      );

      if (expedienteResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para crear audiencias en este expediente o el expediente no existe', 403);
      }

      // Verificar que no exista una audiencia con el mismo título en este expediente
      const existeTituloResult = await client.query(
        `SELECT id FROM negocio.audiencia WHERE titulo = $1 AND expediente_id = $2`,
        [titulo.trim(), parseInt(expedienteId)]
      );

      if (existeTituloResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Ya existe una audiencia con este título en el expediente', 409);
      }

      // Insertar la nueva audiencia
      const audienciaResult = await client.query(
        `INSERT INTO negocio.audiencia (titulo, fecha_hora, lugar, descripcion, expediente_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, titulo, fecha_hora, lugar, descripcion, expediente_id`,
        [
          titulo.trim(),
          fecha_hora,
          lugar?.trim() || null,
          descripcion?.trim() || null,
          parseInt(expedienteId)
        ]
      );

      await client.query('COMMIT');

      const nuevaAudiencia = audienciaResult.rows[0];

      const audienciaResponse: AudienciaCreada = {
        id: nuevaAudiencia.id,
        titulo: nuevaAudiencia.titulo,
        fecha_hora: nuevaAudiencia.fecha_hora,
        lugar: nuevaAudiencia.lugar,
        descripcion: nuevaAudiencia.descripcion,
        expediente_id: nuevaAudiencia.expediente_id
      };

      sendSuccess(res, {
        audiencia: audienciaResponse
      }, 'Audiencia creada exitosamente', 201);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al crear audiencia:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Eliminar audiencia (solo propietario del estudio)
export const eliminarAudiencia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { audienciaId } = req.params;
    const usuarioId = req.user?.userId;

    if (!audienciaId || !usuarioId) {
      return sendError(res, 'Parámetros inválidos', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario tiene permisos para eliminar la audiencia
      const permisoCheck = await client.query(
        `SELECT a.id, a.titulo
         FROM negocio.audiencia a
         INNER JOIN negocio.expediente e ON a.expediente_id = e.id
         INNER JOIN negocio.estudio est ON e.estudio_id = est.id
         INNER JOIN negocio.usuario_estudio ue ON est.id = ue.estudio_id
         WHERE a.id = $1 AND ue.usuario_id = $2 AND ue.rol = 'propietario'`,
        [audienciaId, usuarioId]
      );

      if (permisoCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para eliminar esta audiencia o no existe', 404);
      }

      // Eliminar primero las transcripciones asociadas (por claves foráneas)
      await client.query(
        `DELETE FROM negocio.transcripcion WHERE audiencia_id = $1`,
        [audienciaId]
      );

      // Eliminar la audiencia
      const deleteResult = await client.query(
        `DELETE FROM negocio.audiencia WHERE id = $1`,
        [audienciaId]
      );

      if (deleteResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Audiencia no encontrada', 404);
      }

      await client.query('COMMIT');

      sendSuccess(res, {}, 'Audiencia eliminada exitosamente');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando audiencia:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

