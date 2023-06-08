import Order from '@Models/orderModel';
import OrderItem from '@Models/orderItemModel';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';
import IOrderItem from '@Interfaces/IOrderItem';
import { getAll, getOne, updateOne } from './handlerFactory';

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
  // 1) get all orderItem id's
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

  // 2) calculate order's total price
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate({
        path: 'product',
        select: 'price',
      });

      if (!orderItem) return next(new AppError(`הפריט ${orderItemId} לא נמצא`, 404));

      if (!('price' in orderItem.product))
        return next(new AppError('אין מחיר למוצר שמקושר לפריט בהזמנה', 500));

      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => Number(a) + Number(b), 0) as number;

  // 3) save order data in DB
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

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new AppError('רשומה לא נמצאה', 404));

  if (order) {
    try {
      await Promise.all(
        order.orderItems.map(async (orderItemId) => OrderItem.findByIdAndRemove(orderItemId))
      );
    } catch (error) {
      return next(new AppError('בעיה במחיקת פריטים בהזמנה', 500));
    }

    return res.status(204).json({
      data: null,
    });
  }
});

export const getOrderTotalSales = catchAsync(async (_req, res, next) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) return next(new AppError('בעיה בחישוב מכירות כללי', 500));

  return res.status(200).json({
    totalSales: totalSales.pop().totalSales,
  });
});
