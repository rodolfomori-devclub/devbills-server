import { CreateTransactionDTO } from '../types';
import { TransactionType } from '@prisma/client';
import { ObjectId } from 'mongodb';

/**
 * Valida os dados de uma transação
 * @param transaction Dados da transação
 * @returns string com mensagem de erro ou null se estiver tudo certo
 */
export const validateTransaction = (transaction: CreateTransactionDTO): string | null => {
  if (!transaction.description) return 'Descrição obrigatória.';

  if (transaction.amount === undefined || transaction.amount === null) {
    return 'Valor obrigatório.';
  }

  if (isNaN(Number(transaction.amount)) || Number(transaction.amount) <= 0) {
    return 'Valor inválido.';
  }

  if (!transaction.date) return 'Data obrigatória.';

  if (!transaction.categoryId || !ObjectId.isValid(transaction.categoryId)) {
    return 'Categoria inválida.';
  }

  if (!transaction.type || !Object.values(TransactionType).includes(transaction.type)) {
    return 'Tipo inválido.';
  }

  return null;
};
