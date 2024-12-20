import { body, param, query } from 'express-validator';
import { strict, handleValidationErrors } from '../../utils/base.validators';

export const createProductValidation = [
  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number')
    .notEmpty()
    .withMessage('Price is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors,
];

export const updateProductValidation = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('price').optional().isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidationErrors,
];

export const filterValid = [
  query('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
  query('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
  handleValidationErrors,
  strict,
];

export const deleteProductValidation = [
  param('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  handleValidationErrors,
];
