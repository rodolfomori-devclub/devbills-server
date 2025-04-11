import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initializeFirebaseAdmin from './config/firebase';
import routes from './routes/index';
import prisma from './config/prisma';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Firebase Admin SDK
initializeFirebaseAdmin();

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://devbills.vercel.app' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Rotas
app.use('/api', routes);

// Verificar conexão com banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    // Testar a conexão com o banco de dados
    await prisma.$connect();
    console.log('📦 Connected to Database');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  } finally {
    // Desconectar o Prisma (embora seja opcional)
    await prisma.$disconnect();
  }
};

// Iniciar o servidor
startServer();

// Lidar com encerramento do processo
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});