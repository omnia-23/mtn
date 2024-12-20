import { Response } from 'express';
import { AuthenticatedRequest } from '../../@types/express';
import { asyncHandler } from '../../utils/asyncHandler';
import OrderService from './order.services';
import { IFiltersDTO } from './dto/filters.dto';

export const placeOrderHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user.id;
  const data = req.body;
  const order = await OrderService.createOrder({ user_id, ...data });
  res.status(200).json(order);
}, 'Failed to create order');

export const deleteOrderHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  await OrderService.deleteOrder(Number(id));
  res.status(204).json();
}, 'Failed to delete order');

export const viewOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const order = await OrderService.getOrderById(Number(id), user);
  res.status(200).json(order);
}, 'Failed to get order');

export const getAllOrderHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filer = req.query;
  const orders = await OrderService.getAllOrders(filer);
  res.status(200).json(orders);
}, 'Failed to get orders');

export const getUserOrdersHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const { limit, skip } = req.query as IFiltersDTO;
  const orders = await OrderService.getOrdersByUserId(Number(userId), limit, skip);
  res.status(200).json(orders);
}, 'Failed to get orders');
