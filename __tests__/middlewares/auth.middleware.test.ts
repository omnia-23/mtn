import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { getConfig } from 'dotenv-handler';
import HttpError from '../../src/utils/HttpError';
import { AuthenticatedRequest } from '../../src/@types/express';

jest.mock('jsonwebtoken');
jest.mock('dotenv-handler');

describe('authenticate middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should return 401 if no authorization header is provided', () => {
    req.headers = {};
    authenticate(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new HttpError(401, 'unauthorized'));
  });

  it('should return 401 if token is missing', () => {
    req.headers = { authorization: 'Bearer ' };
    authenticate(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(new HttpError(401, 'Unauthorized: Token missing'));
  });

  it('should verify token and attach user to request', () => {
    const token = 'validToken';
    const secretKey = 'secretKey';
    const mockPayload = { id: '1', roles: ['admin'] };

    // Mock JWT verification
    jwt.verify = jest.fn().mockReturnValue(mockPayload);
    (getConfig as jest.Mock).mockReturnValue(secretKey);

    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
    expect(req.user).toEqual({ id: '1', roles: ['admin'] });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is expired', () => {
    const token = 'expiredToken';
    const secretKey = 'secretKey';

    // Mock JWT verification to throw a TokenExpiredError
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });
    (getConfig as jest.Mock).mockReturnValue(secretKey);

    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new HttpError(401, 'session ended'));
  });

  it('should return 403 if token is invalid', () => {
    const token = 'invalidToken';
    const secretKey = 'secretKey';

    jwt.verify = jest.fn().mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });
    (getConfig as jest.Mock).mockReturnValue(secretKey);

    req.headers = { authorization: `Bearer ${token}` };

    authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new HttpError(403, 'Forbidden'));
  });
});

describe('authorize middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should return 403 if user does not have the required role', () => {
    req.user = { id: '1', roles: ['user'] };
    const requiredRoles = ['admin'];

    authorize(requiredRoles)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new HttpError(403, 'Forbidden'));
  });

  it('should allow access if user has the required role', () => {
    req.user = { id: '1', roles: ['admin'] };
    const requiredRoles = ['admin'];

    authorize(requiredRoles)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should allow access if user has at least one required role', () => {
    req.user = { id: '1', roles: ['user', 'admin'] };
    const requiredRoles = ['admin'];
    authorize(requiredRoles)(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
