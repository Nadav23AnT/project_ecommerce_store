import express from 'express';
import {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderTotalSales,
} from '@Controllers/orderController';
import { protect, restrictTo } from '@Controllers/authController';

const router = express.Router();

router.route('/').get(getAllOrders).post(protect, restrictTo('admin'), createOrder);

router
  .route('/:id')
  .get(getOrder)
  .patch(protect, restrictTo('admin'), updateOrder)
  .delete(protect, restrictTo('admin'), deleteOrder);

router.route('/totalSales').get(getOrderTotalSales);

export default router;
