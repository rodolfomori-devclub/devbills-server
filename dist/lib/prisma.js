"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Exporta uma instância do PrismaClient para ser usada em toda a aplicação
const prisma = new client_1.PrismaClient({
    // Configurações adicionais para maior estabilidade
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
});
// Código de tratamento de erro global para o Prisma
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    }
    catch (error) {
        console.error(`Erro do Prisma em ${params.model}.${params.action}:`, error);
        throw error;
    }
});
// Verificar se a conexão está funcionando
async function testConnection() {
    try {
        await prisma.$connect();
        console.log('📦 Prisma conectado com sucesso ao banco de dados');
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}
// Iniciar a verificação de conexão
testConnection();
exports.default = prisma;
