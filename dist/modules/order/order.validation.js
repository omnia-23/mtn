"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterValid = exports.paramsValidation = exports.placeOrderValidation = void 0;
const express_validator_1 = require("express-validator");
const base_validators_1 = require("../../utils/base.validators");
exports.placeOrderValidation = [
    (0, express_validator_1.body)('orderDetails').isArray({ min: 1 }).withMessage('Order details must be an array with at least one item'),
    (0, express_validator_1.body)('orderDetails.*.product_id').isInt({ min: 1 }).withMessage('Each product_id must be a positive integer'),
    (0, express_validator_1.body)('orderDetails.*.quantity').isInt({ min: 1 }).withMessage('Each quantity must be a positive integer'),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
exports.paramsValidation = [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Order ID must be a positive integer'),
    base_validators_1.handleValidationErrors,
];
exports.filterValid = [
    (0, express_validator_1.query)('limit').isInt({ min: 1 }).withMessage('limit must be positive integer '),
    (0, express_validator_1.query)('skip').isInt({ min: 0 }).withMessage('skip must be positive integer '),
    base_validators_1.handleValidationErrors,
    base_validators_1.strict,
];
