"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const transaction_types_1 = require("../types/transaction.types");
const mongodb_1 = require("mongodb");
const validateTransaction = (transaction) => {
    if (!transaction.description)
        return 'Descrição obrigatória.';
    if (transaction.amount === undefined || transaction.amount === null)
        return 'Valor obrigatório.';
    if (isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0)
        return 'Valor inválido.';
    if (!transaction.date)
        return 'Data obrigatória.';
    if (!transaction.categoryId || !mongodb_1.ObjectId.isValid(transaction.categoryId))
        return 'Categoria inválida.';
    if (!transaction.type || !Object.values(transaction_types_1.TransactionType).includes(transaction.type))
        return 'Tipo inválido.';
    return null;
};
exports.validateTransaction = validateTransaction;
