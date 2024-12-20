"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAccessToken = void 0;
const dotenv_handler_1 = require("dotenv-handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const SECRET_KEY = (0, dotenv_handler_1.getConfig)('SECRET_KEY');
    return jsonwebtoken_1.default.sign({ id: user.userId, roles: user.roles }, SECRET_KEY, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
