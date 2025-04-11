"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/transaction.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const createTransaction_1 = require("../controllers/transactions/createTransaction");
const getTransactions_1 = require("../controllers/transactions/getTransactions");
const getTransactionSummary_1 = require("../controllers/transactions/getTransactionSummary");
const deleteTransaction_1 = require("../controllers/transactions/deleteTransaction");
const router = (0, express_1.Router)();
/**
 * Todas as rotas abaixo requerem autenticação
 */
router.use(auth_middleware_1.authMiddleware);
router.post('/', createTransaction_1.createTransaction);
router.get('/', getTransactions_1.getTransactions);
router.get('/summary', getTransactionSummary_1.getTransactionSummary);
router.delete('/:id', deleteTransaction_1.deleteTransaction);
exports.default = router;
