"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const order_dal_1 = __importDefault(require("./order.dal"));
/**
 * Service class for handling orders, including creating, retrieving, and deleting orders.
 * Provides methods for managing orders and ensuring proper authorization.
 */
class OrderServices {
    /**
     * Creates a new order for a user.
     * This method handles the order creation process by passing the user ID and order details
     * to the Data Access Layer (DAL).
     *
     * @param {Object} orderData - The order data.
     * @param {number} orderData.user_id - The ID of the user placing the order.
     * @param {Array<{ product_id: number, quantity: number }>} orderData.orderDetails - The list of products and quantities in the order.
     * @returns {Promise<any>} - The created order object.
     */
    async createOrder(orderData) {
        const { user_id, orderDetails } = orderData;
        const order = await order_dal_1.default.createOrder(user_id, orderDetails);
        return order;
    }
    /**
     * Retrieves all orders with optional filtering.
     * This method allows fetching orders with pagination using `limit` and `skip` values.
     *
     * @param {IFiltersDTO} filter - The filter parameters for pagination.
     * @param {number} filter.limit - The maximum number of orders to fetch.
     * @param {number} filter.skip - The number of orders to skip for pagination.
     * @returns {Promise<any>} - A list of orders matching the filter criteria.
     */
    async getAllOrders(filter) {
        const { limit, skip } = filter;
        return await order_dal_1.default.getAllOrders(limit, skip);
    }
    /**
     * Retrieves orders for a specific user by user ID.
     * This method fetches orders for the given user with optional pagination.
     *
     * @param {number} userId - The ID of the user whose orders are to be fetched.
     * @param {number} [limit] - The maximum number of orders to fetch.
     * @param {number} [skip] - The number of orders to skip for pagination.
     * @returns {Promise<any>} - A list of orders for the specified user.
     */
    async getOrdersByUserId(userId, limit, skip) {
        return await order_dal_1.default.getOrdersByUserId(userId, limit, skip);
    }
    /**
     * Retrieves an order by its ID, with authorization checks based on the user's roles.
     * This method ensures that only admins or the user who placed the order can access it.
     *
     * @param {number} orderId - The ID of the order to fetch.
     * @param {Object} user - The user making the request.
     * @param {string} user.id - The ID of the requesting user.
     * @param {string[]} user.roles - The roles of the requesting user (e.g., "admin").
     * @returns {Promise<any>} - The order details if the user is authorized.
     * @throws {HttpError} - Throws a 401 error if the user is unauthorized to view the order.
     */
    async getOrderById(orderId, user) {
        const order = await order_dal_1.default.getOrderById(orderId);
        // Ensure the user is authorized to view the order
        if (!user.roles.includes('admin') && Number(user.id) !== order.user_id) {
            throw new HttpError_1.default(401, 'Unauthorized to view the order');
        }
        return order;
    }
    /**
     * Deletes an order by its ID.
     * This method allows an order to be deleted from the system by passing the order ID to the Data Access Layer (DAL).
     *
     * @param {number} orderId - The ID of the order to delete.
     * @returns {Promise<void>} - A promise indicating the deletion has occurred.
     */
    async deleteOrder(orderId) {
        await order_dal_1.default.deleteOrder(orderId);
    }
}
// Export the service to be used in other parts of the application
exports.default = new OrderServices();
