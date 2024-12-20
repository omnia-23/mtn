"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsVal = exports.updateUserVal = exports.filterValid = exports.createUserVal = void 0;
const express_validator_1 = require("express-validator");
const base_validators_1 = require("../../utils/base.validators");
exports.createUserVal = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
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
    (0, express_validator_1.body)('roles').isArray().withMessage('Roles must be an array'),
    (0, express_validator_1.body)('roles.*').isInt().withMessage('Roles must be an array int'),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.filterValid = [
    (0, express_validator_1.query)('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
    (0, express_validator_1.query)('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.updateUserVal = [
    (0, express_validator_1.param)('id').isInt().withMessage('id must be int'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address').optional(),
    (0, express_validator_1.body)('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').optional(),
    (0, express_validator_1.body)('password')
        .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol')
        .optional(),
    (0, express_validator_1.body)('roles').isArray().withMessage('Roles must be an array').optional(),
    (0, express_validator_1.body)('roles.*').isInt().withMessage('Roles must be an array int'),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.paramsVal = [(0, express_validator_1.param)('id').isInt().withMessage('user id must be int'), base_validators_1.handleValidationErrors, base_validators_1.strict];
