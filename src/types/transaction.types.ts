import { TransactionType } from '@prisma/client';
import { CategorySummary } from './category.types';

export interface TransactionDTO {
  id?: string;
  description: string;
  amount: number;
  date: Date | string;
  type: TransactionType;
  categoryId: string;
  userId?: string;
}

export interface CreateTransactionRoute {
  Body: CreateTransactionDTO;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  type: TransactionType;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}