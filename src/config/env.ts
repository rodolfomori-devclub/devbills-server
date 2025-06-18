import dotenv from "dotenv";
// src/config/env.ts
import { z } from "zod";

// Carrega variáveis de ambiente do .env
dotenv.config();

// Define o esquema de validação das variáveis de ambiente
const envSchema = z.object({
  // Variáveis básicas da aplicação
  PORT: z.string().transform(Number).default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),

  // Variáveis do Firebase
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
});

// Tenta validar as variáveis de ambiente
const _env = envSchema.safeParse(process.env);

// Se a validação falhar, mostra os erros e encerra a aplicação
if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas:", _env.error.format());
  process.exit(1);
}

// Exporta as variáveis tipadas e validadas
export const env = _env.data;
