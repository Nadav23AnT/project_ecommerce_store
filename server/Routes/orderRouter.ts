import express from 'express';
import {
  getAllOrders,
  createOrder,
  bulkUpdateOrders,
  deleteManyOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from '@Controllers/orderController';
import { protect, restrictTo } from '@Controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllOrders)
  .post(protect, restrictTo('admin'), createOrder)
  .patch(protect, restrictTo('admin'), bulkUpdateOrders)
  .delete(protect, restrictTo('admin'), deleteManyOrders);

router
  .route('/:id')
  .get(getOrder)
  .patch(protect, restrictTo('admin'), updateOrder)
  .delete(protect, restrictTo('admin'), deleteOrder);

export default router;
