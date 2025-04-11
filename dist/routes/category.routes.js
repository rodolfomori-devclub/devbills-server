"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de categorias requerem autenticação
router.use(auth_middleware_1.authMiddleware);
// Rotas de categorias
router.post('/', category_controller_1.createCategory);
router.get('/', category_controller_1.getCategories);
router.put('/:id', category_controller_1.updateCategory);
router.delete('/:id', category_controller_1.deleteCategory);
exports.default = router;
