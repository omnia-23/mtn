"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const product_routes_1 = __importDefault(require("../modules/product/product.routes"));
const order_routes_1 = __importDefault(require("../modules/order/order.routes"));
const indexRouter = express_1.default.Router();
indexRouter.use('/auth', auth_routes_1.default);
indexRouter.use('/user', user_routes_1.default);
indexRouter.use('/product', product_routes_1.default);
indexRouter.use('/order', order_routes_1.default);
exports.default = indexRouter;
