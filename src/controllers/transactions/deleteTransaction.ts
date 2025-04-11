import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { ObjectId } from 'mongodb';

export const deleteTransaction = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await prisma.transaction.delete({ where: { id } });
    return res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: 'Erro ao excluir transação' });
  }
};