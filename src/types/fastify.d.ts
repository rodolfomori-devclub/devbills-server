// Extensão de tipos para o Fastify
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}
