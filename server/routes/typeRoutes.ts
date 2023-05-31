import express from 'express';
import {
  createType,
  bulkUpdateType,
  getAllTypes,
  getType,
  updateType,
  deleteType,
} from '../controllers/typeController';
import { protect, restrictTo } from '../controllers/authController';
import customerRouter from './customerRoutes';

const router = express.Router();

// router.param('id', typeController.checkID);

// POST /type/:customerTypeId/links
// GET /type/:customerTypeId/links

router.use('/:customerTypeId/links', customerRouter);

router
  .route('/')
  .get(getAllTypes)
  .post(protect, restrictTo('admin'), createType)
  .patch(protect, restrictTo('admin'), bulkUpdateType);

router
  .route('/:id')
  .get(getType)
  .patch(protect, restrictTo('admin'), updateType)
  .delete(protect, restrictTo('admin'), deleteType);

export default router;
