// controllers/transactions/createTransaction.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTransactionRoute } from "../../types";
import prisma from "../../config/prisma";
import { ObjectId } from "mongodb";
import { validateTransaction } from "../../utils/validation";

export const createTransaction = async (
  request: FastifyRequest<CreateTransactionRoute>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.code(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const transaction = request.body;

  // ✅ Validação dos dados
  const validationError = validateTransaction(transaction);
  if (validationError) {
    reply.code(400).send({ error: validationError });
    return;
  }

  // ✅ Verifica se o ID da categoria é válido
  if (!ObjectId.isValid(transaction.categoryId)) {
    reply.code(400).send({ error: "ID de categoria inválido" });
    return;
  }

  // ✅ Busca a categoria e valida se o tipo bate
  const category = await prisma.category.findFirst({
    where: {
      id: transaction.categoryId,
      type: transaction.type,
    },
  });

  if (!category) {
    reply.code(404).send({ error: "Categoria inválida" });
    return;
  }

  // ✅ Converte a data para tipo Date
  const parsedDate = new Date(transaction.date);
  if (Number.isNaN(parsedDate.getTime())) {
    reply.code(400).send({ error: "Data inválida" });
    return;
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId,
        date: parsedDate,
      },
      include: {
        category: true,
      },
    });

    reply.code(201).send(newTransaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      request.log.error("Erro inesperado:", error.message);
      reply.code(500).send({ error: `Erro ao criar transação: ${error.message}` });
    } else {
      request.log.error("Erro desconhecido:", error);
      reply.code(500).send({ error: "Erro desconhecido ao criar transação" });
    }
  }
};
