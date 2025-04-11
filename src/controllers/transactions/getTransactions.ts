import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { TransactionType } from '@prisma/client';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

export const getTransactions = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const { month, year, type, categoryId } = req.query as {
    month?: string;
    year?: string;
    type?: TransactionType;
    categoryId?: string;
  };

  const filters: any = { userId };

  if (month && year) {
    const start = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const end = dayjs(`${year}-${month}-01`).endOf('month').toDate();
    filters.date = { gte: start, lte: end };
  }

  if (type && Object.values(TransactionType).includes(type)) {
    filters.type = type;
  }

  if (categoryId && ObjectId.isValid(categoryId)) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { name: true, color: true, type: true }
        }
      }
    });

    return res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ error: 'Erro ao buscar transações' });
  }
};