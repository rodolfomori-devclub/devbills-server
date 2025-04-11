import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './config/prisma';
import initializeFirebaseAdmin from './config/firebase';
import { initializeGlobalCategories } from './services/globalCategories.service';

const PORT = process.env.PORT || 3333;

// Inicializar Firebase Admin SDK
initializeFirebaseAdmin();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Conectado ao banco de dados');

    await initializeGlobalCategories();
    console.log('🏷️ Categorias globais carregadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  }
};

startServer();

// Desconectar Prisma ao encerrar o processo
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
