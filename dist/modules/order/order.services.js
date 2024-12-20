"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const order_dal_1 = __importDefault(require("./order.dal"));
class OrderServices {
    async createOrder(orderData) {
        const { user_id, orderDetails } = orderData;
        const order = await order_dal_1.default.createOrder(user_id, orderDetails);
        return order;
    }
    async getAllOrders(filter) {
        const { limit, skip } = filter;
        return await order_dal_1.default.getAllOrders(limit, skip);
    }
    async getOrdersByUserId(userId, limit, skip) {
        return await order_dal_1.default.getOrdersByUserId(userId, limit, skip);
    }
    async getOrderById(orderId, user) {
        const order = await order_dal_1.default.getOrderById(orderId);
        if (!user.roles.includes('admin') && Number(user.id) === order.user_id) {
            throw new HttpError_1.default(401, 'Unauthorized to view the order');
        }
        return order;
    }
    async deleteOrder(orderId) {
        await order_dal_1.default.deleteOrder(orderId);
    }
}
exports.default = new OrderServices();
