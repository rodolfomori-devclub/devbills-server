import { TransactionType } from '@prisma/client';

export { TransactionType };

export interface ICategorySummary {
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
  expensesByCategory: ICategorySummary[];
}

// DTOs (Data Transfer Objects)
export interface CreateCategoryDTO {
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  type: TransactionType;
}

export interface UpdateTransactionDTO {
  description?: string;
  amount?: number;
  date?: string | Date;
  categoryId?: string;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: TransactionType;
  categoryId?: string;
}