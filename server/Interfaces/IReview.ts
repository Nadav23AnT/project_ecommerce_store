import { ObjectId } from 'mongoose';

export default interface IReview {
  user: ObjectId;
  name: string;
  rating: number;
  comment: string;
}
