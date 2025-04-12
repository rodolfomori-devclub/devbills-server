"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
async function userRoutes(fastify, options) {
    // Aplica o middleware de autenticação em todas as rotas
    fastify.addHook('preHandler', auth_middleware_1.authMiddleware);
    fastify.get('/info', user_controller_1.getUserInfo);
}
