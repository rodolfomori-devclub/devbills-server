"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const getTransactionSummary = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
    }
    const start = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
    const end = (0, dayjs_1.default)(`${year}-${month}-01`).endOf('month').toDate();
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                date: { gte: start, lte: end }
            },
            include: { category: true }
        });
        let totalExpenses = 0;
        let totalIncomes = 0;
        const grouped = new Map();
        for (const t of transactions) {
            if (t.type === client_1.TransactionType.expense) {
                totalExpenses += t.amount;
                const existing = grouped.get(t.categoryId) ?? {
                    categoryId: t.category.id,
                    categoryName: t.category.name,
                    categoryColor: t.category.color,
                    amount: 0,
                    percentage: 0
                };
                existing.amount += t.amount;
                grouped.set(t.categoryId, existing);
            }
            else {
                totalIncomes += t.amount;
            }
        }
        const summary = {
            totalExpenses,
            totalIncomes,
            balance: totalIncomes - totalExpenses,
            expensesByCategory: Array.from(grouped.values()).map(e => ({
                ...e,
                percentage: parseFloat(((e.amount / totalExpenses) * 100).toFixed(2))
            })).sort((a, b) => b.amount - a.amount)
        };
        return res.json(summary);
    }
    catch (error) {
        console.error('Erro ao gerar resumo:', error);
        return res.status(500).json({ error: 'Erro ao gerar resumo' });
    }
};
exports.getTransactionSummary = getTransactionSummary;
