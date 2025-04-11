// src/routes/index.ts
import { Router } from 'express';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import userRoutes from './user.routes';

const router = Router();

/**
 * Rota para checagem de status da API
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevBills API está funcionando!' });
});

/**
 * Rotas principais da aplicação
 */
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);

export default router;
