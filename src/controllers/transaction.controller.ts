import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { ObjectId } from 'mongodb';
import { 
  TransactionType, 
  TransactionSummary, 
  ICategorySummary,
  CreateTransactionDTO
} from '../types/transaction.types';

// Interface para tipos de erro do Prisma
interface PrismaError {
  code?: string;
  meta?: Record<string, any>;
  message?: string;
}

export const createTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Log para depuração
    console.log('Dados recebidos:', req.body);

    const { description, amount, date, categoryId, type } = req.body as CreateTransactionDTO;

    // Validações detalhadas
    if (!description) {
      return res.status(400).json({ error: 'A descrição é obrigatória' });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'O valor é obrigatório' });
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'O valor deve ser um número maior que zero' });
    }

    if (!date) {
      return res.status(400).json({ error: 'A data é obrigatória' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'A categoria é obrigatória' });
    }

    if (!type) {
      return res.status(400).json({ error: 'O tipo de transação é obrigatório' });
    }

    // Verificar se o tipo é válido
    if (!Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ error: 'Tipo de transação inválido' });
    }

    // Validar se o categoryId é um ObjectId válido
    if (!ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'ID de categoria inválido' });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({ 
      where: {
        id: categoryId,
        userId,
        type // Garantir que o tipo da categoria corresponda ao tipo da transação
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada ou incompatível com o tipo de transação' });
    }

    // Converter a data
    let transactionDate: Date;
    try {
      transactionDate = new Date(date);
      if (isNaN(transactionDate.getTime())) {
        throw new Error('Data inválida');
      }
    } catch (error) {
      return res.status(400).json({ error: 'Formato de data inválido' });
    }

    // Criar a transação
    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: Number(amount),
        date: transactionDate,
        type,
        userId,
        categoryId
      },
      include: {
        category: true
      }
    });

    return res.status(201).json(newTransaction);
  } catch (error: unknown) {
    console.error('Erro ao criar transação:', error);
    
    // Verificar se o erro é do Prisma com o tipo correto
    const prismaError = error as PrismaError;
    
    // Retornar mensagens de erro mais específicas se possível
    if (prismaError && prismaError.code === 'P2003') {
      return res.status(400).json({ error: 'A categoria selecionada não existe' });
    }
    
    if (prismaError && prismaError.code === 'P2025') {
      return res.status(400).json({ error: 'Registro relacionado não encontrado' });
    }
    
    return res.status(500).json({ error: 'Erro ao criar transação. Por favor, tente novamente.' });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Filtros opcionais
    const { month, year, type, categoryId } = req.query;
    
    const whereClause: any = { userId };
    
    // Filtrar por mês e ano, se fornecidos
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
      
      whereClause.date = { 
        gte: startDate, 
        lte: endDate 
      };
    }
    
    // Filtrar por tipo, se fornecido
    if (type && Object.values(TransactionType).includes(type as TransactionType)) {
      whereClause.type = type;
    }
    
    // Filtrar por categoria, se fornecida
    if (categoryId && ObjectId.isValid(categoryId as string)) {
      whereClause.categoryId = categoryId;
    }

    // Buscar as transações com informações da categoria
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: {
            name: true,
            color: true, 
            icon: true,
            type: true
          }
        }
      }
    });
    
    return res.json(transactions);
  } catch (error: unknown) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ error: 'Erro ao buscar transações' });
  }
};

export const getTransactionSummary = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Filtrar por mês e ano
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
    }
    
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    
    // Buscar todas as transações do período
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { 
          gte: startDate, 
          lte: endDate 
        }
      },
      include: {
        category: true
      }
    });
    
    // Calcular total de despesas e receitas
    let totalExpenses = 0;
    let totalIncomes = 0;
    
    // Agrupar despesas por categoria
    const expensesByCategory = new Map<string, { amount: number, category: { id: string, name: string, color: string } }>();
    
    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        totalExpenses += transaction.amount;
        
        // Adicionar à soma da categoria
        const categoryKey = transaction.categoryId;
        const currentAmount = expensesByCategory.get(categoryKey)?.amount || 0;
        
        expensesByCategory.set(categoryKey, {
          amount: currentAmount + transaction.amount,
          category: {
            id: transaction.category.id,
            name: transaction.category.name,
            color: transaction.category.color
          }
        });
      } else {
        totalIncomes += transaction.amount;
      }
    }
    
    // Preparar o resumo por categoria
    const expensesWithCategories: ICategorySummary[] = [];
    
    for (const [categoryId, data] of expensesByCategory.entries()) {
      const amount = data.amount;
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      expensesWithCategories.push({
        categoryId,
        categoryName: data.category.name,
        categoryColor: data.category.color,
        amount,
        percentage: parseFloat(percentage.toFixed(2))
      });
    }
    
    // Ordenar por valor (do maior para o menor)
    expensesWithCategories.sort((a, b) => b.amount - a.amount);
    
    const summary: TransactionSummary = {
      totalExpenses,
      totalIncomes,
      balance: totalIncomes - totalExpenses,
      expensesByCategory: expensesWithCategories
    };
    
    return res.json(summary);
  } catch (error: unknown) {
    console.error('Erro ao buscar resumo de transações:', error);
    return res.status(500).json({ error: 'Erro ao buscar resumo de transações' });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Validar se o ID é um ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de transação inválido' });
    }

    // Verificar se a transação existe e pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Excluir a transação
    await prisma.transaction.delete({
      where: { id }
    });
    
    return res.json({ message: 'Transação excluída com sucesso' });
  } catch (error: unknown) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: 'Erro ao excluir transação' });
  }
};