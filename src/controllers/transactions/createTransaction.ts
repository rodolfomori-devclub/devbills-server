import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { ObjectId } from 'mongodb';
import { CreateTransactionDTO } from '../../types';
import { TransactionType } from '@prisma/client';
import { validateTransaction } from '../../utils/validation';

interface CustomRequest extends Request {
  body: CreateTransactionDTO;
}

export const createTransaction = async (req: CustomRequest, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const transaction = req.body;

  // Validação com função utilitária
  const validationError = validateTransaction(transaction);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Validação extra: verificar se o ID é um ObjectId válido (a função de validação já faz isso, mas aqui reforçamos caso queira deixar separado)
  if (!ObjectId.isValid(transaction.categoryId)) {
    return res.status(400).json({ error: 'ID de categoria inválido' });
  }

  const category = await prisma.category.findFirst({
    where: {
      id: transaction.categoryId,
      type: transaction.type
    }
  });

  if (!category) {
    return res.status(404).json({ error: 'Categoria inválida' });
  }

  const parsedDate = new Date(transaction.date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'Data inválida' });
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        description: transaction.description,
        amount: Number(transaction.amount),
        date: parsedDate,
        type: transaction.type,
        userId,
        categoryId: transaction.categoryId
      },
      include: {
        category: true
      }
    });

    return res.status(201).json(newTransaction);
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }

    console.error('Erro inesperado:', error);
    return res.status(500).json({ error: 'Erro ao criar transação' });
  }
};
