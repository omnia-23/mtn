import ProductServices from '../../src/modules/product/product.service';
import Product from '../../src/modules/product/product.dal';
import HttpError from '../../src/utils/HttpError';

jest.mock('../../src/modules/product/product.dal');

describe('ProductServices', () => {
  const product = { name: 'Product 1', price: '10.5', stock: 10 };
  const mockProduct = { id: 1, name: 'Product 1', price: '10.5', stock: 10 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      const filter = { limit: 10, skip: 0 };

      (Product.findAll as jest.Mock).mockResolvedValue([mockProduct]);

      const result = await ProductServices.getAllProducts(filter);

      expect(result[0]).toEqual(mockProduct);
    });
  });

  describe('getProductById', () => {
    it('should return a product by its ID', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await ProductServices.getProductById(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should throw a 404 error if the product is not found', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(null);
      await expect(ProductServices.getProductById(2)).rejects.toThrow(new HttpError(404, 'Product not found'));
    });
  });

  describe('addProduct', () => {
    it('should add a new product and return it', async () => {
      (Product.create as jest.Mock).mockResolvedValue(mockProduct);
      const result = await ProductServices.addProduct(product);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update the product and return the updated product', async () => {
      (Product.update as jest.Mock).mockResolvedValue({ ...mockProduct, name: 'product' });
      const result = await ProductServices.updateProduct(1, { ...mockProduct, name: 'product' });
      expect(result.name).toEqual('product');
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product successfully', async () => {
      (Product.delete as jest.Mock).mockResolvedValue(mockProduct);

      await ProductServices.deleteProduct(1);
      expect(Product.delete).toHaveBeenCalledWith(1);
    });
  });
});
