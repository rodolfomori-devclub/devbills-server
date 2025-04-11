"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de categorias requerem autenticação
router.use(auth_middleware_1.authMiddleware);
// Somente a rota para listar categorias é mantida
router.get('/', category_controller_1.getCategories);
exports.default = router;
