"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.updateProductHandler = exports.createProductHandler = exports.getProductsHandler = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const product_service_1 = __importDefault(require("./product.service"));
exports.getProductsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const filters = req.query;
    const products = await product_service_1.default.getAllProducts(filters);
    res.status(200).json(products);
}, 'Failed to get products');
exports.createProductHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const product = await product_service_1.default.addProduct(data);
    res.status(201).json(product);
}, 'Failed to create product');
exports.updateProductHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const product = await product_service_1.default.updateProduct(Number(id), data);
    res.status(200).json(product);
}, 'Failed to update product');
exports.deleteProductHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await product_service_1.default.deleteProduct(Number(id));
    res.status(204).json();
}, 'Failed to delete product');
