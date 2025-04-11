"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { name: 'asc' }
        });
        return res.json(categories);
    }
    catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};
exports.getCategories = getCategories;
