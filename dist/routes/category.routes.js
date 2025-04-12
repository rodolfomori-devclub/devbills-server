"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = categoryRoutes;
const category_controller_1 = require("../controllers/category.controller");
/**
 * Rotas relacionadas às categorias (públicas)
 */
async function categoryRoutes(fastify, _options) {
    /**
     * GET /categories
     * Lista todas as categorias globais disponíveis
     */
    fastify.get('/', category_controller_1.getCategories);
}
