import { PrismaClient } from '@prisma/client';

// Exporta uma instância do PrismaClient para ser usada em toda a aplicação
const prisma = new PrismaClient();

export default prisma;