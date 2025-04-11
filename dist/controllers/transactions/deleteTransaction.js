"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const mongodb_1 = require("mongodb");
const deleteTransaction = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const transaction = await prisma_1.default.transaction.findFirst({ where: { id, userId } });
        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        await prisma_1.default.transaction.delete({ where: { id } });
        return res.json({ message: 'Transação excluída com sucesso' });
    }
    catch (error) {
        console.error('Erro ao excluir transação:', error);
        return res.status(500).json({ error: 'Erro ao excluir transação' });
    }
};
exports.deleteTransaction = deleteTransaction;
