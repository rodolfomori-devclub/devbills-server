import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Função para validar um ObjectId
const isValidObjectId = (id: string) => ObjectId.isValid(id);

// 📌 Schema para criação de transação
export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória."),
  amount: z.number().positive("Valor deve ser positivo."),
  date: z.coerce.date({
    errorMap: () => ({ message: "Data inválida." }),
  }),
  categoryId: z.string().refine(isValidObjectId, {
    message: "Categoria inválida.",
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    errorMap: () => ({ message: "Tipo inválido." }),
  }),
});

// 📌 Schema para listagem de transações
export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z.enum([TransactionType.expense, TransactionType.income]).optional(),
  categoryId: z.string().optional(),
  userId: z.string().optional(),
});

// 📌 Schema para resumo
export const getTransactionSummarySchema = z.object({
  month: z.string(),
  year: z.string(),
});

// 📌 Schema para exclusão de transação
export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "ID inválido.",
  }),
});

// 📌 Tipos inferidos para usar nos controllers
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type GetTransactionQuery = z.infer<typeof getTransactionsSchema>;
export type GetSummaryQuery = z.infer<typeof getTransactionSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
