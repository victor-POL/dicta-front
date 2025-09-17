import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { eliminarTranscripcion, obtenerTranscripciones, vincularTranscripcion } from '../controllers/transcripcionController';

const router = Router();

router.get('/api/transcripciones', authenticateToken, obtenerTranscripciones);

router.delete('/api/transcripciones/:transcripcionId', authenticateToken, eliminarTranscripcion);

router.patch('/api/transcripciones/:transcripcionId', authenticateToken, vincularTranscripcion);


export default router;