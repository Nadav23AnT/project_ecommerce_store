import IReview from './IReview';

export default interface IProduct {
  name: string;
  description: string;
  category: string;
  brand: string;
  image: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: IReview[];
}
