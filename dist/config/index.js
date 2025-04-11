"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.testDatabaseConnection = exports.initializeFirebaseAdmin = exports.prisma = void 0;
// src/config/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const client_1 = require("@prisma/client");
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Inicializar Prisma
exports.prisma = new client_1.PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
});
// Middleware global de erro para o Prisma
exports.prisma.$use(async (params, next) => {
    try {
        return await next(params);
    }
    catch (error) {
        console.error(`Erro do Prisma em ${params.model}.${params.action}:`, error);
        throw error;
    }
});
// Inicializar Firebase Admin
const initializeFirebaseAdmin = () => {
    try {
        if (firebase_admin_1.default.apps.length === 0) {
            if (process.env.FIREBASE_PROJECT_ID) {
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
            else {
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.applicationDefault(),
                });
            }
            console.log('🔥 Firebase Admin inicializado');
        }
    }
    catch (error) {
        console.error('❌ Erro ao inicializar Firebase Admin:', error);
        process.exit(1);
    }
};
exports.initializeFirebaseAdmin = initializeFirebaseAdmin;
// Verificar conexão com banco de dados
const testDatabaseConnection = async () => {
    try {
        await exports.prisma.$connect();
        console.log('📦 Prisma conectado ao banco de dados');
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
};
exports.testDatabaseConnection = testDatabaseConnection;
