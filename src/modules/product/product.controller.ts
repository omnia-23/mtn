import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../../@types/express';
import { asyncHandler } from '../../utils/asyncHandler';
import ProductService from './product.service';

export const getProductsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filters = req.query;
  const products = await ProductService.getAllProducts(filters);
  res.status(200).json(products);
}, 'Failed to get products');

export const createProductHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const product = await ProductService.addProduct(data);
  res.status(201).json(product);
}, 'Failed to create product');

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const product = await ProductService.updateProduct(Number(id), data);
  res.status(200).json(product);
}, 'Failed to update product');

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await ProductService.deleteProduct(Number(id));
  res.status(204).json();
}, 'Failed to delete product');
