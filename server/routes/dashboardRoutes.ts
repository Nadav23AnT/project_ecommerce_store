import express from 'express';
import {
  getAllDashboards,
  createDashboard,
  bulkUpdateDashboard,
  getDashboard,
  updateDashboard,
  deleteDashboard,
  getMonthlyDashboard,
  getAllYears,
} from '../controllers/dashboardController';
import { protect, restrictTo } from '../controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllDashboards)
  .post(protect, restrictTo('admin'), createDashboard)
  .patch(protect, restrictTo('admin'), bulkUpdateDashboard);

router
  .route('/aggregate/:year')
  .get(protect, restrictTo('admin'), getMonthlyDashboard);
router.route('/aggregateYears').get(protect, restrictTo('admin'), getAllYears);

router
  .route('/:id')
  .get(getDashboard)
  .patch(protect, restrictTo('admin'), updateDashboard)
  .delete(protect, restrictTo('admin'), deleteDashboard);

export default router;
