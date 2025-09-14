import { Router } from 'express';
import {
  crearEstudio,
  obtenerEstudios,
  crearEquipo,
  eliminarEstudio,
  eliminarEquipo,
  invitarMiembro,
  eliminarMiembro
} from '../controllers/estudioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/api/estudios', authenticateToken, crearEstudio);

router.get('/api/estudios', authenticateToken, obtenerEstudios);

router.delete('/api/estudios/:estudioId', authenticateToken, eliminarEstudio);

router.post('/api/estudios/:estudioId/equipos', authenticateToken, crearEquipo);

router.delete('/api/estudios/:estudioId/equipos/:equipoId', authenticateToken, eliminarEquipo);

router.post('/api/estudios/equipos/:equipoId/invitaciones', authenticateToken, invitarMiembro);

router.delete('/api/estudios/equipos/:equipoId/miembros/:usuarioId', authenticateToken, eliminarMiembro);

export default router;