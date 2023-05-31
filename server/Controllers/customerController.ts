import Customer from '@Models/customerModel';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
  bulkUpdate,
  deleteMany,
} from './handlerFactory';

export const getAllCustomers = getAll(Customer);
export const getCustomer = getOne(Customer);
export const createCustomer = createOne(Customer);
export const updateCustomer = updateOne(Customer);
export const bulkUpdateCustomer = bulkUpdate(Customer);
export const deleteCustomer = deleteOne(Customer);
export const deleteManyCustomers = deleteMany(Customer);
