"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Para desenvolvimento local, você pode usar um arquivo de credenciais
// Para produção, use variáveis de ambiente
const initializeFirebaseAdmin = () => {
    try {
        // Verificar se o Firebase já foi inicializado
        if (firebase_admin_1.default.apps.length === 0) {
            // Se estiver usando variáveis de ambiente
            if (process.env.FIREBASE_PROJECT_ID) {
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY,
                    }),
                });
            }
            else {
                // Para desenvolvimento local, você pode usar um arquivo de credenciais
                // Este arquivo NÃO deve ser commitado no repositório
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.applicationDefault(),
                });
            }
            console.log("🔥 Firebase Admin initialized");
        }
    }
    catch (error) {
        console.error("❌ Firebase Admin initialization error:", error);
        process.exit(1);
    }
};
exports.default = initializeFirebaseAdmin;
