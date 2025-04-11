"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de usuário requerem autenticação
router.use(auth_middleware_1.authMiddleware);
// Rota para inicializar um novo usuário
router.post('/initialize', user_controller_1.initializeUser);
exports.default = router;
