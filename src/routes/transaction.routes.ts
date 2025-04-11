// src/routes/transaction.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

import { createTransaction } from '../controllers/transactions/createTransaction';
import { getTransactions } from '../controllers/transactions/getTransactions';
import { getTransactionSummary } from '../controllers/transactions/getTransactionSummary';
import { deleteTransaction } from '../controllers/transactions/deleteTransaction';

const router = Router();

/**
 * Todas as rotas abaixo requerem autenticação
 */
router.use(authMiddleware);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.delete('/:id', deleteTransaction);

export default router;
