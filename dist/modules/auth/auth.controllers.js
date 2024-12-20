"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.body;
    console.log({ user });
    const result = await auth_service_1.default.register(user);
    res.status(201).json(result);
}, 'Failed to register');
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.body;
    const result = await auth_service_1.default.login(user);
    res.status(200).json(result);
}, 'Failed to login');
