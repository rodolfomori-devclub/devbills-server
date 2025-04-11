// src/routes/user.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserInfo } from '../controllers/user.controller';

const router = Router();

/**
 * Rotas protegidas do usuário
 */
router.use(authMiddleware);

router.get('/info', getUserInfo);

export default router;
