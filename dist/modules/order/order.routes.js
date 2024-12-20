"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['customer']), order_validation_1.filterValid, order_controller_1.getUserOrdersHandler);
router.get('/admin', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), order_validation_1.filterValid, order_controller_1.getAllOrderHandler);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin', 'customer']), order_validation_1.paramsValidation, order_controller_1.viewOrder);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['customer']), order_validation_1.placeOrderValidation, order_controller_1.placeOrderHandler);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), order_validation_1.paramsValidation, order_controller_1.deleteOrderHandler);
exports.default = router;
