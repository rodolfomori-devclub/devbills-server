"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = __importDefault(require("./routes"));
/**
 * Cria a instância do servidor Fastify
 */
const app = (0, fastify_1.default)({
    logger: {
        level: process.env.NODE_ENV === 'development' ? 'info' : 'error'
    }
});
/**
 * Configura CORS
 */
app.register(cors_1.default, {
    origin: true // Permite qualquer origem (ideal para desenvolvimento)
});
/**
 * Registra as rotas da aplicação
 */
app.register(routes_1.default, { prefix: '/api' });
exports.default = app;
