import { Schema } from 'mongoose';
import IReview from '@Interfaces/IReview';

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'חובה לקשר דירוג למשתמש'] },
    name: {
      type: String,
      trim: true,
      required: [true, 'חובה להזין שם דירוג'],
    },
    rating: {
      type: Number,
      required: [true, 'חובה להזין ערך דירוג'],
      default: 0,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'חובה להזין הערה על הדירוג'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


export default reviewSchema;
