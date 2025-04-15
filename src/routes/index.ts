import type { FastifyInstance, FastifyPluginOptions } from "fastify";

// Importa módulos de rota específicos
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transaction.routes";
import userRoutes from "./user.routes";

/**
 * Plugin principal que registra todas as rotas da API
 */
export default async function routes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  /**
   * Rota de saúde (health check)
   * Útil para verificar se o servidor está online
   */
  fastify.get("/health", async () => {
    return {
      status: "ok",
      message: "DevBills API está funcionando!",
    };
  });

  /**
   * Registra os grupos de rotas com prefixos
   */
  fastify.register(categoryRoutes, { prefix: "/categories" });
  fastify.register(transactionRoutes, { prefix: "/transactions" });
  fastify.register(userRoutes, { prefix: "/users" });
}
