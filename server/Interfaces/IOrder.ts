import { ObjectId } from 'mongoose';

export default interface IOrder {
  orderItems: ObjectId[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice?: number;
  user: ObjectId;
  dateOrdered: Date;
}
