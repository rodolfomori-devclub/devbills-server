import { TransactionType } from '@prisma/client';

export interface CategoryDTO {
  id?: string;
  name: string;
  color: string;
  type: TransactionType;
  userId?: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}