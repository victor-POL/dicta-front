import pool from '../config/database';
import { sendSuccess, sendError } from '../middleware/responseHandler';
import type { Request, Response } from 'express';

interface AuthRequest extends Request {
  usuarioId?: number;
}

export const eliminarTranscripcion = async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const transcripcionId = parseInt(req.params.transcripcionId);
    const usuarioId = req.usuarioId;

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