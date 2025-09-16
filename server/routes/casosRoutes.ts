import { Router } from 'express';
import {
  crearCaso,
  obtenerCasos,
  eliminarCaso,
} from '../controllers/casoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/api/estudios/:estudioId/casos', authenticateToken, crearCaso);

router.get('/api/casos', authenticateToken, obtenerCasos);

router.delete('/api/casos/:casoId', authenticateToken, eliminarCaso);


export default router;