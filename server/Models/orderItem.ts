import { Schema, model } from 'mongoose';
import IOrderItem from '@Interfaces/IOrderItem';

const orderItemSchema = new Schema<IOrderItem>(
  {
    quantity: {
      type: Number,
      required: [true, 'חובה לציין את כמות הפריט בהזמנה'],
      min: [0, 'כמות הפריט בהזמנה צריכה להיות גדולה או שווה ל 0'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'הפריט בהזמנה חייב להיות מקושר למוצר'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const OrderItem = model<IOrderItem>('OrderItem', orderItemSchema);

export default OrderItem;
