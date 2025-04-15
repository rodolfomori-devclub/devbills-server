import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getCategories } from "../controllers/category.controller";

/**
 * Rotas relacionadas às categorias (públicas)
 */
export default async function categoryRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  /**
   * GET /categories
   * Lista todas as categorias globais disponíveis
   */
  fastify.get("/", getCategories);
}
