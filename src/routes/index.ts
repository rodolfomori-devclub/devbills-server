import { Router } from 'express';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import userRoutes from './user.routes';

const router = Router();

// Rotas da API
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);

// Rota para verificar se a API está funcionando
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevBills API está funcionando!' });
});

export default router;