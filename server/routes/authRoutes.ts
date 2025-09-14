import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';

const router = Router();

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', getProfile);

export default router;