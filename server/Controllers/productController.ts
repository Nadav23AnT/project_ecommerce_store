import Product from '@Models/productModel';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';
import { getAll, getOne, updateOne } from './handlerFactory';

// export const getAllProducts = getAll(Product, { path: 'user', select: 'name' });

// export const getProduct = getOne(Product, [
//   { path: 'user', select: 'name' },
//   {
//     path: 'productItems',
//     populate: {
//       path: 'product',
//       populate: 'category',
//     },
//   },
// ]);

// export const createProduct = catchAsync(async (req, res, next) => {
//   // 1) get all productItem id's
//   const productItemsIds = Promise.all(
//     (req.body.productItems as IProductItem[]).map(async (productItem) => {
//       const newProductItem = await ProductItem.create({
//         quantity: productItem.quantity,
//         product: productItem.product,
//       });

//       return newProductItem._id;
//     })
//   );

//   const productItemsIdsResolved = await productItemsIds;

//   // 2) calculate product's total price
//   const totalPrices = await Promise.all(
//     productItemsIdsResolved.map(async (productItemId) => {
//       const productItem = await ProductItem.findById(productItemId).populate({
//         path: 'product',
//         select: 'price',
//       });

//       if (!productItem) return next(new AppError(`הפריט ${productItemId} לא נמצא`, 404));

//       if (!('price' in productItem.product))
//         return next(new AppError('אין מחיר למוצר שמקושר לפריט בהזמנה', 500));

//       const totalPrice = productItem.product.price * productItem.quantity;

//       return totalPrice;
//     })
//   );

//   const totalPrice = totalPrices.reduce((a, b) => Number(a) + Number(b), 0) as number;

//   // 3) save product data in DB
//   const product = await Product.create({
//     productItems: productItemsIdsResolved,
//     shippingAddress1: req.body.shippingAddress1,
//     shippingAddress2: req.body.shippingAddress2,
//     city: req.body.city,
//     zip: req.body.zip,
//     country: req.body.country,
//     phone: req.body.phone,
//     status: req.body.status,
//     totalPrice,
//     user: req.body.user,
//   });

//   res.status(201).json(product);
// });

// export const updateProduct = updateOne(Product);

// export const deleteProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);
//   if (!product) return next(new AppError('רשומה לא נמצאה', 404));

//   if (product) {
//     try {
//       await Promise.all(
//         product.productItems.map(async (productItemId) => ProductItem.findByIdAndRemove(productItemId))
//       );
//     } catch (error) {
//       return next(new AppError('בעיה במחיקת פריטים בהזמנה', 500));
//     }

//     return res.status(204).json({
//       data: null,
//     });
//   }
// });

// export const getProductTotalSales = catchAsync(async (_req, res, next) => {
//   const totalSales = await Product.aggregate([
//     { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
//   ]);

//   if (!totalSales) return next(new AppError('בעיה בחישוב מכירות כללי', 500));

//   return res.status(200).json({
//     totalSales: totalSales.pop().totalSales,
//   });
// });
