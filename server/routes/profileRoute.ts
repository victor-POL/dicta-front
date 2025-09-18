import { Router } from 'express';
import { actualizarPerfil } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.put('/api/user/profile', authenticateToken, actualizarPerfil);


export default router;
