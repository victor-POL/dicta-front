import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { actualizarEstadoTranscripcion, crearTranscripcionAudio, crearTranscripcionYoutube, eliminarTranscripcion, obtenerTranscripciones, vincularTranscripcion } from '../controllers/transcripcionController';

const router = Router();

router.get('/api/transcripciones', authenticateToken, obtenerTranscripciones);

router.delete('/api/transcripciones/:transcripcionId', authenticateToken, eliminarTranscripcion);

router.patch('/api/transcripciones/:transcripcionId', authenticateToken, vincularTranscripcion);

router.post('/api/transcripciones/youtube', authenticateToken, crearTranscripcionYoutube);

router.post('/api/transcripciones/audio', authenticateToken, crearTranscripcionAudio);

router.patch('/api/transcripciones/estado/:hash', authenticateToken, actualizarEstadoTranscripcion);

export default router;