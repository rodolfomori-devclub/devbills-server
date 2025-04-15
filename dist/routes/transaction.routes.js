"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionRoutes;
const auth_middleware_1 = require("../middlewares/auth.middleware");
const createTransaction_controller_1 = require("../controllers/transactions/createTransaction.controller");
const getTransactions_controller_1 = require("../controllers/transactions/getTransactions.controller");
const getTransactionSummary_controller_1 = require("../controllers/transactions/getTransactionSummary.controller");
const deleteTransaction_controller_1 = require("../controllers/transactions/deleteTransaction.controller");
async function transactionRoutes(fastify, options) {
    // Middleware de autenticação para todas as rotas abaixo
    fastify.addHook("preHandler", auth_middleware_1.authMiddleware);
    // 📌 Criar transação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: {
                type: "object",
                required: ["description", "amount", "date", "categoryId", "type"],
                properties: {
                    description: { type: "string" },
                    amount: { type: "number" },
                    date: { type: "string", format: "date-time" },
                    categoryId: { type: "string" },
                    type: { type: "string", enum: ["expense", "income"] },
                },
            },
        },
        handler: createTransaction_controller_1.createTransaction,
    });
    // 📌 Buscar transações com filtros
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: {
                type: "object",
                properties: {
                    month: { type: "string" },
                    year: { type: "string" },
                    type: { type: "string", enum: ["expense", "income"] },
                    categoryId: { type: "string" },
                },
            },
        },
        handler: getTransactions_controller_1.getTransactions,
    });
    // 📌 Resumo de transações
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: {
                type: "object",
                required: ["month", "year"],
                properties: {
                    month: { type: "string" },
                    year: { type: "string" },
                },
            },
        },
        handler: getTransactionSummary_controller_1.getTransactionSummary,
    });
    // 📌 Excluir transação
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string" },
                },
            },
        },
        handler: deleteTransaction_controller_1.deleteTransaction,
    });
}
