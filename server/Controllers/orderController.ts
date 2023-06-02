import Order from '@Models/orderModel';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
  bulkUpdate,
  deleteMany,
} from './handlerFactory';

export const getAllOrders = getAll(Order, { path: 'user', select: 'name' });
export const getOrder = getOne(Order);
export const createOrder = createOne(Order);
export const updateOrder = updateOne(Order);
export const bulkUpdateOrders = bulkUpdate(Order);
export const deleteOrder = deleteOne(Order);
export const deleteManyOrders = deleteMany(Order);
