import prisma from '../config/prisma';
import { TransactionType } from '@prisma/client';

// Categorias padrão para despesas
const defaultExpenseCategories = [
  {
    name: 'Alimentação',
    color: '#FF5733',
    type: TransactionType.expense,
  },
  {
    name: 'Transporte',
    color: '#33A8FF',
    type: TransactionType.expense,
  },
  {
    name: 'Moradia',
    color: '#33FF57',
    type: TransactionType.expense,
  },
  {
    name: 'Saúde',
    color: '#F033FF',
    type: TransactionType.expense,
  },
  {
    name: 'Educação',
    color: '#FF3366',
    type: TransactionType.expense,
  },
  {
    name: 'Lazer',
    color: '#FFBA33',
    type: TransactionType.expense,
  },
  {
    name: 'Compras',
    color: '#33FFF6',
    type: TransactionType.expense,
  },
  {
    name: 'Outros',
    color: '#B033FF',
    type: TransactionType.expense,
  },
];

// Categorias padrão para receitas
const defaultIncomeCategories = [
  {
    name: 'Salário',
    color: '#33FF57',
    type: TransactionType.income,
  },
  {
    name: 'Freelance',
    color: '#33A8FF',
    type: TransactionType.income,
  },
  {
    name: 'Investimentos',
    color: '#FFBA33',
    type: TransactionType.income,
  },
  {
    name: 'Outros',
    color: '#B033FF',
    type: TransactionType.income,
  },
];

/**
 * Cria categorias padrão para um novo usuário
 * @param userId ID do usuário
 * @returns Array com as categorias criadas
 */
export const createDefaultCategories = async (userId: string): Promise<any[]> => {
  try {
    const allDefaultCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];
    
    // Adicionar o userId a cada categoria
    const categoriesToInsert = allDefaultCategories.map(category => ({
      ...category,
      userId,
    }));
    
    console.log(`Tentando criar ${categoriesToInsert.length} categorias para o usuário ${userId}`);
    
    // Array para armazenar as categorias criadas
    const createdCategories = [];
    
    // Inserir categorias uma a uma para evitar problemas de duplicação
    for (const category of categoriesToInsert) {
      try {
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
          const newCategory = await prisma.category.create({
            data: category
          });
          
          console.log(`Categoria criada: ${newCategory.name} (${newCategory.id})`);
          createdCategories.push(newCategory);
        } else {
          console.log(`Categoria já existe: ${existingCategory.name} (${existingCategory.id})`);
        }
      } catch (err) {
        console.error(`Erro ao criar categoria ${category.name}:`, err);
      }
    }
    
    console.log(`✅ ${createdCategories.length} categorias padrão criadas para o usuário ${userId}`);
    return createdCategories;
  } catch (error) {
    console.error(`Erro ao criar categorias padrão para o usuário ${userId}:`, error);
    return [];
  }
};