"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// CORS configurado para ambiente
app.use((0, cors_1.default)());
// Middleware para JSON
app.use(express_1.default.json());
// Rotas principais
app.use('/api', routes_1.default);
exports.default = app;
