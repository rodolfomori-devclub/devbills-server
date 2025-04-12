"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const mongodb_1 = require("mongodb");
const deleteTransaction = async (request, reply) => {
    const userId = request.userId;
    const { id } = request.params;
    // Verifica se o usuário está autenticado
    if (!userId) {
        reply.code(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    // Verifica se o ID informado é válido
    if (!mongodb_1.ObjectId.isValid(id)) {
        reply.code(400).send({ error: 'ID de transação inválido' });
        return;
    }
    try {
        // Verifica se a transação existe e pertence ao usuário
        const transaction = await prisma_1.default.transaction.findFirst({
            where: { id, userId },
        });
        if (!transaction) {
            reply.code(404).send({ error: 'Transação não encontrada' });
            return;
        }
        // Exclui a transação
        await prisma_1.default.transaction.delete({ where: { id } });
        reply.code(200).send({ message: 'Transação excluída com sucesso' });
    }
    catch (error) {
        request.log.error('Erro ao excluir transação:', error);
        reply.code(500).send({ error: 'Erro ao excluir transação' });
    }
};
exports.deleteTransaction = deleteTransaction;
