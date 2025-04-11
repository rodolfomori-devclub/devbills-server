import { Router } from 'express';
import { 
  createTransaction, 
  getTransactions, 
  getTransactionSummary, 
  deleteTransaction 
} from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de transações requerem autenticação
router.use(authMiddleware);

// Rotas de transações - removido o método PUT (atualização)
router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.delete('/:id', deleteTransaction);

export default router;