"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
// Importa módulos de rota específicos
const category_routes_1 = __importDefault(require("./category.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
/**
 * Plugin principal que registra todas as rotas da API
 */
async function routes(fastify, _options) {
    /**
     * Rota de saúde (health check)
     * Útil para verificar se o servidor está online
     */
    fastify.get('/health', async () => {
        return {
            status: 'ok',
            message: 'DevBills API está funcionando!',
        };
    });
    /**
     * Registra os grupos de rotas com prefixos
     */
    fastify.register(category_routes_1.default, { prefix: '/categories' });
    fastify.register(transaction_routes_1.default, { prefix: '/transactions' });
    fastify.register(user_routes_1.default, { prefix: '/users' });
}
