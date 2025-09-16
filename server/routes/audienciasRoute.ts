import { Router } from 'express';
import { crearAudiencia, eliminarAudiencia } from '../controllers/audienciaController.js';
import { authenticateToken } from '../middleware/auth.js';


const router = Router();

router.post('/api/casos/:expedienteId/audiencias', authenticateToken, crearAudiencia);

router.delete('/api/audiencias/:audienciaId', authenticateToken, eliminarAudiencia);


export default router;