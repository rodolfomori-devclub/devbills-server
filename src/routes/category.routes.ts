// src/routes/category.routes.ts
import { Router } from 'express';
import { getCategories } from '../controllers/category.controller';

const router = Router();

/**
 * Rota pública para listar categorias globais
 */
router.get('/', getCategories);

export default router;
