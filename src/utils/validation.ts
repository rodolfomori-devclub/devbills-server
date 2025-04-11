import { CreateTransactionDTO, TransactionType } from '../types/transaction.types';
import { ObjectId } from 'mongodb';

export const validateTransaction = (transaction: CreateTransactionDTO): string | null => {
  if (!transaction.description) return 'Descrição obrigatória.';
  if (transaction.amount === undefined || transaction.amount === null) return 'Valor obrigatório.';
  if (isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) return 'Valor inválido.';
  if (!transaction.date) return 'Data obrigatória.';
  if (!transaction.categoryId || !ObjectId.isValid(transaction.categoryId)) return 'Categoria inválida.';
  if (!transaction.type || !Object.values(TransactionType).includes(transaction.type)) return 'Tipo inválido.';
  
  return null;
};