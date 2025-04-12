import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserInfo } from '../controllers/user.controller';

export default async function userRoutes(
  fastify: FastifyInstance, 
  options: FastifyPluginOptions
): Promise<void> {
  // 🔐 Middleware de autenticação para todas as rotas abaixo
  fastify.addHook('preHandler', authMiddleware);

  // 📌 Rota para obter dados do usuário autenticado
  fastify.get('/info', getUserInfo);
}
