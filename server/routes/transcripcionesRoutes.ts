import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { eliminarTranscripcion } from '../controllers/transcripcionController';

const router = Router();

router.delete('/api/transcripciones/:transcripcionId', authenticateToken, eliminarTranscripcion);

export default router;