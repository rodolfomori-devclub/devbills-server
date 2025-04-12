"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFirstAccess = exports.getUserInfo = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * GET /users/info
 * Retorna estatísticas básicas do usuário autenticado
 */
const getUserInfo = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    try {
        // Conta quantas transações o usuário já criou
        const transactionsCount = await prisma_1.default.transaction.count({
            where: { userId }
        });
        reply.send({
            message: 'Informações do usuário',
            userId,
            statistics: {
                transactionsCount
            }
        });
    }
    catch (error) {
        request.log.error('Erro ao buscar informações do usuário:', error);
        reply.status(500).send({ error: 'Erro ao buscar informações do usuário' });
    }
};
exports.getUserInfo = getUserInfo;
/**
 * POST /users/initialize
 * Endpoint para registrar o primeiro acesso (exemplo simples)
 */
const registerFirstAccess = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: 'Usuário não autenticado' });
        return;
    }
    reply.send({
        message: 'Primeiro acesso registrado com sucesso',
        userId
    });
};
exports.registerFirstAccess = registerFirstAccess;
