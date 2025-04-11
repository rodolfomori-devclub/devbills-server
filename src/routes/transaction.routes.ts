import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de transações requerem autenticação
router.use(authMiddleware);

// Rotas de transações
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;