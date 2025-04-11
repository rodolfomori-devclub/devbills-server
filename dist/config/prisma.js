"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPrisma = void 0;
// src/config/prisma.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
});
const connectPrisma = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conectado ao banco com sucesso.');
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        process.exit(1);
    }
};
exports.connectPrisma = connectPrisma;
exports.default = prisma;
