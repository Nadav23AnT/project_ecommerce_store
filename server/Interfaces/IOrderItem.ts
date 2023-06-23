import { ObjectId } from 'mongoose';
import IProduct from '@Interfaces/IReview';

export default interface IOrderItem {
  quantity: number;
  product: ObjectId | IProduct;
}
