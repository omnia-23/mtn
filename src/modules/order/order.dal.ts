import { eq, inArray, sql } from 'drizzle-orm';
import db from '../../db/database';
import { orderDetailsTable, orderTable, productTable, userTable } from '../../db/models';
import HttpError from '../../utils/HttpError';

class OrderRepository {
  getAllOrders = async (limit = 10, skip = 0) => {
    const orders = await db
      .select({
        id: orderTable.id,
        total_price: orderTable.total_price,
        user: {
          id: userTable.id,
          username: userTable.username,
        },
        orderDetails: sql`
          json_agg(
            json_build_object('product_id', ${orderDetailsTable}.product_id,'product_name',${productTable.name} ,'quantity', ${orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
      })
      .from(orderTable)
      .leftJoin(orderDetailsTable, eq(orderDetailsTable.order_id, orderTable.id))
      .leftJoin(productTable, eq(productTable.id, orderDetailsTable.product_id))
      .innerJoin(userTable, eq(userTable.id, orderTable.user_id))
      .groupBy(orderTable.id, userTable.id)
      .limit(Number(limit))
      .offset(Number(skip));
    return orders;
  };

  async getOrdersByUserId(userId: number, limit = 10, skip = 0) {
    const orders = await db
      .select({
        id: orderTable.id,
        user_id: orderTable.user_id,
        total_price: orderTable.total_price,
        created_at: orderTable.createdAt,
        orderDetails: sql`
          json_agg(
            json_build_object('product_id', ${orderDetailsTable}.product_id,'product_name',${productTable.name} ,'quantity', ${orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
      })
      .from(orderTable)
      .where(eq(orderTable.user_id, userId))
      .leftJoin(orderDetailsTable, eq(orderDetailsTable.order_id, orderTable.id))
      .leftJoin(productTable, eq(productTable.id, orderDetailsTable.product_id))
      .groupBy(orderTable.id)
      .limit(Number(limit))
      .offset(Number(skip));
    return orders;
  }

  createOrder = async (user_id: number, orderDetails: { product_id: number; quantity: number }[]) => {
    return await db.transaction(async trx => {
      const productIds = orderDetails.map(detail => detail.product_id);
      const products = await trx.select().from(productTable).where(inArray(productTable.id, productIds));

      if (products.length !== productIds.length) {
        throw new HttpError(400, 'Some products in the order do not exist');
      }

      const productDataMap = products.reduce<Record<number, { price: number; stock: number }>>((map, product) => {
        map[product.id] = {
          price: parseFloat(product.price),
          stock: product.stock ?? 0,
        };
        return map;
      }, {});

      const total_price = orderDetails.reduce((total, detail) => {
        const productData = productDataMap[detail.product_id];
        if (!productData) {
          throw new HttpError(400, `Product with ID ${detail.product_id} not found`);
        }
        if (productData.stock < detail.quantity) {
          throw new HttpError(400, `Insufficient stock for product ID ${detail.product_id}`);
        }
        return total + productData.price * detail.quantity;
      }, 0);

      // Reduce the stock for each product
      for (const detail of orderDetails) {
        const productData = productDataMap[detail.product_id];
        if (!productData) continue;
        await trx
          .update(productTable)
          .set({ stock: productData.stock - detail.quantity })
          .where(eq(productTable.id, detail.product_id));
      }

      const [order] = await trx
        .insert(orderTable)
        .values({
          user_id,
          total_price: total_price.toFixed(2),
        })
        .returning();

      if (!order) {
        throw new HttpError(400, 'Order creation failed');
      }

      await trx.insert(orderDetailsTable).values(
        orderDetails.map(detail => ({
          order_id: order.id,
          product_id: detail.product_id,
          quantity: detail.quantity,
        })),
      );

      const orderWithDetails = await trx
        .select({
          id: orderTable.id,
          user_id: orderTable.user_id,
          total_price: orderTable.total_price,
          created_at: orderTable.createdAt,
          orderDetails: sql`
          json_agg(
            json_build_object('product_id', ${orderDetailsTable}.product_id, 'quantity', ${orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
        })
        .from(orderTable)
        .where(eq(orderTable.id, order.id))
        .leftJoin(orderDetailsTable, eq(orderDetailsTable.order_id, order.id))
        .groupBy(orderTable.id);

      return orderWithDetails;
    });
  };

  getOrderById = async (orderId: number) => {
    const order = await db
      .select({
        id: orderTable.id,
        user_id: orderTable.user_id,
        total_price: orderTable.total_price,
        created_at: orderTable.createdAt,
        orderDetails: sql`
          json_agg(
            json_build_object('product_id', ${orderDetailsTable}.product_id,'product_name',${productTable.name} ,'quantity', ${orderDetailsTable}.quantity)
          ) AS orderDetails
        `,
      })
      .from(orderTable)
      .where(eq(orderTable.id, orderId))
      .leftJoin(orderDetailsTable, eq(orderDetailsTable.order_id, orderTable.id))
      .leftJoin(productTable, eq(productTable.id, orderDetailsTable.product_id))
      .groupBy(orderTable.id);
    return order[0];
  };

  deleteOrder = async (orderId: number) => {
    const order = await db.delete(orderTable).where(eq(orderTable.id, orderId));
    if (!order[0]) {
      throw new HttpError(400, 'Order not found ');
    }
  };
}
export default new OrderRepository();
