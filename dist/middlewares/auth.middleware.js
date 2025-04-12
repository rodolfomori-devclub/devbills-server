"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
/**
 * Middleware de autenticação com Firebase
 * Verifica o token JWT enviado no header Authorization
 * e adiciona o userId ao request se for válido.
 */
const authMiddleware = async (request, reply) => {
    const authHeader = request.headers.authorization;
    // Verifica se o token foi enviado no header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'Token de autenticação não fornecido' });
        return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        // Verifica a validade do token com o Firebase
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        // Adiciona o userId ao request (para uso nos controllers)
        request.userId = decodedToken.uid;
    }
    catch (error) {
        request.log.error('Erro ao verificar token:', error);
        reply.code(401).send({ error: 'Token inválido ou expirado' });
    }
};
exports.authMiddleware = authMiddleware;
