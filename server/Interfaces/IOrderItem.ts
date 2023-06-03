import { ObjectId } from 'mongoose';
import IProduct from '@Interfaces/IProduct';

export default interface IOrderItem {
  quantity: number;
  product: ObjectId | IProduct;
}
