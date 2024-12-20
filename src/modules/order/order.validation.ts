import { body, param, query } from 'express-validator';
import { handleValidationErrors, strict } from '../../utils/base.validators';

export const placeOrderValidation = [
  body('orderDetails').isArray({ min: 1 }).withMessage('Order details must be an array with at least one item'),
  body('orderDetails.*.product_id').isInt({ min: 1 }).withMessage('Each product_id must be a positive integer'),
  body('orderDetails.*.quantity').isInt({ min: 1 }).withMessage('Each quantity must be a positive integer'),
  handleValidationErrors,
  strict,
];

export const paramsValidation = [
  param('id').isInt({ min: 1 }).withMessage('Order ID must be a positive integer'),
  handleValidationErrors,
];

export const filterValid = [
  query('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
  query('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
  handleValidationErrors,
  strict,
];
