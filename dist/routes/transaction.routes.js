"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de transações requerem autenticação
router.use(auth_middleware_1.authMiddleware);
// Rotas de transações - removido o método PUT (atualização)
router.post('/', transaction_controller_1.createTransaction);
router.get('/', transaction_controller_1.getTransactions);
router.get('/summary', transaction_controller_1.getTransactionSummary);
router.delete('/:id', transaction_controller_1.deleteTransaction);
exports.default = router;
