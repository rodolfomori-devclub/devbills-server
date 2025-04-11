import { Router } from 'express';
import { getCategories } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de categorias requerem autenticação
router.use(authMiddleware);

// Somente a rota para listar categorias é mantida
router.get('/', getCategories);

export default router;