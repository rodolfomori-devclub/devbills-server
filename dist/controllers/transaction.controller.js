"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const mongodb_1 = require("mongodb");
const transaction_types_1 = require("../types/transaction.types");
const createTransaction = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const { description, amount, date, categoryId, type } = req.body;
    if (!description || !amount || !date || !categoryId || !type) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (!Object.values(transaction_types_1.TransactionType).includes(type)) {
        return res.status(400).json({ error: 'Tipo de transação inválido' });
    }
    if (!mongodb_1.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: 'ID de categoria inválido' });
    }
    const category = await prisma_1.default.category.findFirst({
        where: { id: categoryId, type }
    });
    if (!category) {
        return res.status(404).json({ error: 'Categoria inválida' });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Data inválida' });
    }
    try {
        const transaction = await prisma_1.default.transaction.create({
            data: {
                description,
                amount: Number(amount),
                date: parsedDate,
                type,
                userId,
                categoryId
            },
            include: {
                category: true
            }
        });
        return res.status(201).json(transaction);
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
