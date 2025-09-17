import type { Response } from 'express'
import type {
  CasoRequest,
  Caso,
  CasoCreado
} from '../models/casoModels'
import { isValidCaso } from '../models/casoModels'
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
         RETURNING id, numero, cliente, fecha_inicio, descripcion, estado, estudio_id`,
        [numero.trim(), cliente.trim(), fecha_inicio, descripcion?.trim() || null, parseInt(estudioId)]
      );

      await client.query('COMMIT');

      const nuevoCaso = casoResult.rows[0];

      const casoResponse: CasoCreado = {
        id: nuevoCaso.id,
        numero: nuevoCaso.numero,
        cliente: nuevoCaso.cliente,
        fecha_inicio: nuevoCaso.fecha_inicio,
        descripcion: nuevoCaso.descripcion,
        estado: nuevoCaso.estado,
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

// Obtener casos del usuario (solo estudios donde es miembro/propietario)
export const obtenerCasos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Primero obtener los expedientes básicos
    const expedientesQuery = `
      SELECT 
        e.id,
        e.numero as numero_expediente,
        e.cliente,
        TO_CHAR(e.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio,
        e.descripcion,
        e.estado,
        e.estudio_id,
        est.nombre as estudio_nombre
      FROM negocio.expediente e
      INNER JOIN negocio.estudio est ON e.estudio_id = est.id
      INNER JOIN negocio.usuario_estudio ue ON est.id = ue.estudio_id
      WHERE ue.usuario_id = $1
      ORDER BY e.fecha_inicio DESC
    `

    const expedientesResult = await pool.query(expedientesQuery, [req.user?.userId])

    if (expedientesResult.rows.length === 0) {
      return sendSuccess(res, { casos: [] }, 'No se encontraron casos')
    }

    // Obtener todas las audiencias con transcripciones para estos expedientes
    const expedienteIds = expedientesResult.rows.map(row => row.id)
    const audienciasQuery = `
      SELECT 
        a.id,
        a.titulo,
        TO_CHAR(a.fecha_hora, 'DD/MM/YYYY HH24:MI') as fecha_hora,
        a.lugar,
        a.descripcion,
        a.expediente_id,
        COALESCE(
          json_agg(
            CASE 
              WHEN t.id IS NOT NULL THEN
                json_build_object(
                  'id', t.id,
                  'hash', t.hash,
                  'nombre', t.nombre,
                  'tipo', t.tipo,
                  'estado', t.estado,
                  'duracion', t.duracion,
                  'url', t.url,
                  'archivo', t.archivo,
                  'fecha_creacion', t.fecha_creacion,
                  'audiencia_id', t.audiencia_id,
                  'expediente_id', t.expediente_id
                )
              ELSE NULL
            END
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as transcripciones
      FROM negocio.audiencia a
      LEFT JOIN negocio.transcripcion t ON a.id = t.audiencia_id
      WHERE a.expediente_id = ANY($1)
      GROUP BY a.id, a.titulo, a.fecha_hora, a.lugar, a.descripcion, a.expediente_id
      ORDER BY a.expediente_id, a.fecha_hora DESC
    `

    const audienciasResult = await pool.query(audienciasQuery, [expedienteIds])

    // Agrupar audiencias por expediente
    const audienciasPorExpediente = new Map()
    audienciasResult.rows.forEach(row => {
      if (!audienciasPorExpediente.has(row.expediente_id)) {
        audienciasPorExpediente.set(row.expediente_id, [])
      }

      // Procesar transcripciones para asegurar tipos correctos
      const transcripcionesProcessed = (row.transcripciones || []).map((t: any) => ({
        id: t.id,
        hash: t.hash,
        nombre: t.nombre || null,
        tipo: t.tipo,
        estado: t.estado,
        duracion: t.duracion || null,
        url: t.url || null,
        archivo: t.archivo || null,
        fecha_creacion: t.fecha_creacion,
        audiencia_id: t.audiencia_id,
        expediente_id: t.expediente_id || null
      }))

      audienciasPorExpediente.get(row.expediente_id).push({
        id: row.id,
        titulo: row.titulo,
        fecha_hora: row.fecha_hora,
        lugar: row.lugar || null,
        descripcion: row.descripcion || null,
        expediente_id: row.expediente_id,
        transcripciones: transcripcionesProcessed
      })
    })

    // Construir casos con la interfaz Caso exacta
    const casos: Caso[] = expedientesResult.rows.map(row => ({
      id: row.id,
      numero_expediente: row.numero_expediente,
      cliente: row.cliente,
      fecha_inicio: row.fecha_inicio,
      descripcion: row.descripcion || null,
      estudio_id: row.estudio_id,
      estudio_nombre: row.estudio_nombre,
      estado: row.estado,
      audiencias: audienciasPorExpediente.get(row.id) || []
    }))

    sendSuccess(res, { casos }, 'Casos obtenidos exitosamente')
  } catch (error) {
    console.error('Error al obtener casos:', error)
    sendError(res, 'Error interno del servidor', 500)
  }
})

// Eliminar caso (solo propietario del estudio)
export const eliminarCaso = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { casoId } = req.params;
    const usuarioId = req.user?.userId;

    if (!casoId || !usuarioId) {
      return sendError(res, 'Parámetros inválidos', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario tiene permisos para eliminar el caso
      const permisoCheck = await client.query(
        `SELECT e.id, e.numero, e.cliente
         FROM negocio.expediente e
         INNER JOIN negocio.estudio est ON e.estudio_id = est.id
         INNER JOIN negocio.usuario_estudio ue ON est.id = ue.estudio_id
         WHERE e.id = $1 AND ue.usuario_id = $2 AND ue.rol = 'propietario'`,
        [casoId, usuarioId]
      );

      if (permisoCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para eliminar este caso o no existe', 404);
      }

      // Eliminar en orden (por claves foráneas):
      // 1. Transcripciones
      await client.query(
        `DELETE FROM negocio.transcripcion 
         WHERE audiencia_id IN (
           SELECT id FROM negocio.audiencia WHERE expediente_id = $1
         )`,
        [casoId]
      );

      // 2. Audiencias
      await client.query(
        `DELETE FROM negocio.audiencia WHERE expediente_id = $1`,
        [casoId]
      );

      // 3. El expediente/caso
      const deleteResult = await client.query(
        `DELETE FROM negocio.expediente WHERE id = $1`,
        [casoId]
      );

      if (deleteResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Caso no encontrado', 404);
      }

      await client.query('COMMIT');

      sendSuccess(res, {}, 'Caso eliminado exitosamente');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando caso:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Obtener casos de un estudio específico
export const obtenerCasosPorEstudio = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { estudioId } = req.params;

  if (!estudioId || Number.isNaN(parseInt(estudioId))) {
    return sendError(res, 'ID del estudio requerido y debe ser un número válido', 400);
  }

  try {
    // Verificar que el usuario tenga permisos en el estudio
    const permisoResult = await pool.query(
      `SELECT ue.rol, e.id 
       FROM negocio.usuario_estudio ue
       INNER JOIN negocio.estudio e ON ue.estudio_id = e.id
       WHERE ue.usuario_id = $1 AND e.id = $2`,
      [req.user?.userId, parseInt(estudioId)]
    );

    if (permisoResult.rows.length === 0) {
      return sendError(res, 'No tienes permisos para ver los casos de este estudio', 403);
    }

    // Obtener los expedientes del estudio específico
    const expedientesQuery = `
      SELECT 
        e.id,
        e.numero as numero_expediente,
        e.cliente,
        TO_CHAR(e.fecha_inicio, 'DD-MM-YYYY') as fecha_inicio,
        e.descripcion,
        e.estado,
        e.estudio_id,
        est.nombre as estudio_nombre
      FROM negocio.expediente e
      INNER JOIN negocio.estudio est ON e.estudio_id = est.id
      WHERE e.estudio_id = $1
      ORDER BY e.fecha_inicio DESC
    `

    const expedientesResult = await pool.query(expedientesQuery, [parseInt(estudioId)])

    if (expedientesResult.rows.length === 0) {
      return sendSuccess(res, { casos: [] }, 'No se encontraron casos en este estudio')
    }

    // Obtener todas las audiencias con transcripciones para estos expedientes
    const expedienteIds = expedientesResult.rows.map(row => row.id)
    const audienciasQuery = `
      SELECT 
        a.id,
        a.titulo,
        TO_CHAR(a.fecha_hora, 'DD/MM/YYYY HH24:MI') as fecha_hora,
        a.lugar,
        a.descripcion,
        a.expediente_id,
        COALESCE(
          json_agg(
            CASE 
              WHEN t.id IS NOT NULL THEN
                json_build_object(
                  'id', t.id,
                  'hash', t.hash,
                  'nombre', t.nombre,
                  'tipo', t.tipo,
                  'estado', t.estado,
                  'duracion', t.duracion,
                  'url', t.url,
                  'archivo', t.archivo,
                  'fecha_creacion', t.fecha_creacion,
                  'audiencia_id', t.audiencia_id,
                  'expediente_id', t.expediente_id
                )
              ELSE NULL
            END
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as transcripciones
      FROM negocio.audiencia a
      LEFT JOIN negocio.transcripcion t ON a.id = t.audiencia_id
      WHERE a.expediente_id = ANY($1)
      GROUP BY a.id, a.titulo, a.fecha_hora, a.lugar, a.descripcion, a.expediente_id
      ORDER BY a.expediente_id, a.fecha_hora DESC
    `

    const audienciasResult = await pool.query(audienciasQuery, [expedienteIds])

    // Agrupar audiencias por expediente
    const audienciasPorExpediente = audienciasResult.rows.reduce((acc, audiencia) => {
      if (!acc[audiencia.expediente_id]) {
        acc[audiencia.expediente_id] = []
      }
      acc[audiencia.expediente_id].push(audiencia)
      return acc
    }, {} as Record<number, any[]>)

    // Construir la respuesta final con expedientes y sus audiencias
    const casos: Caso[] = expedientesResult.rows.map(expediente => ({
      id: expediente.id,
      numero_expediente: expediente.numero_expediente,
      cliente: expediente.cliente,
      fecha_inicio: expediente.fecha_inicio,
      descripcion: expediente.descripcion,
      estado: expediente.estado,
      estudio_id: expediente.estudio_id,
      estudio_nombre: expediente.estudio_nombre,
      audiencias: audienciasPorExpediente[expediente.id] || []
    }))

    sendSuccess(res, { casos }, `Casos del estudio obtenidos exitosamente`)

  } catch (error) {
    console.error('Error obteniendo casos por estudio:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Obtener audiencias de un caso específico
export const obtenerAudienciasPorCaso = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { casoId } = req.params;

  if (!casoId || Number.isNaN(parseInt(casoId))) {
    return sendError(res, 'ID del caso requerido y debe ser un número válido', 400);
  }

  try {
    // Verificar que el usuario tenga permisos para ver este caso
    const permisoResult = await pool.query(
      `SELECT e.id, e.numero, e.cliente, e.estudio_id
       FROM negocio.expediente e
       INNER JOIN negocio.estudio est ON e.estudio_id = est.id
       INNER JOIN negocio.usuario_estudio ue ON est.id = ue.estudio_id
       WHERE e.id = $1 AND ue.usuario_id = $2`,
      [parseInt(casoId), req.user?.userId]
    );

    if (permisoResult.rows.length === 0) {
      return sendError(res, 'No tienes permisos para ver las audiencias de este caso', 403);
    }

    // Obtener audiencias con transcripciones y número de expediente
    const audienciasQuery = `
      SELECT 
        a.id,
        a.titulo,
        TO_CHAR(a.fecha_hora, 'DD/MM/YYYY HH24:MI') as fecha_hora,
        a.lugar,
        a.descripcion,
        a.expediente_id,
        e.numero as numero_expediente,
        COALESCE(
          json_agg(
            CASE 
              WHEN t.id IS NOT NULL THEN
                json_build_object(
                  'id', t.id,
                  'hash', t.hash,
                  'nombre', t.nombre,
                  'tipo', t.tipo,
                  'estado', t.estado,
                  'duracion', t.duracion,
                  'url', t.url,
                  'archivo', t.archivo,
                  'fecha_creacion', t.fecha_creacion,
                  'audiencia_id', t.audiencia_id,
                  'expediente_id', t.expediente_id
                )
              ELSE NULL
            END
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as transcripciones
      FROM negocio.audiencia a
      INNER JOIN negocio.expediente e ON a.expediente_id = e.id
      LEFT JOIN negocio.transcripcion t ON a.id = t.audiencia_id
      WHERE a.expediente_id = $1
      GROUP BY a.id, a.titulo, a.fecha_hora, a.lugar, a.descripcion, a.expediente_id, e.numero
      ORDER BY a.fecha_hora DESC
    `;

    const audienciasResult = await pool.query(audienciasQuery, [parseInt(casoId)]);

    // Procesar las audiencias con transcripciones
    const audiencias = audienciasResult.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      fecha_hora: row.fecha_hora,
      lugar: row.lugar || null,
      descripcion: row.descripcion || null,
      expediente_id: row.expediente_id,
      numero_expediente: row.numero_expediente,
      transcripciones: (row.transcripciones || []).map((t: any) => ({
        id: t.id,
        hash: t.hash,
        nombre: t.nombre || null,
        tipo: t.tipo,
        estado: t.estado,
        duracion: t.duracion || null,
        url: t.url || null,
        archivo: t.archivo || null,
        fecha_creacion: t.fecha_creacion,
        audiencia_id: t.audiencia_id,
        expediente_id: t.expediente_id || null
      }))
    }));

    sendSuccess(res, { audiencias }, `Audiencias del caso obtenidas exitosamente`);

  } catch (error) {
    console.error('Error obteniendo audiencias por caso:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});
