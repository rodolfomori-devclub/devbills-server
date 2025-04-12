import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import routes from './routes';

/**
 * Cria a instância do servidor Fastify
 */
const app: FastifyInstance = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'error'
  }
});

/**
 * Configura CORS
 */
app.register(cors);

/**
 * Registra as rotas da aplicação
 */
app.register(routes, { prefix: '/api' });

export default app;
