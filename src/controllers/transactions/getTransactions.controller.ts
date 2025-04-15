import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../config/prisma";
import { TransactionType } from "@prisma/client";
import type { TransactionQuery, TransactionFilters } from "../../types";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: TransactionQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  const { month, year, type, categoryId } = request.query;

  const filters: TransactionFilters = { userId };

  // Filtro por data (mês e ano)
  if (month && year) {
    const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs(startDate).endOf("month").toDate();
    filters.date = { gte: startDate, lte: endDate };
  }

  // Filtro por tipo (income ou expense)
  if (type && Object.values(TransactionType).includes(type)) {
    filters.type = type;
  }

  // Filtro por categoria (valida se ID é válido)
  if (categoryId && ObjectId.isValid(categoryId)) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            type: true,
          },
        },
      },
    });

    reply.send(transactions);
  } catch (error) {
    request.log.error("Erro ao buscar transações:", error);
    reply.status(500).send({ error: "Erro ao buscar transações" });
  }
};
