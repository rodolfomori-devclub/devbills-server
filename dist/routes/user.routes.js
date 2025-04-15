"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
async function userRoutes(fastify, options) {
    // 🔐 Middleware de autenticação para todas as rotas abaixo
    fastify.addHook("preHandler", auth_middleware_1.authMiddleware);
    // 📌 Rota para obter dados do usuário autenticado
    fastify.get("/info", user_controller_1.getUserInfo);
}
