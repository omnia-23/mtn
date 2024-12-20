"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.updateUserHandler = exports.createUserHandler = exports.getUsersHandler = void 0;
const user_service_1 = __importDefault(require("./user.service"));
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.getUsersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = req.query;
    const users = await user_service_1.default.getAllUser(filters);
    res.status(200).json(users);
}, 'Failed to get users');
exports.createUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const users = await user_service_1.default.createUser(data);
    res.status(200).json(users);
}, 'Failed to create user');
exports.updateUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const users = await user_service_1.default.updateUser(Number(id), data);
    res.status(200).json(users);
}, 'Failed to update user');
exports.deleteUserHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await user_service_1.default.deleteUser(Number(id));
    res.status(204).json();
}, 'Failed to delete user');
