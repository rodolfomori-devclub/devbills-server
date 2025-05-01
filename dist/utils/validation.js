"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = exports.createTransactionSchema = void 0;
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
// src/utils/validation.ts
const zod_1 = require("zod");
// Função para verificar se uma string é um ObjectId válido
const isValidObjectId = (id) => mongodb_1.ObjectId.isValid(id);
// Esquema de validação para criar uma transação
exports.createTransactionSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "Descrição obrigatória."),
    amount: zod_1.z.number().positive("Valor deve ser positivo."),
    date: zod_1.z.string().refine((date) => !Number.isNaN(new Date(date).getTime()), {
        message: "Data inválida.",
    }),
    categoryId: zod_1.z.string().refine(isValidObjectId, {
        message: "Categoria inválida.",
    }),
    type: zod_1.z.enum([client_1.TransactionType.expense, client_1.TransactionType.income], {
        errorMap: () => ({ message: "Tipo inválido." }),
    }),
});
// Função de validação compatível com a versão anterior
const validateTransaction = (data) => {
    const result = exports.createTransactionSchema.safeParse(data);
    if (!result.success) {
        // Retorna a primeira mensagem de erro encontrada
        const firstError = result.error.errors[0];
        return firstError?.message || "Dados inválidos";
    }
    return null;
};
exports.validateTransaction = validateTransaction;
