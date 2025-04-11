// src/types/index.ts
import { TransactionType as PrismaTransactionType } from '@prisma/client';

// Re-exportar o tipo do Prisma
export { PrismaTransactionType as TransactionType };

// Estender o Express Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// DTOs
export interface CategoryDTO {
  id?: string;
  name: string;
  color: string;
  type: PrismaTransactionType;
  userId?: string;
}

export interface TransactionDTO {
  id?: string;
  description: string;
  amount: number;
  date: Date | string;
  type: PrismaTransactionType;
  categoryId: string;
  userId?: string;
}

// Formato de resumo de transações
export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}