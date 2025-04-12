"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega variáveis de ambiente do .env
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./config/prisma"));
const firebase_1 = __importDefault(require("./config/firebase"));
const globalCategories_service_1 = require("./services/globalCategories.service");
const PORT = parseInt(process.env.PORT || '3333', 10);
// Inicializa serviços externos
(0, firebase_1.default)(); // Firebase Admin SDK
const startServer = async () => {
    try {
        // Conexão com banco de dados
        await prisma_1.default.$connect();
        console.log('📦 Conectado ao banco de dados');
        // Categorias padrão da aplicação
        await (0, globalCategories_service_1.initializeGlobalCategories)();
        console.log('🏷️ Categorias globais carregadas');
        // Inicia o servidor
        await app_1.default.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    }
    catch (error) {
        app_1.default.log.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1); // Encerra o processo com erro
    }
};
// Executa o servidor
startServer();
// Finalização elegante ao interromper
process.on('SIGINT', async () => {
    console.log('⛔ Encerrando servidor...');
    await app_1.default.close();
    await prisma_1.default.$disconnect();
    process.exit(0);
});
