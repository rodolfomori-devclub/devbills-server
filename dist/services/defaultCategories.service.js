"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGlobalCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
// Categorias globais para despesas
const globalExpenseCategories = [
    {
        name: 'Alimentação',
        color: '#FF5733',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Transporte',
        color: '#33A8FF',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Moradia',
        color: '#33FF57',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Saúde',
        color: '#F033FF',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Educação',
        color: '#FF3366',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Lazer',
        color: '#FFBA33',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Compras',
        color: '#33FFF6',
        type: client_1.TransactionType.expense,
    },
    {
        name: 'Outros',
        color: '#B033FF',
        type: client_1.TransactionType.expense,
    },
];
// Categorias globais para receitas
const globalIncomeCategories = [
    {
        name: 'Salário',
        color: '#33FF57',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Freelance',
        color: '#33A8FF',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Investimentos',
        color: '#FFBA33',
        type: client_1.TransactionType.income,
    },
    {
        name: 'Outros',
        color: '#B033FF',
        type: client_1.TransactionType.income,
    },
];
/**
 * Inicializa as categorias globais na aplicação
 * Deve ser chamado durante a inicialização do servidor
 * @returns Array com as categorias criadas
 */
const initializeGlobalCategories = async () => {
    try {
        const allCategories = [...globalExpenseCategories, ...globalIncomeCategories];
        const createdCategories = [];
        console.log(`Iniciando verificação de categorias globais...`);
        // Inserir categorias uma a uma para evitar problemas de duplicação
        for (const category of allCategories) {
            try {
                // Verificar se a categoria já existe
                const existingCategory = await prisma_1.default.category.findFirst({
                    where: {
                        name: category.name,
                        type: category.type
                    }
                });
                // Se não existir, criar
                if (!existingCategory) {
                    const newCategory = await prisma_1.default.category.create({
                        data: category
                    });
                    createdCategories.push(newCategory);
                }
                else {
                    createdCategories.push(existingCategory);
                }
            }
            catch (err) {
                console.error(`Erro ao criar categoria ${category.name}:`, err);
            }
        }
        console.log(`✅ Verificação de categorias globais concluída. Total: ${createdCategories.length}`);
        return createdCategories;
    }
    catch (error) {
        console.error(`Erro ao inicializar categorias globais:`, error);
        return [];
    }
};
exports.initializeGlobalCategories = initializeGlobalCategories;
