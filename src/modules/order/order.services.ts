import HttpError from '../../utils/HttpError';
import { IFiltersDTO } from './dto/filters.dto';
import OrderDAL from './order.dal';

class OrderServices {
  async createOrder(orderData: { user_id: number; orderDetails: { product_id: number; quantity: number }[] }) {
    const { user_id, orderDetails } = orderData;
    const order = await OrderDAL.createOrder(user_id, orderDetails);
    return order;
  }

  async getAllOrders(filter: IFiltersDTO) {
    const { limit, skip } = filter;
    return await OrderDAL.getAllOrders(limit, skip);
  }

  async getOrdersByUserId(userId: number, limit?: number, skip?: number) {
    return await OrderDAL.getOrdersByUserId(userId, limit, skip);
  }

  async getOrderById(orderId: number, user: { id: string; roles: string[] }) {
    const order = await OrderDAL.getOrderById(orderId);
    if (!user.roles.includes('admin') && Number(user.id) === order.user_id) {
      throw new HttpError(401, 'Unauthorized to view the order');
    }
    return order;
  }

  async deleteOrder(orderId: number) {
    await OrderDAL.deleteOrder(orderId);
  }
}

export default new OrderServices();
