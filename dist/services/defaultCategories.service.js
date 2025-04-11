"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultCategories = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
// Categorias padrão para despesas
const defaultExpenseCategories = [
    {
        name: 'Alimentação',
        color: '#FF5733',
        icon: 'restaurant',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Transporte',
        color: '#33A8FF',
        icon: 'car',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Moradia',
        color: '#33FF57',
        icon: 'home',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Saúde',
        color: '#F033FF',
        icon: 'heart',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Educação',
        color: '#FF3366',
        icon: 'book',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Lazer',
        color: '#FFBA33',
        icon: 'music',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Compras',
        color: '#33FFF6',
        icon: 'shopping-bag',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Outros',
        color: '#B033FF',
        icon: 'package',
        type: client_1.TransactionType.expense,
    },
];
// Categorias padrão para receitas
const defaultIncomeCategories = [
    {
        name: 'Salário',
        color: '#33FF57',
        icon: 'briefcase',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Freelance',
        color: '#33A8FF',
        icon: 'code',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Investimentos',
        color: '#FFBA33',
        icon: 'trending-up',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Outros',
        color: '#B033FF',
        icon: 'dollar-sign',
        type: client_1.TransactionType.income,
    },
];
/**
 * Cria categorias padrão para um novo usuário
 * @param userId ID do usuário
 */
const createDefaultCategories = async (userId) => {
    try {
        const allDefaultCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];
        // Adicionar o userId a cada categoria
        const categoriesToInsert = allDefaultCategories.map(category => ({
            ...category,
            userId,
        }));
        // Inserir categorias uma a uma para evitar problemas de duplicação
        for (const category of categoriesToInsert) {
            // Verificar se a categoria já existe
            const existingCategory = await prisma_1.default.category.findFirst({
                where: {
                    userId,
                    name: category.name,
                    type: category.type
                }
            });
            // Se não existir, criar
            if (!existingCategory) {
                await prisma_1.default.category.create({
                    data: category
                });
            }
        }
        console.log(`✅ Categorias padrão criadas para o usuário ${userId}`);
    }
    catch (error) {
        console.error(`Erro ao criar categorias padrão para o usuário ${userId}:`, error);
    }
};
exports.createDefaultCategories = createDefaultCategories;
