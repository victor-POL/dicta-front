import { Router } from 'express';
import { register, login, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/api/auth/register', register);

router.post('/api/auth/login', login);

router.get('/api/auth/verify', authenticateToken, verifyToken);

export default router;
