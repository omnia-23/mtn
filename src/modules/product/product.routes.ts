import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  getProductsHandler,
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from './product.controller';
import {
  deleteProductValidation,
  createProductValidation,
  filterValid,
  updateProductValidation,
} from './product.validation';

const router = express.Router();

router.get('/', authenticate, filterValid, getProductsHandler);
router.post('/', authenticate, authorize(['admin']), createProductValidation, createProductHandler);
router.put('/:id', authenticate, authorize(['admin']), updateProductValidation, updateProductHandler);
router.delete('/:id', authenticate, authorize(['admin']), deleteProductValidation, deleteProductHandler);

export default router;
