import prisma from '../lib/prisma';
import { TransactionType } from '@prisma/client';

// Categorias padrão para despesas
const defaultExpenseCategories = [
  {
    name: 'Alimentação',
    color: '#FF5733',
    icon: 'restaurant',
    type: TransactionType.expense,
  },
  {
    name: 'Transporte',
    color: '#33A8FF',
    icon: 'car',
    type: TransactionType.expense,
  },
  {
    name: 'Moradia',
    color: '#33FF57',
    icon: 'home',
    type: TransactionType.expense,
  },
  {
    name: 'Saúde',
    color: '#F033FF',
    icon: 'heart',
    type: TransactionType.expense,
  },
  {
    name: 'Educação',
    color: '#FF3366',
    icon: 'book',
    type: TransactionType.expense,
  },
  {
    name: 'Lazer',
    color: '#FFBA33',
    icon: 'music',
    type: TransactionType.expense,
  },
  {
    name: 'Compras',
    color: '#33FFF6',
    icon: 'shopping-bag',
    type: TransactionType.expense,
  },
  {
    name: 'Outros',
    color: '#B033FF',
    icon: 'package',
    type: TransactionType.expense,
  },
];

// Categorias padrão para receitas
const defaultIncomeCategories = [
  {
    name: 'Salário',
    color: '#33FF57',
    icon: 'briefcase',
    type: TransactionType.income,
  },
  {
    name: 'Freelance',
    color: '#33A8FF',
    icon: 'code',
    type: TransactionType.income,
  },
  {
    name: 'Investimentos',
    color: '#FFBA33',
    icon: 'trending-up',
    type: TransactionType.income,
  },
  {
    name: 'Outros',
    color: '#B033FF',
    icon: 'dollar-sign',
    type: TransactionType.income,
  },
];

/**
 * Cria categorias padrão para um novo usuário
 * @param userId ID do usuário
 */
export const createDefaultCategories = async (userId: string): Promise<void> => {
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
      const existingCategory = await prisma.category.findFirst({
        where: {
          userId,
          name: category.name,
          type: category.type
        }
      });
      
      // Se não existir, criar
      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
      }
    }
    
    console.log(`✅ Categorias padrão criadas para o usuário ${userId}`);
  } catch (error) {
    console.error(`Erro ao criar categorias padrão para o usuário ${userId}:`, error);
  }
};