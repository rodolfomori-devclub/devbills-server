"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const transaction_types_1 = require("../types/transaction.types");
// Método para listar categorias
const getCategories = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        // Filtrar por tipo, se fornecido
        const { type } = req.query;
        const whereClause = { userId };
        if (type && Object.values(transaction_types_1.TransactionType).includes(type)) {
            whereClause.type = type;
        }
        // Buscar as categorias
        const categories = await prisma_1.default.category.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });
        // Log para depuração
        console.log(`Categorias encontradas para o usuário ${userId}:`, categories.map(c => ({ id: c.id, name: c.name, type: c.type })));
        // Se não houver categorias, criar categorias padrão
        if (categories.length === 0) {
            console.log(`Usuário ${userId} não tem categorias. Enviando resposta vazia.`);
        }
        return res.json(categories);
    }
    catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};
exports.getCategories = getCategories;
