"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = __importDefault(require("../../db/database"));
const models_1 = require("../../db/models");
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
class OrderRepository {
    constructor() {
        this.getAllOrders = async (limit = 10, skip = 0) => {
            const orders = await database_1.default
                .select({
                id: models_1.orderTable.id,
                total_price: models_1.orderTable.total_price,
                user: {
                    id: models_1.userTable.id,
                    username: models_1.userTable.username,
                },
                orderDetails: (0, drizzle_orm_1.sql) `
          json_agg(
            json_build_object('product_id', ${models_1.orderDetailsTable}.product_id,'product_name',${models_1.productTable.name} ,'quantity', ${models_1.orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
            })
                .from(models_1.orderTable)
                .leftJoin(models_1.orderDetailsTable, (0, drizzle_orm_1.eq)(models_1.orderDetailsTable.order_id, models_1.orderTable.id))
                .leftJoin(models_1.productTable, (0, drizzle_orm_1.eq)(models_1.productTable.id, models_1.orderDetailsTable.product_id))
                .innerJoin(models_1.userTable, (0, drizzle_orm_1.eq)(models_1.userTable.id, models_1.orderTable.user_id))
                .groupBy(models_1.orderTable.id, models_1.userTable.id)
                .limit(Number(limit))
                .offset(Number(skip));
            return orders;
        };
        this.createOrder = async (user_id, orderDetails) => {
            return await database_1.default.transaction(async (trx) => {
                const productIds = orderDetails.map(detail => detail.product_id);
                const products = await trx.select().from(models_1.productTable).where((0, drizzle_orm_1.inArray)(models_1.productTable.id, productIds));
                if (products.length !== productIds.length) {
                    throw new HttpError_1.default(400, 'Some products in the order do not exist');
                }
                const productDataMap = products.reduce((map, product) => {
                    map[product.id] = {
                        price: parseFloat(product.price),
                        stock: product.stock ?? 0,
                    };
                    return map;
                }, {});
                const total_price = orderDetails.reduce((total, detail) => {
                    const productData = productDataMap[detail.product_id];
                    if (!productData) {
                        throw new HttpError_1.default(400, `Product with ID ${detail.product_id} not found`);
                    }
                    if (productData.stock < detail.quantity) {
                        throw new HttpError_1.default(400, `Insufficient stock for product ID ${detail.product_id}`);
                    }
                    return total + productData.price * detail.quantity;
                }, 0);
                // Reduce the stock for each product
                for (const detail of orderDetails) {
                    const productData = productDataMap[detail.product_id];
                    if (!productData)
                        continue;
                    await trx
                        .update(models_1.productTable)
                        .set({ stock: productData.stock - detail.quantity })
                        .where((0, drizzle_orm_1.eq)(models_1.productTable.id, detail.product_id));
                }
                const [order] = await trx
                    .insert(models_1.orderTable)
                    .values({
                    user_id,
                    total_price: total_price.toFixed(2),
                })
                    .returning();
                if (!order) {
                    throw new HttpError_1.default(400, 'Order creation failed');
                }
                await trx.insert(models_1.orderDetailsTable).values(orderDetails.map(detail => ({
                    order_id: order.id,
                    product_id: detail.product_id,
                    quantity: detail.quantity,
                })));
                const orderWithDetails = await trx
                    .select({
                    id: models_1.orderTable.id,
                    user_id: models_1.orderTable.user_id,
                    total_price: models_1.orderTable.total_price,
                    created_at: models_1.orderTable.createdAt,
                    orderDetails: (0, drizzle_orm_1.sql) `
          json_agg(
            json_build_object('product_id', ${models_1.orderDetailsTable}.product_id, 'quantity', ${models_1.orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
                })
                    .from(models_1.orderTable)
                    .where((0, drizzle_orm_1.eq)(models_1.orderTable.id, order.id))
                    .leftJoin(models_1.orderDetailsTable, (0, drizzle_orm_1.eq)(models_1.orderDetailsTable.order_id, order.id))
                    .groupBy(models_1.orderTable.id);
                return orderWithDetails;
            });
        };
        this.getOrderById = async (orderId) => {
            const order = await database_1.default
                .select({
                id: models_1.orderTable.id,
                user_id: models_1.orderTable.user_id,
                total_price: models_1.orderTable.total_price,
                created_at: models_1.orderTable.createdAt,
                orderDetails: (0, drizzle_orm_1.sql) `
          json_agg(
            json_build_object('product_id', ${models_1.orderDetailsTable}.product_id,'product_name',${models_1.productTable.name} ,'quantity', ${models_1.orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
            })
                .from(models_1.orderTable)
                .where((0, drizzle_orm_1.eq)(models_1.orderTable.id, orderId))
                .leftJoin(models_1.orderDetailsTable, (0, drizzle_orm_1.eq)(models_1.orderDetailsTable.order_id, models_1.orderTable.id))
                .leftJoin(models_1.productTable, (0, drizzle_orm_1.eq)(models_1.productTable.id, models_1.orderDetailsTable.product_id))
                .groupBy(models_1.orderTable.id);
            return order[0];
        };
        this.deleteOrder = async (orderId) => {
            const order = await database_1.default.delete(models_1.orderTable).where((0, drizzle_orm_1.eq)(models_1.orderTable.id, orderId));
            if (!order[0]) {
                throw new HttpError_1.default(400, 'Order not found ');
            }
        };
    }
    async getOrdersByUserId(userId, limit = 10, skip = 0) {
        const orders = await database_1.default
            .select({
            id: models_1.orderTable.id,
            user_id: models_1.orderTable.user_id,
            total_price: models_1.orderTable.total_price,
            created_at: models_1.orderTable.createdAt,
            orderDetails: (0, drizzle_orm_1.sql) `
          json_agg(
            json_build_object('product_id', ${models_1.orderDetailsTable}.product_id,'product_name',${models_1.productTable.name} ,'quantity', ${models_1.orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
        })
            .from(models_1.orderTable)
            .where((0, drizzle_orm_1.eq)(models_1.orderTable.user_id, userId))
            .leftJoin(models_1.orderDetailsTable, (0, drizzle_orm_1.eq)(models_1.orderDetailsTable.order_id, models_1.orderTable.id))
            .leftJoin(models_1.productTable, (0, drizzle_orm_1.eq)(models_1.productTable.id, models_1.orderDetailsTable.product_id))
            .groupBy(models_1.orderTable.id)
            .limit(Number(limit))
            .offset(Number(skip));
        return orders;
    }
}
exports.default = new OrderRepository();
