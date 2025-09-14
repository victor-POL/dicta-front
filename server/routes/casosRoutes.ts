import { Router } from 'express';
import {
  crearCaso,
  obtenerCasos,
} from '../controllers/casoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/api/estudios/:estudioId/casos', authenticateToken, crearCaso);

router.get('/api/casos', authenticateToken, obtenerCasos);


export default router;