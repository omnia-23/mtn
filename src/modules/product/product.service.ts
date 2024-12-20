import HttpError from '../../utils/HttpError';

import { IAddProduct } from './dto/add-product.dto';
import { IFiltersDTO } from './dto/filters.dto';
import Product from './product.dal';

class ProductServices {
  async getAllProducts(filter: IFiltersDTO) {
    const { limit, skip } = filter;
    const products = await Product.findAll(limit, skip);
    return products;
  }

  async getProductById(id: number) {
    const product = await Product.findById(id);
    if (!product) throw new HttpError(404, 'Product not found');
    return product;
  }

  async addProduct(product: IAddProduct) {
    const newProduct = await Product.create(product);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<IAddProduct>) {
    const updatedProduct = await Product.update(id, productData);
    if (!updatedProduct) throw new HttpError(404, 'Product not found');
    return updatedProduct;
  }

  async deleteProduct(id: number) {
    const deletedProduct = await Product.delete(id);
    if (!deletedProduct) throw new Error('Product not found');
  }
}

export default new ProductServices();
