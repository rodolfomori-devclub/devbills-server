"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
const dayjs_1 = __importDefault(require("dayjs"));
const getTransactions = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    const { month, year, type, categoryId } = request.query;
    // Filtros dinâmicos para a busca no banco
    const filters = { userId };
    // Filtro por data (mês e ano)
    if (month && year) {
        const startDate = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, dayjs_1.default)(startDate).endOf('month').toDate();
        filters.date = { gte: startDate, lte: endDate };
    }
    // Filtro por tipo (income ou expense)
    if (type && Object.values(client_1.TransactionType).includes(type)) {
        filters.type = type;
    }
    // Filtro por categoria (valida se ID é válido)
    if (categoryId && mongodb_1.ObjectId.isValid(categoryId)) {
        filters.categoryId = categoryId;
    }
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: {
                        name: true,
                        color: true,
                        type: true
                    }
                }
            }
        });
        reply.send(transactions);
    }
    catch (error) {
        request.log.error('Erro ao buscar transações:', error);
        reply.status(500).send({ error: 'Erro ao buscar transações' });
    }
};
exports.getTransactions = getTransactions;
