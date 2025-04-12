// controllers/transactions/createTransaction.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateTransactionRoute } from '../../types';
import { validateTransaction } from '../../utils/validation';
import prisma from '../../config/prisma';
import { ObjectId } from 'mongodb';

export const createTransaction = async (
  request: FastifyRequest<CreateTransactionRoute>,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.code(401).send({ error: 'Usuário não autenticado' });
    return;
  }

  const transaction = request.body;

  const validationError = validateTransaction(transaction);
  if (validationError) {
    reply.code(400).send({ error: validationError });
    return;
  }

  if (!ObjectId.isValid(transaction.categoryId)) {
    reply.code(400).send({ error: 'ID de categoria inválido' });
    return;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: transaction.categoryId,
      type: transaction.type
    }
  });

  if (!category) {
    reply.code(404).send({ error: 'Categoria inválida' });
    return;
  }

  const parsedDate = new Date(transaction.date);
  if (isNaN(parsedDate.getTime())) {
    reply.code(400).send({ error: 'Data inválida' });
    return;
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId,
        date: parsedDate
      },
      include: {
        category: true
      }
    });

    reply.code(201).send(newTransaction);
  } catch (error: any) {
    request.log.error('Erro inesperado:', error);
    reply.code(500).send({ error: 'Erro ao criar transação' });
  }
};
