import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { eliminarTranscripcion, obtenerTranscripciones } from '../controllers/transcripcionController';

const router = Router();

router.get('/api/transcripciones', authenticateToken, obtenerTranscripciones);

router.delete('/api/transcripciones/:transcripcionId', authenticateToken, eliminarTranscripcion);

export default router;