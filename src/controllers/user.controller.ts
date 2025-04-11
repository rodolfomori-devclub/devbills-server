import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { createDefaultCategories } from '../services/defaultCategories.service';

export const initializeUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Verificar se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: { userId }
    });

    console.log(`Usuário ${userId} tem ${existingCategories.length} categorias existentes.`);

    if (existingCategories.length > 0) {
      return res.json({
        message: 'Usuário já inicializado',
        userId,
        categoriesCount: existingCategories.length
      });
    }

    // Criar categorias padrão usando o serviço
    const createdCategories = await createDefaultCategories(userId);
    
    console.log(`Criadas ${createdCategories.length} categorias para o usuário ${userId}.`);

    return res.json({
      message: 'Usuário inicializado com sucesso',
      userId,
      categoriesCount: createdCategories.length
    });
  } catch (error) {
    console.error('Erro ao inicializar usuário:', error);
    return res.status(500).json({ error: 'Erro ao inicializar usuário' });
  }
};