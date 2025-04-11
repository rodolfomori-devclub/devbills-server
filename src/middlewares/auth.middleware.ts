import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Estendendo a interface Request para incluir o userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid; // Armazenando o ID do usuário para uso posterior
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};