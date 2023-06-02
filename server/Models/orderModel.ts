import { Schema, model } from 'mongoose';
import IOrder from '@Interfaces/IOrder';
import { checkIsCorrectPhone } from '@Utils/validations';

const orderSchema = new Schema<IOrder>(
  {
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: [true, 'חובה לצרף פריטים להזמנה'],
      },
    ],
    shippingAddress1: {
      type: String,
      trim: true,
      required: [true, 'חובה להזין כתובת משלוח 1'],
    },
    shippingAddress2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'חובה להזין עיר'],
    },
    zip: {
      type: String,
      required: [true, 'חובה להזין מיקוד'],
    },
    country: {
      type: String,
      required: [true, 'חובה להזין מדינה'],
    },
    phone: {
      type: String,
      required: [true, 'חובה להזין מספר טלפון'],
      minlength: 9,
      validation: {
        validator: checkIsCorrectPhone,
        message: "מס' טלפון לא תקין עליך להזין מס' טלפון בתבנית 05XXXXXXXX",
      },
    },
    status: {
      type: String,
      required: [true, 'חובה להזין סטטוס משלוח'],
      default: 'Pending',
    },
    totalPrice: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'חובה לקשר הזמנה למשתמש'],
    },
    dateOrdered: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
