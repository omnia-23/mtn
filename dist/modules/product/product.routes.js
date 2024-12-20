"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, product_validation_1.filterValid, product_controller_1.getProductsHandler);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), product_validation_1.createProductValidation, product_controller_1.createProductHandler);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), product_validation_1.updateProductValidation, product_controller_1.updateProductHandler);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), product_validation_1.deleteProductValidation, product_controller_1.deleteProductHandler);
exports.default = router;
