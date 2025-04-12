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
        reply.code(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    // O schema na rota garante que as query params estão tipadas corretamente
    const query = request.query;
    const { month, year, type, categoryId } = query;
    const filters = { userId };
    if (month && year) {
        const start = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const end = (0, dayjs_1.default)(`${year}-${month}-01`).endOf('month').toDate();
        filters.date = { gte: start, lte: end };
    }
    if (type && Object.values(client_1.TransactionType).includes(type)) {
        filters.type = type;
    }
    if (categoryId && mongodb_1.ObjectId.isValid(categoryId)) {
        filters.categoryId = categoryId;
    }
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: { name: true, color: true, type: true }
                }
            }
        });
        reply.send(transactions);
    }
    catch (error) {
        request.log.error('Erro ao buscar transações:', error);
        reply.code(500).send({ error: 'Erro ao buscar transações' });
    }
};
exports.getTransactions = getTransactions;
