import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { TransactionType } from '../types/transaction.types';

// Método para listar categorias
export const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Filtrar por tipo, se fornecido
    const { type } = req.query;
    const whereClause: any = { userId };
    
    if (type && Object.values(TransactionType).includes(type as TransactionType)) {
      whereClause.type = type;
    }

    // Buscar as categorias
    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    
    // Log para depuração
    console.log(`Categorias encontradas para o usuário ${userId}:`, 
      categories.map(c => ({ id: c.id, name: c.name, type: c.type }))
    );
    
    // Se não houver categorias, criar categorias padrão
    if (categories.length === 0) {
      console.log(`Usuário ${userId} não tem categorias. Enviando resposta vazia.`);
    }

    return res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};