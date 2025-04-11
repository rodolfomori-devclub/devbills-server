"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de autenticação não fornecido' });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
        return next();
    }
    catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};
exports.authMiddleware = authMiddleware;
