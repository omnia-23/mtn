import { body, param, query } from 'express-validator';
import { strict, handleValidationErrors } from '../../utils/base.validators';

export const createUserVal = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
    ),
  body('roles').isArray().withMessage('Roles must be an array'),
  body('roles.*').isInt().withMessage('Roles must be an array int'),
  handleValidationErrors,
  strict,
];

export const filterValid = [
  query('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
  query('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
  handleValidationErrors,
  strict,
];

export const updateUserVal = [
  param('id').isInt().withMessage('id must be int'),
  body('email').isEmail().withMessage('Invalid email address').optional(),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').optional(),
  body('password')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
    )
    .optional(),
  body('roles').isArray().withMessage('Roles must be an array').optional(),
  body('roles.*').isInt().withMessage('Roles must be an array int'),
  handleValidationErrors,
  strict,
];

export const paramsVal = [param('id').isInt().withMessage('user id must be int'), handleValidationErrors, strict];
