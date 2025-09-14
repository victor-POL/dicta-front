import { Router } from 'express';
import { checkAPIHealth, checkDBHealth } from '../controllers/testController';

const router = Router();

router.get('/api/test/api_health', checkAPIHealth);

router.get('/api/test/db_health', checkDBHealth);


export default router;