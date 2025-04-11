"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./config/prisma"));
const firebase_1 = __importDefault(require("./config/firebase"));
const globalCategories_service_1 = require("./services/globalCategories.service");
const PORT = process.env.PORT || 3333;
// Inicializar Firebase Admin SDK
(0, firebase_1.default)();
const startServer = async () => {
    try {
        await prisma_1.default.$connect();
        console.log('📦 Conectado ao banco de dados');
        await (0, globalCategories_service_1.initializeGlobalCategories)();
        console.log('🏷️ Categorias globais carregadas');
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Erro ao conectar no banco:', error);
        process.exit(1);
    }
};
startServer();
// Desconectar Prisma ao encerrar o processo
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
