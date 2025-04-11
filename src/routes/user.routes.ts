import { Router } from 'express';
import { initializeUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de usuário requerem autenticação
router.use(authMiddleware);

// Rota para inicializar um novo usuário
router.post('/initialize', initializeUser);

export default router;