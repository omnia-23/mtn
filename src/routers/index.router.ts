import express from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import productRoutes from '../modules/product/product.routes';
import orderRoutes from '../modules/order/order.routes';

const indexRouter = express.Router();

indexRouter.use('/auth', authRoutes);
indexRouter.use('/user', userRoutes);
indexRouter.use('/product', productRoutes);
indexRouter.use('/order', orderRoutes);

export default indexRouter;
