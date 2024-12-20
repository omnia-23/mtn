"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrdersHandler = exports.getAllOrderHandler = exports.viewOrder = exports.deleteOrderHandler = exports.placeOrderHandler = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const order_service_1 = __importDefault(require("./order.service"));
exports.placeOrderHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;
    const order = await order_service_1.default.createOrder({ user_id, ...data });
    res.status(200).json(order);
}, 'Failed to create order');
exports.deleteOrderHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await order_service_1.default.deleteOrder(Number(id));
    res.status(204).json();
}, 'Failed to delete order');
exports.viewOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const order = await order_service_1.default.getOrderById(Number(id), user);
    res.status(200).json(order);
}, 'Failed to get order');
exports.getAllOrderHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filer = req.query;
    const orders = await order_service_1.default.getAllOrders(filer);
    res.status(200).json(orders);
}, 'Failed to get orders');
exports.getUserOrdersHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { limit, skip } = req.query;
    const orders = await order_service_1.default.getOrdersByUserId(Number(userId), limit, skip);
    res.status(200).json(orders);
}, 'Failed to get orders');
