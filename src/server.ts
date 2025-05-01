// src/server.ts
import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import prisma from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";

const PORT = env.PORT;

// Inicializa serviços externos
initializeFirebaseAdmin(); // Firebase Admin SDK

const startServer = async () => {
  try {
    // Conexão com banco de dados
    await prisma.$connect();
    console.log("📦 Conectado ao banco de dados");

    // Categorias padrão da aplicação
    await initializeGlobalCategories();
    console.log("🏷️ Categorias globais carregadas");

    // Inicia o servidor
    await app.listen({ port: PORT });
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  } catch (error) {
    app.log.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1); // Encerra o processo com erro
  }
};

// Executa o servidor
startServer();

// Finalização elegante ao interromper
process.on("SIGINT", async () => {
  console.log("⛔ Encerrando servidor...");
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
});
