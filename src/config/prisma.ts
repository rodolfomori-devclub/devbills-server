// src/config/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
    process.exit(1);
  }
};

export default prisma;