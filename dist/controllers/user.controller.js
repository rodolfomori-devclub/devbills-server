"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const defaultCategories_service_1 = require("../services/defaultCategories.service");
const initializeUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        // Verificar se o usuário já tem categorias
        const existingCategories = await prisma_1.default.category.findMany({
            where: { userId }
        });
        console.log(`Usuário ${userId} tem ${existingCategories.length} categorias existentes.`);
        if (existingCategories.length > 0) {
            return res.json({
                message: 'Usuário já inicializado',
                userId,
                categoriesCount: existingCategories.length
            });
        }
        // Criar categorias padrão usando o serviço
        const createdCategories = await (0, defaultCategories_service_1.createDefaultCategories)(userId);
        console.log(`Criadas ${createdCategories.length} categorias para o usuário ${userId}.`);
        return res.json({
            message: 'Usuário inicializado com sucesso',
            userId,
            categoriesCount: createdCategories.length
        });
    }
    catch (error) {
        console.error('Erro ao inicializar usuário:', error);
        return res.status(500).json({ error: 'Erro ao inicializar usuário' });
    }
};
exports.initializeUser = initializeUser;
