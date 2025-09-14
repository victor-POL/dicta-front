import type { Response } from 'express';
import {
  type CasoRequest,
  type Caso,
  isValidCaso
} from '../models/casoModels.js';
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

// Crear nuevo caso (expediente)
export const crearCaso = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { numero, cliente, fecha_inicio, descripcion }: CasoRequest = req.body;
  const { estudioId } = req.params;

  // Validaciones
  const casoData: CasoRequest = {
    numero,
    cliente,
    fecha_inicio,
    descripcion: descripcion || null
  };

  if (!isValidCaso(casoData)) {
    return sendError(res, 'Datos del caso inválidos. Verifique que el número tenga máximo 50 caracteres, el cliente máximo 200, y la fecha tenga formato válido', 400);
  }

  if (!estudioId || Number.isNaN(parseInt(estudioId))) {
    return sendError(res, 'ID del estudio requerido y debe ser un número válido', 400);
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario tenga permisos en el estudio
      const permisoResult = await client.query(
        `SELECT ue.rol, e.id 
         FROM negocio.usuario_estudio ue
         INNER JOIN negocio.estudio e ON ue.estudio_id = e.id
         WHERE ue.usuario_id = $1 AND e.id = $2`,
        [req.user?.userId, parseInt(estudioId)]
      );

      if (permisoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para crear casos en este estudio', 403);
      }

      // Verificar que el número del caso no exista ya en este estudio
      const existeNumeroResult = await client.query(
        `SELECT id FROM negocio.expediente WHERE numero = $1 AND estudio_id = $2`,
        [numero.trim(), parseInt(estudioId)]
      );

      if (existeNumeroResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Ya existe un caso con este número de expediente en el estudio', 409);
      }

      // Insertar el nuevo caso
      const casoResult = await client.query(
        `INSERT INTO negocio.expediente (numero, cliente, fecha_inicio, descripcion, estudio_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, numero, cliente, fecha_inicio, descripcion, estudio_id`,
        [numero.trim(), cliente.trim(), fecha_inicio, descripcion?.trim() || null, parseInt(estudioId)]
      );

      await client.query('COMMIT');

      const nuevoCaso = casoResult.rows[0];

      const casoResponse: Caso = {
        id: nuevoCaso.id,
        numero: nuevoCaso.numero,
        cliente: nuevoCaso.cliente,
        fecha_inicio: nuevoCaso.fecha_inicio,
        descripcion: nuevoCaso.descripcion,
        estudio_id: nuevoCaso.estudio_id
      };

      sendSuccess(res, {
        caso: casoResponse
      }, 'Caso creado exitosamente', 201);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error al crear caso:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});