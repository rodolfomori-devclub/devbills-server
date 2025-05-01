import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTransaction } from "../controllers/transactions/createTransaction.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactionSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// 🧠 Importa schemas Zod
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionSummarySchema,
  getTransactionsSchema,
} from "../schemas/transaction.schema";

// 🧠 Converte schemas Zod para JSON Schema do Fastify

export default async function transactionRoutes(fastify: FastifyInstance): Promise<void> {
  // Aplica middleware global de autenticação
  fastify.addHook("preHandler", authMiddleware);

  // 📌 Criar transação
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  // 📌 Buscar transações
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSchema),
    },
    handler: getTransactions,
  });

  // 📌 Resumo
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: zodToJsonSchema(getTransactionSummarySchema),
    },
    handler: getTransactionSummary,
  });

  // 📌 Excluir
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: zodToJsonSchema(deleteTransactionSchema),
    },
    handler: deleteTransaction,
  });
}
