import HttpError from '../../utils/HttpError';
import { IAddProduct } from './dto/add-product.dto';
import { IFiltersDTO } from './dto/filters.dto';
import Product from './product.dal';

/**
 * Service class for handling product-related operations including
 * fetching, adding, updating, and deleting products.
 */
class ProductServices {
  /**
   * Retrieves a list of all products, with optional pagination.
   * This method fetches products from the database with the option to limit and skip items.
   *
   * @param {IFiltersDTO} filter - The filter parameters for pagination.
   * @param {number} filter.limit - The maximum number of products to fetch.
   * @param {number} filter.skip - The number of products to skip for pagination.
   * @returns {Promise<any>} - A list of products that match the filter criteria.
   */
  async getAllProducts(filter: IFiltersDTO) {
    const { limit, skip } = filter;
    const products = await Product.findAll(limit, skip);
    return products;
  }

  /**
   * Retrieves a specific product by its ID.
   * This method fetches a product from the database based on its unique ID.
   *
   * @param {number} id - The ID of the product to fetch.
   * @returns {Promise<any>} - The product with the given ID.
   * @throws {HttpError} - Throws a 404 error if the product is not found.
   */
  async getProductById(id: number) {
    const product = await Product.findById(id);
    if (!product) throw new HttpError(404, 'Product not found');
    return product;
  }

  /**
   * Adds a new product to the database.
   * This method takes the product data and creates a new product in the database.
   *
   * @param {IAddProduct} product - The product data to add.
   * @returns {Promise<any>} - The created product object.
   */
  async addProduct(product: IAddProduct) {
    const newProduct = await Product.create(product);
    return newProduct;
  }

  /**
   * Updates an existing product based on its ID.
   * This method updates the product details with the provided data.
   *
   * @param {number} id - The ID of the product to update.
   * @param {Partial<IAddProduct>} productData - The product data to update.
   * @returns {Promise<any>} - The updated product object.
   * @throws {HttpError} - Throws a 404 error if the product is not found.
   */
  async updateProduct(id: number, productData: Partial<IAddProduct>) {
    const updatedProduct = await Product.update(id, productData);
    if (!updatedProduct) throw new HttpError(404, 'Product not found');
    return updatedProduct;
  }

  /**
   * Deletes a product by its ID.
   * This method deletes a product from the database based on its unique ID.
   *
   * @param {number} id - The ID of the product to delete.
   * @returns {Promise<void>} - A promise indicating that the product has been deleted.
   * @throws {Error} - Throws an error if the product is not found.
   */
  async deleteProduct(id: number) {
    const deletedProduct = await Product.delete(id);
    if (!deletedProduct) throw new Error('Product not found');
  }
}

// Export the service to be used in other parts of the application
export default new ProductServices();
