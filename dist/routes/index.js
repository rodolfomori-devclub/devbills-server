"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_routes_1 = __importDefault(require("./category.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const router = (0, express_1.Router)();
// Rotas da API
router.use('/categories', category_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/users', user_routes_1.default);
// Rota para verificar se a API está funcionando
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DevBills API está funcionando!' });
});
exports.default = router;
