"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const transaction_types_1 = require("../types/transaction.types");
const createCategory = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        const { name, color, icon, type } = req.body;
        // Validações básicas
        if (!name || !color || !icon || !type) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        // Verificar se o tipo é válido
        if (!Object.values(transaction_types_1.TransactionType).includes(type)) {
            return res.status(400).json({ error: 'Tipo de transação inválido' });
        }
        try {
            // Criar a categoria usando o Prisma
            const newCategory = await prisma_1.default.category.create({
                data: {
                    name,
                    color,
                    icon,
                    type,
                    userId
                }
            });
            return res.status(201).json(newCategory);
        }
        catch (error) {
            // Verificar se é um erro de unicidade (categoria com mesmo nome e tipo já existe)
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Já existe uma categoria com este nome e tipo' });
            }
            throw error;
        }
    }
    catch (error) {
        console.error('Erro ao criar categoria:', error);
        return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
};
exports.createCategory = createCategory;
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
        const categories = await prisma_1.default.category.findMany({
            where: whereClause,
            orderBy: { name: 'asc' }
        });
        return res.json(categories);
    }
    catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};
exports.getCategories = getCategories;
const updateCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        const { name, color, icon } = req.body;
        // Validações básicas
        if (!name && !color && !icon) {
            return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
        }
        // Verificar se a categoria existe e pertence ao usuário
        const category = await prisma_1.default.category.findFirst({
            where: { id, userId }
        });
        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        // Preparar dados para atualização
        const updateData = {};
        if (name)
            updateData.name = name;
        if (color)
            updateData.color = color;
        if (icon)
            updateData.icon = icon;
        try {
            // Atualizar a categoria
            const updatedCategory = await prisma_1.default.category.update({
                where: { id },
                data: updateData
            });
            return res.json(updatedCategory);
        }
        catch (error) {
            // Verificar se é um erro de unicidade (nome já existe)
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Já existe uma categoria com este nome e tipo' });
            }
            throw error;
        }
    }
    catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        return res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        // Verificar se a categoria existe e pertence ao usuário
        const category = await prisma_1.default.category.findFirst({
            where: { id, userId }
        });
        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        // Verificar se existem transações associadas a esta categoria
        const transactionCount = await prisma_1.default.transaction.count({
            where: { categoryId: id }
        });
        if (transactionCount > 0) {
            return res.status(400).json({
                error: 'Não é possível excluir esta categoria pois existem transações associadas a ela'
            });
        }
        // Excluir a categoria
        await prisma_1.default.category.delete({
            where: { id }
        });
        return res.json({ message: 'Categoria excluída com sucesso' });
    }
    catch (error) {
        console.error('Erro ao excluir categoria:', error);
        return res.status(500).json({ error: 'Erro ao excluir categoria' });
    }
};
exports.deleteCategory = deleteCategory;
