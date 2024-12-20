"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductValidation = exports.filterValid = exports.updateProductValidation = exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
const base_validators_1 = require("../../utils/base.validators");
exports.createProductValidation = [
    (0, express_validator_1.body)('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    (0, express_validator_1.body)('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    base_validators_1.handleValidationErrors,
];
exports.updateProductValidation = [
    (0, express_validator_1.body)('name').optional().isString().withMessage('Name must be a string'),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    base_validators_1.handleValidationErrors,
];
exports.filterValid = [
    (0, express_validator_1.query)('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
    (0, express_validator_1.query)('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.deleteProductValidation = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
    base_validators_1.handleValidationErrors,
];
