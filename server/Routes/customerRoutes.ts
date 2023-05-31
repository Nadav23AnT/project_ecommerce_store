import express from 'express';
import {
  getAllCustomers,
  createCustomer,
  bulkUpdateCustomer,
  deleteManyCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from '../Controllers/customerController';
import { protect, restrictTo } from '../Controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllCustomers)
  .post(protect, restrictTo('admin'), createCustomer)
  .patch(protect, restrictTo('admin'), bulkUpdateCustomer)
  .delete(protect, restrictTo('admin'), deleteManyCustomers);

router
  .route('/:id')
  .get(getCustomer)
  .patch(protect, restrictTo('admin'), updateCustomer)
  .delete(protect, restrictTo('admin'), deleteCustomer);

export default router;
