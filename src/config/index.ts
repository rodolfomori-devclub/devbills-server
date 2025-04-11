// src/config/index.ts
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Prisma
export const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

// Middleware global de erro para o Prisma
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Erro do Prisma em ${params.model}.${params.action}:`, error);
    throw error;
  }
});

// Inicializar Firebase Admin
export const initializeFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
      console.log('🔥 Firebase Admin inicializado');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    process.exit(1);
  }
};

// Verificar conexão com banco de dados
export const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log('📦 Prisma conectado ao banco de dados');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export { admin };