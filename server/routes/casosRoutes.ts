import { Router } from 'express';
import {
  crearCaso,
  obtenerCasos,
  obtenerCasosPorEstudio,
  obtenerAudienciasPorCaso,
  eliminarCaso,
} from '../controllers/casoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/api/estudios/:estudioId/casos', authenticateToken, crearCaso);

router.get('/api/casos', authenticateToken, obtenerCasos);

router.get('/api/estudios/:estudioId/casos', authenticateToken, obtenerCasosPorEstudio);

router.get('/api/casos/:casoId/audiencias', authenticateToken, obtenerAudienciasPorCaso);

router.delete('/api/casos/:casoId', authenticateToken, eliminarCaso);


export default router;