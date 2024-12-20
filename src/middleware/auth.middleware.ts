import { RequestHandler } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../@types/express';
import HttpError from '../utils/HttpError';
import { getConfig } from 'dotenv-handler';

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = (req as AuthenticatedRequest).headers.authorization;
  if (!authHeader) return next(new HttpError(401, 'unauthorized'));

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new HttpError(401, 'Unauthorized: Token missing'));
  }
  try {
    const secretKey = getConfig('SECRET_KEY')!;
    const payload = jwt.verify(token, secretKey) as { id: string; roles: string[] };
    (req as AuthenticatedRequest).user = { id: payload.id, roles: payload.roles };
    next();
  } catch (error: unknown | TokenExpiredError) {
    if (error instanceof TokenExpiredError) return next(new HttpError(401, 'session ended'));
    return next(new HttpError(403, 'Forbidden'));
  }
};

export const authorize = (requiredRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    const userRoles = (req as AuthenticatedRequest).user?.roles;
    if (!userRoles || !userRoles.some(role => requiredRoles.includes(role))) {
      return next(new HttpError(403, 'Forbidden'));
    }
    next();
  };
};
