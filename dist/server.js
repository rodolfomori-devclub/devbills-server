"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_1 = __importDefault(require("./config/firebase"));
const index_1 = __importDefault(require("./routes/index"));
const prisma_1 = __importDefault(require("./lib/prisma"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Inicializar Firebase Admin SDK
(0, firebase_1.default)();
// Criar aplicação Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://devbills.vercel.app'
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json({ limit: '1mb' }));
// Rotas
app.use('/api', index_1.default);
// Verificar conexão com banco de dados e iniciar o servidor
const startServer = async () => {
    try {
        // Testar a conexão com o banco de dados
        await prisma_1.default.$connect();
        console.log('📦 Connected to Database');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
    finally {
        // Desconectar o Prisma (embora seja opcional)
        await prisma_1.default.$disconnect();
    }
};
// Iniciar o servidor
startServer();
// Lidar com encerramento do processo
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
