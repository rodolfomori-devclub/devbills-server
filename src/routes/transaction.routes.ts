import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createTransaction } from '../controllers/transactions/createTransaction.controller';
import { getTransactions } from '../controllers/transactions/getTransactions.controller';
import { getTransactionSummary } from '../controllers/transactions/getTransactionSummary.controller';
import { deleteTransaction } from '../controllers/transactions/deleteTransaction.controller';

export default async function transactionRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  // Middleware de autenticação para todas as rotas abaixo
  fastify.addHook('preHandler', authMiddleware);

  // 📌 Criar transação
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        required: ['description', 'amount', 'date', 'categoryId', 'type'],
        properties: {
          description: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string', format: 'date-time' },
          categoryId: { type: 'string' },
          type: { type: 'string', enum: ['expense', 'income'] },
        },
      },
    },
    handler: createTransaction,
  });

  // 📌 Buscar transações com filtros
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          year: { type: 'string' },
          type: { type: 'string', enum: ['expense', 'income'] },
          categoryId: { type: 'string' },
        },
      },
    },
    handler: getTransactions,
  });

  // 📌 Resumo de transações
  fastify.route({
    method: 'GET',
    url: '/summary',
    schema: {
      querystring: {
        type: 'object',
        required: ['month', 'year'],
        properties: {
          month: { type: 'string' },
          year: { type: 'string' },
        },
      },
    },
    handler: getTransactionSummary,
  });

  // 📌 Excluir transação
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: deleteTransaction,
  });
}
