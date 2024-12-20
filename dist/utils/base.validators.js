"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strict = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const HttpError_1 = __importDefault(require("./HttpError"));
const handleValidationErrors = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new HttpError_1.default(403, 'Validation failed', true, errors.array());
        return next(error);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const strict = (req, _res, next) => {
    req.body = (0, express_validator_1.matchedData)(req, {
        locations: ['body'],
        onlyValidData: true,
        // includeOptionals: true,
    });
    req.params = (0, express_validator_1.matchedData)(req, {
        locations: ['params'],
        onlyValidData: true,
        // includeOptionals: true,
    });
    req.query = (0, express_validator_1.matchedData)(req, {
        locations: ['query'],
        onlyValidData: true,
        // includeOptionals: true,
    });
    next();
};
exports.strict = strict;
