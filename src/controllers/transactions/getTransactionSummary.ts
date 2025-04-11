import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { TransactionSummary, CategorySummary } from '../../types';
import { TransactionType } from '@prisma/client';

import dayjs from 'dayjs';

export const getTransactionSummary = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const { month, year } = req.query as { month?: string; year?: string };

  if (!month || !year) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }

  const start = dayjs(`${year}-${month}-01`).startOf('month').toDate();
  const end = dayjs(`${year}-${month}-01`).endOf('month').toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lte: end }
      },
      include: { category: true }
    });

    let totalExpenses = 0;
    let totalIncomes = 0;
    const grouped = new Map<string, CategorySummary>();

    for (const t of transactions) {
      if (t.type === TransactionType.expense) {
        totalExpenses += t.amount;

        const existing = grouped.get(t.categoryId) ?? {
          categoryId: t.category.id,
          categoryName: t.category.name,
          categoryColor: t.category.color,
          amount: 0,
          percentage: 0
        };

        existing.amount += t.amount;
        grouped.set(t.categoryId, existing);
      } else {
        totalIncomes += t.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncomes,
      balance: totalIncomes - totalExpenses,
      expensesByCategory: Array.from(grouped.values()).map(e => ({
        ...e,
        percentage: parseFloat(((e.amount / totalExpenses) * 100).toFixed(2))
      })).sort((a, b) => b.amount - a.amount)
    };

    return res.json(summary);
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    return res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
};