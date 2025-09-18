import { Router } from 'express';
import { sendSuccess } from '../middleware/responseHandler.js';

const router = Router();

// Ejemplo de ruta básica
router.get('/test', (req, res) => {
  sendSuccess(res, { message: 'API funcionando correctamente' }, 'Test endpoint successful');
});

export default router;