import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// CORS configurado para ambiente
app.use(cors());

// Middleware para JSON
app.use(express.json());

// Rotas principais
app.use('/api', routes);

export default app;
