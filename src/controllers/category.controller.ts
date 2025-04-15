import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prisma";

// Controlador responsável por listar categorias disponíveis
export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    // Buscar categorias ordenadas por nome (ordem alfabética)
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    reply.send(categories);
  } catch (error) {
    request.log.error("Erro ao buscar categorias:", error);
    reply.status(500).send({ error: "Erro ao buscar categorias" });
  }
};
