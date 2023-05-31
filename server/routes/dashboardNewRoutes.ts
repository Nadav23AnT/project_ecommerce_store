import express from 'express';
import {
  getAllDashboardNews,
  getDashboardNew,
  createDashboardNew,
  updateDashboardNew,
  bulkUpdateDashboardNew,
  deleteDashboardNew,
  getMonthlyDashboardNew,
  getAllYearsNew,
} from '../controllers/dashboardNewController';
import { protect, restrictTo } from '../controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllDashboardNews)
  .post(protect, restrictTo('admin'), createDashboardNew)
  .patch(protect, restrictTo('admin'), bulkUpdateDashboardNew);

router
  .route('/aggregate/:year')
  .get(protect, restrictTo('admin'), getMonthlyDashboardNew);
router
  .route('/aggregateYears')
  .get(protect, restrictTo('admin'), getAllYearsNew);

router
  .route('/:id')
  .get(getDashboardNew)
  .patch(protect, restrictTo('admin'), updateDashboardNew)
  .delete(protect, restrictTo('admin'), deleteDashboardNew);

export default router;
