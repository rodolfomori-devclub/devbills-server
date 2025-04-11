"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
/**
 * Valida os dados de uma transação
 * @param transaction Dados da transação
 * @returns string com mensagem de erro ou null se estiver tudo certo
 */
const validateTransaction = (transaction) => {
    if (!transaction.description)
        return 'Descrição obrigatória.';
    if (transaction.amount === undefined || transaction.amount === null) {
        return 'Valor obrigatório.';
    }
    if (isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) {
        return 'Valor inválido.';
    }
    if (!transaction.date)
        return 'Data obrigatória.';
    if (!transaction.categoryId || !mongodb_1.ObjectId.isValid(transaction.categoryId)) {
        return 'Categoria inválida.';
    }
    if (!transaction.type || !Object.values(client_1.TransactionType).includes(transaction.type)) {
        return 'Tipo inválido.';
    }
    return null;
};
exports.validateTransaction = validateTransaction;
