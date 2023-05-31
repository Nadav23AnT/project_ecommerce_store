import { ObjectId } from 'mongoose';

export interface ICustomer {
  customerTypeId: ObjectId | string;
  shualCityId: number;
  lamas: number;
  name: string;
  isTraining: boolean;
  isEnabled: boolean;
  logo: string;
  location: {
    type: string;
    coordinates: [number];
  };
}
