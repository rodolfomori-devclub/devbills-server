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
        reply.status(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    const { month, year } = request.query;
    // Validação de entrada básica
    if (!month || !year) {
        reply.status(400).send({ error: 'Mês e ano são obrigatórios' });
        return;
    }
    // Criar range de datas com dayjs
    const startDate = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = (0, dayjs_1.default)(startDate).endOf('month').toDate();
    try {
        // Buscar transações do período
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                category: true
            }
        });
        // Iniciar totais
        let totalExpenses = 0;
        let totalIncomes = 0;
        const groupedExpenses = new Map();
        // Agrupar por categoria
        for (const transaction of transactions) {
            if (transaction.type === client_1.TransactionType.expense) {
                totalExpenses += transaction.amount;
                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.category.id,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0
                };
                existing.amount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);
            }
            else {
                totalIncomes += transaction.amount;
            }
        }
        // Montar resposta com porcentagens e ordenação
        const summary = {
            totalExpenses,
            totalIncomes,
            balance: totalIncomes - totalExpenses,
            expensesByCategory: Array.from(groupedExpenses.values())
                .map((entry) => ({
                ...entry,
                percentage: parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2))
            }))
                .sort((a, b) => b.amount - a.amount)
        };
        reply.send(summary);
    }
    catch (error) {
        request.log.error('Erro ao gerar resumo:', error);
        reply.status(500).send({ error: 'Erro ao gerar resumo' });
    }
};
exports.getTransactionSummary = getTransactionSummary;
