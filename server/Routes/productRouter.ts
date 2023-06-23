import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '@Controllers/productController';
import { protect, restrictTo } from '@Controllers/authController';

const router = express.Router();

router.route('/').get(getAllProducts).post(protect, restrictTo('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .patch(protect, restrictTo('admin'), updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

export default router;
