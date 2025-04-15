import prisma from "../config/prisma";

import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * GET /users/info
 * Retorna estatísticas básicas do usuário autenticado
 */
export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  try {
    // Conta quantas transações o usuário já criou
    const transactionsCount = await prisma.transaction.count({
      where: { userId },
    });

    reply.send({
      message: "Informações do usuário",
      userId,
      statistics: {
        transactionsCount,
      },
    });
  } catch (error) {
    request.log.error("Erro ao buscar informações do usuário:", error);
    reply.status(500).send({ error: "Erro ao buscar informações do usuário" });
  }
};

/**
 * POST /users/initialize
 * Endpoint para registrar o primeiro acesso (exemplo simples)
 */
export const registerFirstAccess = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "Usuário não autenticado" });
    return;
  }

  reply.send({
    message: "Primeiro acesso registrado com sucesso",
    userId,
  });
};
