import { Router } from 'express';
import {
  crearCaso
} from '../controllers/casoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Crear nuevo caso en un estudio específico
router.post('/api/estudios/:estudioId/casos', authenticateToken, crearCaso);

export default router;