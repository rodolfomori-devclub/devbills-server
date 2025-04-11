"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
/**
 * Rotas protegidas do usuário
 */
router.use(auth_middleware_1.authMiddleware);
router.get('/info', user_controller_1.getUserInfo);
exports.default = router;
