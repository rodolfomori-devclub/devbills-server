"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/category.routes.ts
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
/**
 * Rota pública para listar categorias globais
 */
router.get('/', category_controller_1.getCategories);
exports.default = router;
