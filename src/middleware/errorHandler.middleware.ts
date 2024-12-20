/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/HttpError';

export const errorHandler = (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    statusCode,
    message,
    error: err.isValidationError ? err.error : undefined,
  });
};
