import express from 'express';
import {
  getAllCategories,
  createCategory,
  bulkUpdateCategories,
  deleteManyCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '@Controllers/categoryController';
import { protect, restrictTo } from '@Controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllCategories)
  .post(protect, restrictTo('admin'), createCategory)
  .patch(protect, restrictTo('admin'), bulkUpdateCategories)
  .delete(protect, restrictTo('admin'), deleteManyCategories);

router
  .route('/:id')
  .get(getCategory)
  .patch(protect, restrictTo('admin'), updateCategory)
  .delete(protect, restrictTo('admin'), deleteCategory);

export default router;
