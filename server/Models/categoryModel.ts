import { Schema, model } from 'mongoose';
import ICategory from '@Interfaces/ICategory';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'חובה להזין שם קטגוריה'],
      trim: true,
      maxlength: [40, 'שם לקוח צריך להיות קצר מ-40 תווים'],
      minlength: [2, 'שם לקוח צריך להיות ארוך מ-2 תווים'],
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
