"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const mongodb_1 = require("mongodb");
const validation_1 = require("../../utils/validation");
const createTransaction = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const transaction = req.body;
    // Validação com função utilitária
    const validationError = (0, validation_1.validateTransaction)(transaction);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }
    // Validação extra: verificar se o ID é um ObjectId válido (a função de validação já faz isso, mas aqui reforçamos caso queira deixar separado)
    if (!mongodb_1.ObjectId.isValid(transaction.categoryId)) {
        return res.status(400).json({ error: 'ID de categoria inválido' });
    }
    const category = await prisma_1.default.category.findFirst({
        where: {
            id: transaction.categoryId,
            type: transaction.type
        }
    });
    if (!category) {
        return res.status(404).json({ error: 'Categoria inválida' });
    }
    const parsedDate = new Date(transaction.date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Data inválida' });
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
        return res.status(201).json(newTransaction);
    }
    catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Categoria não encontrada' });
        }
        console.error('Erro inesperado:', error);
        return res.status(500).json({ error: 'Erro ao criar transação' });
    }
};
exports.createTransaction = createTransaction;
