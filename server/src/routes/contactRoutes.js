import { Router } from 'express';
import { createContactMessage } from '../controllers/contactController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formLimiter, createContactMessage);

export default router;
