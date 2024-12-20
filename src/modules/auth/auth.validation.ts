import { body } from 'express-validator';
import { strict, handleValidationErrors } from '../../utils/base.validators';

export const registerValidator = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
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
  handleValidationErrors,
  strict,
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isString().withMessage('Password is required'),
  handleValidationErrors,
  strict,
];
