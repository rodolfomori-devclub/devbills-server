"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const mongodb_1 = require("mongodb");
const validation_1 = require("../../utils/validation");
const createTransaction = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.code(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    // Com o schema na rota, o body já está tipado corretamente
    const transaction = request.body;
    // Validação com função utilitária
    const validationError = (0, validation_1.validateTransaction)(transaction);
    if (validationError) {
        reply.code(400).send({ error: validationError });
        return;
    }
    // Validação extra: verificar se o ID é um ObjectId válido
    if (!mongodb_1.ObjectId.isValid(transaction.categoryId)) {
        reply.code(400).send({ error: 'ID de categoria inválido' });
        return;
    }
    const category = await prisma_1.default.category.findFirst({
        where: {
            id: transaction.categoryId,
            type: transaction.type
        }
    });
    if (!category) {
        reply.code(404).send({ error: 'Categoria inválida' });
        return;
    }
    const parsedDate = new Date(transaction.date);
    if (isNaN(parsedDate.getTime())) {
        reply.code(400).send({ error: 'Data inválida' });
        return;
    }
    try {
        const newTransaction = await prisma_1.default.transaction.create({
            data: {
                description: transaction.description,
                amount: Number(transaction.amount),
                date: parsedDate,
                type: transaction.type,
                userId,
                categoryId: transaction.categoryId
            },
            include: {
                category: true
            }
        });
        reply.code(201).send(newTransaction);
    }
    catch (error) {
        if (error.code === 'P2003') {
            reply.code(400).send({ error: 'Categoria não encontrada' });
            return;
        }
        request.log.error('Erro inesperado:', error);
        reply.code(500).send({ error: 'Erro ao criar transação' });
    }
};
exports.createTransaction = createTransaction;
