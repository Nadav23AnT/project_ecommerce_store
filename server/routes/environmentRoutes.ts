import {
  resizeUserPhoto,
  setImageToField,
  uploadLogo,
} from '@/middleware/uploadImage';
import express from 'express';
import { protect, restrictTo } from '../controllers/authController';
import {
  getAllEnvironments,
  getEnvironment,
  createEnvironment,
  updateEnvironment,
  bulkUpdateEnvironment,
  deleteEnvironment,
  deleteManyEnvironments,
} from '../controllers/environmentController';

const router = express.Router();

router
  .route('/')
  .get(getAllEnvironments)
  .post(
    protect,
    restrictTo('admin'),
    uploadLogo,
    resizeUserPhoto,
    setImageToField,
    createEnvironment
  )
  .patch(protect, restrictTo('admin'), bulkUpdateEnvironment);
// .delete(protect, restrictTo('admin'), deleteManyEnvironments);

router
  .route('/:id')
  .get(getEnvironment)
  .patch(
    protect,
    restrictTo('admin'),
    uploadLogo,
    resizeUserPhoto,
    setImageToField,
    updateEnvironment
  )
  .delete(protect, restrictTo('admin'), deleteEnvironment);

export default router;
