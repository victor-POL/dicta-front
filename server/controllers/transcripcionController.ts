import pool from '../config/database';
import { sendSuccess, sendError } from '../middleware/responseHandler';
import type { AuthenticatedRequest } from '../utils/jwt';
import type { Response } from 'express';

export const obtenerTranscripciones = async (req: AuthenticatedRequest, res: Response) => {
  const client = await pool.connect();

  try {
    const usuarioId = req.user?.userId;

    if (!usuarioId) {
      return sendError(res, 'No autorizado', 401);
    }

    // Query para obtener todas las transcripciones a las que el usuario tiene acceso
    // Un usuario tiene acceso a las transcripciones si:
    // 1. Es miembro del equipo asociado al expediente (transcripciones vinculadas)
    // 2. Es el creador de la transcripción (transcripciones sin vincular)
    // 3. Es propietario del estudio (puede ver todas las transcripciones del estudio)
    const query = `
      SELECT DISTINCT
        t.id,
        t.hash,
        t.nombre,
        t.tipo,
        t.estado,
        t.duracion,
        t.url,
        t.archivo,
        t.fecha_creacion,
        t.usuario_id,
        -- Datos de audiencia vinculada (pueden ser NULL)
        a.id as audiencia_id,
        a.titulo as audiencia_titulo,
        a.fecha_hora as audiencia_fecha_hora,
        a.lugar as audiencia_lugar,
        a.descripcion as audiencia_descripcion,
        a.expediente_id as audiencia_expediente_id,
        -- Datos del expediente vinculado (pueden ser NULL)
        e.id as expediente_id,
        e.numero as expediente_numero,
        e.cliente as expediente_cliente,
        e.fecha_inicio as expediente_fecha_inicio,
        e.descripcion as expediente_descripcion,
        e.estado as expediente_estado,
        e.estudio_id as expediente_estudio_id,
        es.nombre as estudio_nombre
      FROM negocio.transcripcion t
      LEFT JOIN negocio.audiencia a ON t.audiencia_id = a.id
      LEFT JOIN negocio.expediente e ON a.expediente_id = e.id
      LEFT JOIN negocio.estudio es ON e.estudio_id = es.id
      LEFT JOIN negocio.equipo eq ON es.id = eq.estudio_id
      LEFT JOIN negocio.equipo_miembro em ON eq.id = em.equipo_id
      WHERE 
        -- Caso 1: Es el creador de la transcripción (vinculada o sin vincular)
        t.usuario_id = $1 
        -- Caso 2: Es miembro del equipo (transcripciones vinculadas) 
        OR (em.usuario_id = $1 AND em.estado = 'aceptado')
        -- Caso 3: Es propietario del estudio (todas las transcripciones del estudio)
        OR (es.propietario_id = $1)
      ORDER BY t.fecha_creacion DESC
    `;

    const result = await client.query(query, [usuarioId]);

    // Agrupar los resultados por transcripción para estructurar la respuesta
    const transcripcionesMap = new Map();

    result.rows.forEach(row => {
      const transcripcionId = row.id;

      if (!transcripcionesMap.has(transcripcionId)) {
        transcripcionesMap.set(transcripcionId, {
          id: row.id,
          hash: row.hash,
          nombre: row.nombre,
          tipo: row.tipo,
          estado: row.estado,
          duracion: row.duracion,
          url: row.url,
          archivo: row.archivo,
          fecha_creacion: row.fecha_creacion,
          audiencia_vinculada: [],
          expediente_vinculado: []
        });
      }

      const transcripcion = transcripcionesMap.get(transcripcionId);

      // Agregar audiencia vinculada si no existe
      const audienciaExiste = transcripcion.audiencia_vinculada.some(
        (a: any) => a.id === row.audiencia_id
      );

      if (!audienciaExiste && row.audiencia_id) {
        transcripcion.audiencia_vinculada.push({
          id: row.audiencia_id,
          titulo: row.audiencia_titulo,
          fecha_hora: row.audiencia_fecha_hora,
          lugar: row.audiencia_lugar,
          descripcion: row.audiencia_descripcion,
          expediente_id: row.audiencia_expediente_id
        });
      }

      // Agregar expediente vinculado si no existe
      const expedienteExiste = transcripcion.expediente_vinculado.some(
        (e: any) => e.id === row.expediente_id
      );

      if (!expedienteExiste && row.expediente_id) {
        transcripcion.expediente_vinculado.push({
          id: row.expediente_id,
          numero_expediente: row.expediente_numero,
          cliente: row.expediente_cliente,
          fecha_inicio: row.expediente_fecha_inicio,
          descripcion: row.expediente_descripcion,
          estudio_id: row.expediente_estudio_id,
          estudio_nombre: row.estudio_nombre,
          estado: row.expediente_estado
        });
      }
    });

    const transcripciones = Array.from(transcripcionesMap.values());

    return sendSuccess(res, {
      message: 'Transcripciones obtenidas exitosamente',
      transcripciones
    });

  } catch (error) {
    console.error('❌ Error obteniendo transcripciones:', error);
    return sendError(res, 'Error interno del servidor al obtener las transcripciones', 500);
  } finally {
    client.release();
  }
};


export const eliminarTranscripcion = async (req: AuthenticatedRequest, res: Response) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const transcripcionId = parseInt(req.params.transcripcionId);
    const usuarioId = req.user?.userId;

    if (!transcripcionId || Number.isNaN(transcripcionId)) {
      return sendError(res, 'ID de transcripción inválido', 400);
    }

    if (!usuarioId) {
      return sendError(res, 'No autorizado', 401);
    }

    // Verificar que la transcripción existe y que el usuario tiene permisos
    // Verificamos que el usuario sea miembro del equipo asociado al expediente de la transcripción
    const verificacionQuery = `
      SELECT 
        t.id,
        t.nombre,
        e.numero_expediente,
        es.nombre as estudio_nombre
      FROM negocio.transcripcion t
      JOIN negocio.audiencia a ON t.audiencia_id = a.id
      JOIN negocio.expediente e ON a.expediente_id = e.id
      JOIN negocio.equipo eq ON e.equipo_id = eq.id
      JOIN negocio.estudio es ON eq.estudio_id = es.id
      JOIN negocio.equipo_miembro em ON eq.id = em.equipo_id
      WHERE t.id = $1 AND em.usuario_id = $2
    `;

    const verificacionResult = await client.query(verificacionQuery, [transcripcionId, usuarioId]);

    if (verificacionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return sendError(res, 'No tienes permisos para eliminar esta transcripción', 403);
    }

    const transcripcion = verificacionResult.rows[0];

    // Eliminar la transcripción
    const deleteResult = await client.query(
      'DELETE FROM negocio.transcripcion WHERE id = $1',
      [transcripcionId]
    );

    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return sendError(res, 'Transcripción no encontrada', 404);
    }

    await client.query('COMMIT');

    return sendSuccess(res, {
      message: 'Transcripción eliminada exitosamente',
      transcripcion: {
        id: transcripcion.id,
        nombre: transcripcion.nombre,
        expediente: transcripcion.numero_expediente,
        estudio: transcripcion.estudio_nombre
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error eliminando transcripción:', error);
    return sendError(res, 'Error interno del servidor al eliminar la transcripción', 500);
  } finally {
    client.release();
  }
};