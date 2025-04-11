"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFirstAccess = exports.getUserInfo = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Retorna dados estatísticos do usuário autenticado
 */
const getUserInfo = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    try {
        const transactionsCount = await prisma_1.default.transaction.count({ where: { userId } });
        return res.json({
            message: 'Informações do usuário',
            userId,
            statistics: {
                transactionsCount
            }
        });
    }
    catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        return res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
    }
};
exports.getUserInfo = getUserInfo;
/**
 * Registra o primeiro acesso do usuário autenticado
 */
const registerFirstAccess = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    // Aqui poderia criar um registro em banco, por enquanto só responde
    return res.json({
        message: 'Primeiro acesso registrado com sucesso',
        userId
    });
};
exports.registerFirstAccess = registerFirstAccess;
