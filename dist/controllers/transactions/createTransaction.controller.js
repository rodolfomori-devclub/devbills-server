"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const transaction_schema_1 = require("../../schemas/transaction.schema");
const createTransaction = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    // 🛡️ Validação com Zod (usando safeParse para tratar erros)
    const result = transaction_schema_1.createTransactionSchema.safeParse(request.body);
    if (!result.success) {
        const message = result.error.errors[0]?.message || "Erro de validação";
        reply.status(400).send({ error: message });
        return;
    }
    // ✅ Dados validados e tipados
    const transaction = result.data;
    try {
        const parsedDate = new Date(transaction.date);
        const category = await prisma_1.default.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });
        if (!category) {
            reply.status(404).send({ error: "Categoria inválida" });
            return;
        }
        const newTransaction = await prisma_1.default.transaction.create({
            data: {
                ...transaction,
                userId,
                date: parsedDate,
            },
            include: {
                category: true,
            },
        });
        reply.status(201).send(newTransaction);
    }
    catch (error) {
        request.log.error("Erro ao criar transação:", error);
        reply.status(500).send({ error: "Erro interno do servidor" });
    }
};
exports.createTransaction = createTransaction;
