"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transactionRoutes;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const createTransaction_controller_1 = require("../controllers/transactions/createTransaction.controller");
const deleteTransaction_controller_1 = require("../controllers/transactions/deleteTransaction.controller");
const getTransactionSummary_controller_1 = require("../controllers/transactions/getTransactionSummary.controller");
const getTransactions_controller_1 = require("../controllers/transactions/getTransactions.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// 🧠 Importa schemas Zod
const transaction_schema_1 = require("../schemas/transaction.schema");
// 🧠 Converte schemas Zod para JSON Schema do Fastify
async function transactionRoutes(fastify) {
    // Aplica middleware global de autenticação
    fastify.addHook("preHandler", auth_middleware_1.authMiddleware);
    // 📌 Criar transação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_1.createTransactionSchema),
        },
        handler: createTransaction_controller_1.createTransaction,
    });
    // 📌 Buscar transações
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_1.getTransactionsSchema),
        },
        handler: getTransactions_controller_1.getTransactions,
    });
    // 📌 Resumo
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_1.getTransactionSummarySchema),
        },
        handler: getTransactionSummary_controller_1.getTransactionSummary,
    });
    // 📌 Excluir
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: (0, zod_to_json_schema_1.zodToJsonSchema)(transaction_schema_1.deleteTransactionSchema),
        },
        handler: deleteTransaction_controller_1.deleteTransaction,
    });
}
