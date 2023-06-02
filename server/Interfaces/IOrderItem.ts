import { ObjectId } from 'mongoose';

export default interface IOrderItem {
  quantity: number;
  product: ObjectId;
}
