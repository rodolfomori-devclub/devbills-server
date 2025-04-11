import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Estender o tipo Request para incluir userId (didático e seguro)
interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Retorna dados estatísticos do usuário autenticado
 */
export const getUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const transactionsCount = await prisma.transaction.count({ where: { userId } });

    return res.json({
      message: 'Informações do usuário',
      userId,
      statistics: {
        transactionsCount
      }
    });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
};

/**
 * Registra o primeiro acesso do usuário autenticado
 */
export const registerFirstAccess = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  // Aqui poderia criar um registro em banco, por enquanto só responde
  return res.json({
    message: 'Primeiro acesso registrado com sucesso',
    userId
  });
};
