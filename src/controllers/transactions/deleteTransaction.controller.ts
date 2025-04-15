import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../config/prisma";
import { ObjectId } from "mongodb";

interface DeleteParams {
  id: string;
}

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;
  const { id } = request.params;

  // Verifica se o usuário está autenticado
  if (!userId) {
    reply.code(401).send({ error: "Usuário não autenticado" });
    return;
  }

  // Verifica se o ID informado é válido
  if (!ObjectId.isValid(id)) {
    reply.code(400).send({ error: "ID de transação inválido" });
    return;
  }

  try {
    // Verifica se a transação existe e pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      reply.code(404).send({ error: "Transação não encontrada" });
      return;
    }

    // Exclui a transação
    await prisma.transaction.delete({ where: { id } });

    reply.code(200).send({ message: "Transação excluída com sucesso" });
  } catch (error) {
    request.log.error("Erro ao excluir transação:", error);
    reply.code(500).send({ error: "Erro ao excluir transação" });
  }
};
