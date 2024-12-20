import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../../@types/express';
import UserServices from './user.service';
import { asyncHandler } from '../../utils/asyncHandler';

export const getUsersHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filters = req.query;
  const users = await UserServices.getAllUser(filters);
  res.status(200).json(users);
}, 'Failed to get users');

export const createUserHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const users = await UserServices.createUser(data);
  res.status(200).json(users);
}, 'Failed to create user');

export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const users = await UserServices.updateUser(Number(id), data);
  res.status(200).json(users);
}, 'Failed to update user');

export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await UserServices.deleteUser(Number(id));
  res.status(204).json();
}, 'Failed to delete user');
