import Order from '@Models/orderModel';
import OrderItem from '@Models/orderItemModel';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';
import IOrderItem from '@Interfaces/IOrderItem';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  bulkUpdate,
  deleteMany,
} from './handlerFactory';

export const getAllOrders = getAll(Order, { path: 'user', select: 'name' });

export const getOrder = getOne(Order, [
  { path: 'user', select: 'name' },
  {
    path: 'orderItems',
    populate: {
      path: 'product',
      populate: 'category',
    },
  },
]);

export const createOrder = catchAsync(async (req, res, next) => {
  const orderItemsIds = Promise.all(
    (req.body.orderItems as IOrderItem[]).map(async (orderItem) => {
      const newOrderItem = await OrderItem.create({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate({
        path: 'product',
        select: 'price',
      });

      if (!orderItem)
        return next(new AppError(`הפריט ${orderItemId} לא נמצא`, 404));

      if (!('price' in orderItem.product))
        return next(new AppError('אין מחיר למוצר שמקושר לפריט בהזמנה', 500));

      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce(
    (a, b) => Number(a) + Number(b),
    0
  ) as number;

  const order = await Order.create({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice,
    user: req.body.user,
  });

  res.status(201).json(order);
});

export const updateOrder = updateOne(Order);
export const bulkUpdateOrders = bulkUpdate(Order);
export const deleteOrder = deleteOne(Order);
export const deleteManyOrders = deleteMany(Order);
