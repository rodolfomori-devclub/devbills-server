// src/config/firebase.ts
import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  if (admin.apps.length > 0) return;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("❌ Firebase credentials missing");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
    console.log("🔥 Firebase Admin initialized");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;