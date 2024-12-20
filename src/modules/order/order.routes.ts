import express from 'express';
import {
  deleteOrderHandler,
  placeOrderHandler,
  viewOrder,
  getAllOrderHandler,
  getUserOrdersHandler,
} from './order.controller';
import { placeOrderValidation, paramsValidation, filterValid } from './order.validation';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize(['customer']), filterValid, getUserOrdersHandler);

router.get('/admin', authenticate, authorize(['admin']), filterValid, getAllOrderHandler);

router.get('/:id', authenticate, authorize(['admin', 'customer']), paramsValidation, viewOrder);

router.post('/', authenticate, authorize(['customer']), placeOrderValidation, placeOrderHandler);

router.delete('/:id', authenticate, authorize(['admin']), paramsValidation, deleteOrderHandler);

export default router;
