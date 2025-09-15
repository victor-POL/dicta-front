import { Router } from 'express';
import { crearAudiencia } from '../controllers/audienciaController.js';
import { authenticateToken } from '../middleware/auth.js';


const router = Router();

router.post('/api/casos/:expedienteId/audiencias', authenticateToken, crearAudiencia);


export default router;