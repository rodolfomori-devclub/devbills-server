// src/config/firebase.ts
import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  try {
    // Verificar se o Firebase já foi inicializado
    if (admin.apps.length === 0) {
      // Se estiver usando variáveis de ambiente
      if (env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY,
          }),
        });
      } else {
        // Para desenvolvimento local, você pode usar um arquivo de credenciais
        // Este arquivo NÃO deve ser commitado no repositório
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
      console.log("🔥 Firebase Admin initialized");
    }
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;
