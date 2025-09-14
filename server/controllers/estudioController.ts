import type { Response } from 'express';
import {
  type EstudioRequest,
  type Estudio,
  type EquipoRequest,
  type Equipo,
  type UsuarioEquipo,
  isValidDireccion,
  isValidTelefono,
  isValidNombreEquipo,
  isValidDescripcionEquipo
} from '../models/estudioModels.js';
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

// Crear nuevo estudio
export const crearEstudio = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { nombre, direccion, telefono }: EstudioRequest = req.body;

  // Validaciones
  if (!nombre?.trim() || nombre.trim().length > 200) {
    return sendError(res, 'El nombre del estudio es requerido y debe tener máximo 200 caracteres', 400);
  }

  if (!isValidDireccion(direccion)) {
    return sendError(res, 'La dirección debe tener máximo 500 caracteres', 400);
  }

  if (!isValidTelefono(telefono)) {
    return sendError(res, 'El teléfono debe tener entre 7 y 20 caracteres y contener solo números, espacios, guiones, paréntesis o signo más', 400);
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insertar el nuevo estudio
      const estudioResult = await client.query(
        `INSERT INTO negocio.estudio (nombre, direccion, telefono, propietario_id, fecha_creacion) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
         RETURNING id, nombre, direccion, telefono, propietario_id, fecha_creacion`,
        [nombre.trim(), direccion?.trim() || null, telefono?.trim() || null, req.user?.userId]
      );

      const nuevoEstudio = estudioResult.rows[0];

      // Crear la relación usuario-estudio con rol propietario
      await client.query(
        `INSERT INTO negocio.usuario_estudio (usuario_id, estudio_id, rol, fecha_asignacion) 
         VALUES ($1, $2, 'propietario', CURRENT_TIMESTAMP)`,
        [req.user?.userId, nuevoEstudio.id]
      );

      await client.query('COMMIT');

      // Buscar datos del propietario
      const propietarioResult = await client.query(
        `SELECT nombres, apellidos, email FROM negocio.usuario WHERE id = $1`,
        [nuevoEstudio.propietario_id]
      );

      const propietario = propietarioResult.rows[0];

      const estudioResponse: Estudio = {
        id: nuevoEstudio.id,
        nombre: nuevoEstudio.nombre,
        direccion: nuevoEstudio.direccion,
        telefono: nuevoEstudio.telefono,
        propietario_id: nuevoEstudio.propietario_id,
        propietario: {
          nombres: propietario.nombres,
          apellidos: propietario.apellidos,
          email: propietario.email
        },
        rol: 'propietario',
        fecha_creacion: nuevoEstudio.fecha_creacion.toISOString(),
        equipos: []
      };

      sendSuccess(res, {
        estudio: estudioResponse
      }, 'Estudio creado exitosamente', 201);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creando estudio:', error);

    // Manejar errores específicos de PostgreSQL
    if ((error as any).code === '23505') {
      return sendError(res, 'Ya existe un estudio con este nombre', 409);
    }

    sendError(res, 'Error interno del servidor', 500);
  }
});

// Obtener estudios del usuario autenticado con equipos y miembros
export const obtenerEstudios = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const client = await pool.connect();

    try {
      // Obtener estudios donde el usuario es propietario o miembro
      const estudiosResult = await client.query(
        `SELECT DISTINCT
           e.id, 
           e.nombre, 
           e.direccion, 
           e.telefono, 
           e.propietario_id, 
           e.fecha_creacion,
           ue.rol,
           up.nombres as propietario_nombres,
           up.apellidos as propietario_apellidos,
           up.email as propietario_email
         FROM negocio.estudio e
         INNER JOIN negocio.usuario_estudio ue ON e.id = ue.estudio_id
         INNER JOIN negocio.usuario up ON e.propietario_id = up.id
         WHERE ue.usuario_id = $1
         ORDER BY e.fecha_creacion DESC`,
        [req.user?.userId]
      );

      const estudios: Estudio[] = [];

      // Para cada estudio, obtener sus equipos y miembros
      for (const estudioRow of estudiosResult.rows) {
        // Obtener equipos del estudio
        const equiposResult = await client.query(
          `SELECT eq.id, eq.nombre, eq.descripcion, eq.fecha_creacion
           FROM negocio.equipo eq
           WHERE eq.estudio_id = $1
           ORDER BY eq.fecha_creacion DESC`,
          [estudioRow.id]
        );

        const equipos: Equipo[] = [];

        // Para cada equipo, obtener sus miembros
        for (const equipoRow of equiposResult.rows) {
          const miembrosResult = await client.query(
            `SELECT u.id, u.nombres as nombre, u.apellidos as apellido, u.email as correo,
                    CASE WHEN e.propietario_id = u.id THEN 'admin' ELSE 'miembro' END as rol
             FROM negocio.equipo_miembro em
             INNER JOIN negocio.usuario u ON em.usuario_id = u.id
             INNER JOIN negocio.estudio e ON e.id = $2
             WHERE em.equipo_id = $1 AND em.estado = 'aceptado'
             ORDER BY u.nombres, u.apellidos`,
            [equipoRow.id, estudioRow.id]
          );

          const usuarios: UsuarioEquipo[] = miembrosResult.rows.map((row: any) => ({
            id: row.id,
            nombre: row.nombre,
            apellido: row.apellido,
            correo: row.correo,
            rol: row.rol as 'propietario' | 'miembro'
          }));

          equipos.push({
            id: equipoRow.id,
            nombre: equipoRow.nombre,
            descripcion: equipoRow.descripcion,
            usuarios,
            fechaCreacion: equipoRow.fecha_creacion.toISOString()
          });
        }

        estudios.push({
          id: estudioRow.id,
          nombre: estudioRow.nombre,
          direccion: estudioRow.direccion,
          telefono: estudioRow.telefono,
          propietario_id: estudioRow.propietario_id,
          fecha_creacion: estudioRow.fecha_creacion.toISOString(),
          rol: estudioRow.rol,
          propietario: {
            nombres: estudioRow.propietario_nombres,
            apellidos: estudioRow.propietario_apellidos,
            email: estudioRow.propietario_email
          },
          equipos
        });
      }

      sendSuccess(res, {
        estudios,
        total: estudios.length
      }, 'Estudios obtenidos exitosamente');

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error obteniendo estudios:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Crear nuevo equipo en un estudio
export const crearEquipo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { estudioId } = req.params;
  const { nombre, descripcion }: EquipoRequest = req.body;

  // Validaciones
  if (!isValidNombreEquipo(nombre)) {
    return sendError(res, 'El nombre del equipo es requerido y debe tener máximo 200 caracteres', 400);
  }

  if (!isValidDescripcionEquipo(descripcion)) {
    return sendError(res, 'La descripción debe tener máximo 500 caracteres', 400);
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario tenga permisos en el estudio (propietario o miembro)
      const permisoResult = await client.query(
        `SELECT ue.rol FROM negocio.usuario_estudio ue
         WHERE ue.usuario_id = $1 AND ue.estudio_id = $2`,
        [req.user?.userId, estudioId]
      );

      if (permisoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para crear equipos en este estudio', 403);
      }

      // Solo los propietarios pueden crear equipos
      if (permisoResult.rows[0].rol !== 'propietario') {
        await client.query('ROLLBACK');
        return sendError(res, 'Solo el propietario del estudio puede crear equipos', 403);
      }

      // Insertar el nuevo equipo
      const equipoResult = await client.query(
        `INSERT INTO negocio.equipo (nombre, descripcion, estudio_id, fecha_creacion) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
         RETURNING id, nombre, descripcion, fecha_creacion`,
        [nombre.trim(), descripcion?.trim() || null, estudioId]
      );

      await client.query('COMMIT');

      const nuevoEquipo = equipoResult.rows[0];

      const equipoResponse: Equipo = {
        id: nuevoEquipo.id,
        nombre: nuevoEquipo.nombre,
        descripcion: nuevoEquipo.descripcion || '',
        usuarios: [],
        fechaCreacion: nuevoEquipo.fecha_creacion.toISOString()
      };

      sendSuccess(res, {
        equipo: equipoResponse
      }, 'Equipo creado exitosamente', 201);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creando equipo:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Eliminar estudio (solo propietario)
export const eliminarEstudio = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { estudioId } = req.params;
    const usuarioId = req.user?.userId;

    if (!estudioId || !usuarioId) {
      return sendError(res, 'Parámetros inválidos', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario es propietario del estudio
      const propietarioCheck = await client.query(
        `SELECT id FROM negocio.estudio 
         WHERE id = $1 AND propietario_id = $2`,
        [estudioId, usuarioId]
      );

      if (propietarioCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para eliminar este estudio o no existe', 404);
      }

      // Eliminar en orden (por claves foráneas):
      // 1. Miembros de equipos
      await client.query(
        `DELETE FROM negocio.equipo_miembro 
         WHERE equipo_id IN (
           SELECT id FROM negocio.equipo WHERE estudio_id = $1
         )`,
        [estudioId]
      );

      // 2. Equipos
      await client.query(
        `DELETE FROM negocio.equipo WHERE estudio_id = $1`,
        [estudioId]
      );

      // 3. Relaciones usuario-estudio
      await client.query(
        `DELETE FROM negocio.usuario_estudio WHERE estudio_id = $1`,
        [estudioId]
      );

      // 4. El estudio
      const deleteResult = await client.query(
        `DELETE FROM negocio.estudio WHERE id = $1`,
        [estudioId]
      );

      if (deleteResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Estudio no encontrado', 404);
      }

      await client.query('COMMIT');

      sendSuccess(res, {}, 'Estudio eliminado exitosamente');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando estudio:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Eliminar equipo (solo propietario del estudio)
export const eliminarEquipo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { estudioId, equipoId } = req.params;
    const usuarioId = req.user?.userId;

    if (!estudioId || !equipoId || !usuarioId) {
      return sendError(res, 'Parámetros inválidos', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario es propietario del estudio
      const propietarioCheck = await client.query(
        `SELECT e.id 
         FROM negocio.estudio e
         INNER JOIN negocio.equipo eq ON e.id = eq.estudio_id
         WHERE e.id = $1 AND eq.id = $2 AND e.propietario_id = $3`,
        [estudioId, equipoId, usuarioId]
      );

      if (propietarioCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para eliminar este equipo o no existe', 404);
      }

      // Eliminar miembros del equipo primero
      await client.query(
        `DELETE FROM negocio.equipo_miembro WHERE equipo_id = $1`,
        [equipoId]
      );

      // Eliminar el equipo
      const deleteResult = await client.query(
        `DELETE FROM negocio.equipo WHERE id = $1 AND estudio_id = $2`,
        [equipoId, estudioId]
      );

      if (deleteResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Equipo no encontrado', 404);
      }

      await client.query('COMMIT');

      sendSuccess(res, {}, 'Equipo eliminado exitosamente');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando equipo:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});

// Invitar miembro a equipo (solo propietario del estudio)
export const invitarMiembro = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { equipoId } = req.params;
    const { correo } = req.body;
    const usuarioId = req.user?.userId;

    if (!equipoId || !correo || !usuarioId) {
      return sendError(res, 'Parámetros inválidos', 400);
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return sendError(res, 'Formato de email inválido', 400);
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario es propietario del estudio al que pertenece el equipo
      const propietarioCheck = await client.query(
        `SELECT e.id as estudio_id, eq.id as equipo_id
         FROM negocio.estudio e
         INNER JOIN negocio.equipo eq ON e.id = eq.estudio_id
         WHERE eq.id = $1 AND e.propietario_id = $2`,
        [equipoId, usuarioId]
      );

      if (propietarioCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'No tienes permisos para invitar miembros a este equipo', 403);
      }

      const estudioId = propietarioCheck.rows[0].estudio_id;

      // Buscar el usuario por correo
      const usuarioInvitado = await client.query(
        `SELECT id FROM negocio.usuario WHERE email = $1`,
        [correo.toLowerCase().trim()]
      );

      if (usuarioInvitado.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Usuario no encontrado con ese correo', 404);
      }

      const usuarioInvitadoId = usuarioInvitado.rows[0].id;

      // Verificar si ya es miembro del equipo
      const miembroExistente = await client.query(
        `SELECT id FROM negocio.equipo_miembro 
         WHERE equipo_id = $1 AND usuario_id = $2`,
        [equipoId, usuarioInvitadoId]
      );

      if (miembroExistente.rows.length > 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'El usuario ya es miembro de este equipo', 409);
      }

      // Crear la invitación/membresía
      await client.query(
        `INSERT INTO negocio.equipo_miembro (equipo_id, usuario_id, estado, fecha_invitacion)
         VALUES ($1, $2, 'aceptado', CURRENT_TIMESTAMP)`,
        [equipoId, usuarioInvitadoId]
      );

      // Verificar si el usuario ya tiene relación con el estudio
      const relacionEstudio = await client.query(
        `SELECT id FROM negocio.usuario_estudio 
         WHERE usuario_id = $1 AND estudio_id = $2`,
        [usuarioInvitadoId, estudioId]
      );

      // Si no tiene relación con el estudio, crearla
      if (relacionEstudio.rows.length === 0) {
        await client.query(
          `INSERT INTO negocio.usuario_estudio (usuario_id, estudio_id, rol, fecha_asignacion)
           VALUES ($1, $2, 'miembro', CURRENT_TIMESTAMP)`,
          [usuarioInvitadoId, estudioId]
        );
      }

      await client.query('COMMIT');

      sendSuccess(res, {}, `Invitación enviada exitosamente a ${correo}`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error invitando miembro:', error);

    // Manejar errores específicos de PostgreSQL
    if ((error as any).code === '23505') {
      return sendError(res, 'El usuario ya es miembro del equipo', 409);
    }

    sendError(res, 'Error interno del servidor', 500);
  }
});

// Eliminar miembro de equipo
export const eliminarMiembro = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { equipoId, usuarioId } = req.params;

  if (!equipoId || !usuarioId) {
    return sendError(res, 'ID del equipo y del usuario son requeridos', 400);
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verificar que el usuario actual es el propietario del estudio
      const estudioResult = await client.query(
        `SELECT e.propietario_id, e.nombre as estudio_nombre
         FROM negocio.estudio e
         INNER JOIN negocio.equipo eq ON e.id = eq.estudio_id
         WHERE eq.id = $1`,
        [equipoId]
      );

      if (estudioResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'Equipo no encontrado', 404);
      }

      const estudio = estudioResult.rows[0];
      
      if (estudio.propietario_id !== req.user?.userId) {
        await client.query('ROLLBACK');
        return sendError(res, 'Solo el propietario del estudio puede eliminar miembros', 403);
      }

      // Verificar que el usuario a eliminar no es el propietario
      if (parseInt(usuarioId) === req.user?.userId) {
        await client.query('ROLLBACK');
        return sendError(res, 'No puedes eliminarte a ti mismo del equipo', 400);
      }

      // Verificar que el usuario es miembro del equipo
      const miembroResult = await client.query(
        `SELECT u.nombres, u.apellidos, u.email
         FROM negocio.equipo_miembro em
         INNER JOIN negocio.usuario u ON em.usuario_id = u.id
         WHERE em.equipo_id = $1 AND em.usuario_id = $2`,
        [equipoId, usuarioId]
      );

      if (miembroResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return sendError(res, 'El usuario no es miembro de este equipo', 404);
      }

      const miembro = miembroResult.rows[0];

      // Eliminar de equipo_miembro
      await client.query(
        'DELETE FROM negocio.equipo_miembro WHERE equipo_id = $1 AND usuario_id = $2',
        [equipoId, usuarioId]
      );

      // Eliminar de usuario_estudio (acceso al estudio)
      await client.query(
        'DELETE FROM negocio.usuario_estudio WHERE estudio_id = (SELECT estudio_id FROM negocio.equipo WHERE id = $1) AND usuario_id = $2',
        [equipoId, usuarioId]
      );

      await client.query('COMMIT');

      sendSuccess(res, {}, `${miembro.nombres} ${miembro.apellidos} ha sido eliminado del equipo`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error eliminando miembro:', error);
    sendError(res, 'Error interno del servidor', 500);
  }
});