"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const firebase_1 = __importDefault(require("./config/firebase"));
const prisma_1 = __importDefault(require("./config/prisma"));
const globalCategories_service_1 = require("./services/globalCategories.service");
const PORT = env_1.env.PORT;
// Inicializa serviços externos
(0, firebase_1.default)(); // Firebase Admin SDK
const startServer = async () => {
    try {
        // Conexão com banco de dados
        await prisma_1.default.$connect();
        console.log("📦 Conectado ao banco de dados");
        // Categorias padrão da aplicação
        await (0, globalCategories_service_1.initializeGlobalCategories)();
        console.log("🏷️ Categorias globais carregadas");
        // Inicia o servidor
        await app_1.default.listen({ port: PORT });
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    }
    catch (error) {
        app_1.default.log.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1); // Encerra o processo com erro
    }
};
// Executa o servidor
startServer();
// Finalização elegante ao interromper
process.on("SIGINT", async () => {
    console.log("⛔ Encerrando servidor...");
    await app_1.default.close();
    await prisma_1.default.$disconnect();
    process.exit(0);
});
