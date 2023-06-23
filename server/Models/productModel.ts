import { Schema, model } from 'mongoose';
import IProduct from '@Interfaces/IProduct';
import reviewSchema from '@Models/reviewModel';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, 'חובה להזין שם מוצר'] },
    description: { type: String, required: [true, 'חובה להזין תיאור מוצר'] },
    category: { type: String, required: [true, 'חובה להזין קטגוריית מוצר'] },
    brand: { type: String, required: [true, 'חובה להזין שם מותג למוצר'] },
    image: { type: String, required: [true, 'חובה להזין תמונה למוצר'] },
    price: { type: Number, default: 0.0, required: [true, 'חובה להזין מחיר למוצר'] },
    countInStock: { type: Number, default: 0, required: [true, 'חובה להזין כמות מלאי למוצר'] },
    rating: { type: Number, default: 0.0, required: [true, 'חובה להזין ערך דירוג למוצר'] },
    numReviews: { type: Number, default: 0, required: [true, 'חובה להזין מספר דירוגים למוצר'] },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
