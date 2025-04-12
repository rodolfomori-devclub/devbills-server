"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const getTransactionSummary = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.code(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    // O schema na rota garante que as query params estão tipadas corretamente
    const query = request.query;
    const { month, year } = query;
    if (!month || !year) {
        reply.code(400).send({ error: 'Mês e ano são obrigatórios' });
        return;
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
        reply.send(summary);
    }
    catch (error) {
        request.log.error('Erro ao gerar resumo:', error);
        reply.code(500).send({ error: 'Erro ao gerar resumo' });
    }
};
exports.getTransactionSummary = getTransactionSummary;
