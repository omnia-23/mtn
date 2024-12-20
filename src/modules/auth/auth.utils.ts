import { getConfig } from 'dotenv-handler';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: { userId: number; roles: string[] }) => {
  const SECRET_KEY = getConfig('SECRET_KEY')!;
  return jwt.sign({ id: user.userId, roles: user.roles }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = <T>(token: string, secret: string) => {
  return jwt.verify(token, secret) as T;
};
