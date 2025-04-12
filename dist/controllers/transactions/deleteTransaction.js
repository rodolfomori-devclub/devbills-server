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
    // O schema na rota garante que os parâmetros estão tipados corretamente
    const params = request.params;
    const { id } = params;
    if (!userId) {
        reply.code(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    if (!mongodb_1.ObjectId.isValid(id)) {
        reply.code(400).send({ error: 'ID inválido' });
        return;
    }
    try {
        const transaction = await prisma_1.default.transaction.findFirst({ where: { id, userId } });
        if (!transaction) {
            reply.code(404).send({ error: 'Transação não encontrada' });
            return;
        }
        await prisma_1.default.transaction.delete({ where: { id } });
        reply.send({ message: 'Transação excluída com sucesso' });
    }
    catch (error) {
        request.log.error('Erro ao excluir transação:', error);
        reply.code(500).send({ error: 'Erro ao excluir transação' });
    }
};
exports.deleteTransaction = deleteTransaction;
