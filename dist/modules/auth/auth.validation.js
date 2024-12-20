"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const base_validators_1 = require("../../utils/base.validators");
exports.registerValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    (0, express_validator_1.body)('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    (0, express_validator_1.body)('password')
        .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol'),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.loginValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isString().withMessage('Password is required'),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
