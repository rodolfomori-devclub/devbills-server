import { Request, Response } from 'express';
import prisma from '../config/prisma';


export const getCategories = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};