import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { CreateCategoryDTO, TransactionType, UpdateCategoryDTO } from '../types/transaction.types';

export const createCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { name, color, icon, type } = req.body as CreateCategoryDTO;

    // Validações básicas
    if (!name || !color || !icon || !type) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o tipo é válido
    if (!Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ error: 'Tipo de transação inválido' });
    }

    try {
      // Criar a categoria usando o Prisma
      const newCategory = await prisma.category.create({
        data: {
          name,
          color,
          icon,
          type,
          userId
        }
      });

      return res.status(201).json(newCategory);
    } catch (error: any) {
      // Verificar se é um erro de unicidade (categoria com mesmo nome e tipo já existe)
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Já existe uma categoria com este nome e tipo' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

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

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    
    return res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { name, color, icon } = req.body as UpdateCategoryDTO;

    // Validações básicas
    if (!name && !color && !icon) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: { id, userId }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Preparar dados para atualização
    const updateData: UpdateCategoryDTO = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (icon) updateData.icon = icon;

    try {
      // Atualizar a categoria
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updateData
      });
      
      return res.json(updatedCategory);
    } catch (error: any) {
      // Verificar se é um erro de unicidade (nome já existe)
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Já existe uma categoria com este nome e tipo' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: { id, userId }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Verificar se existem transações associadas a esta categoria
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id }
    });

    if (transactionCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir esta categoria pois existem transações associadas a ela' 
      });
    }

    // Excluir a categoria
    await prisma.category.delete({
      where: { id }
    });
    
    return res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
};