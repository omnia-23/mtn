"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../../utils/HttpError"));
const product_dal_1 = __importDefault(require("./product.dal"));
class ProductServices {
    async getAllProducts(filter) {
        const { limit, skip } = filter;
        const products = await product_dal_1.default.findAll(limit, skip);
        return products;
    }
    async getProductById(id) {
        const product = await product_dal_1.default.findById(id);
        if (!product)
            throw new HttpError_1.default(404, 'Product not found');
        return product;
    }
    async addProduct(product) {
        const newProduct = await product_dal_1.default.create(product);
        return newProduct;
    }
    async updateProduct(id, productData) {
        const updatedProduct = await product_dal_1.default.update(id, productData);
        if (!updatedProduct)
            throw new HttpError_1.default(404, 'Product not found');
        return updatedProduct;
    }
    async deleteProduct(id) {
        const deletedProduct = await product_dal_1.default.delete(id);
        if (!deletedProduct)
            throw new Error('Product not found');
    }
}
exports.default = new ProductServices();
