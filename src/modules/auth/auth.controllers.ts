import { Request, Response } from 'express';
import AuthServices from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { IAuthInputDTO } from './dto/auth-input';
import { IUserLoginDTO } from './dto/auth-login.dto';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user: IAuthInputDTO = req.body;
  console.log({ user });
  const result = await AuthServices.register(user);
  res.status(201).json(result);
}, 'Failed to register');

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user: IUserLoginDTO = req.body;
  const result = await AuthServices.login(user);
  res.status(200).json(result);
}, 'Failed to login');
