import { Types } from 'mongoose';

export interface dashboardType {
  order: number;
  name: string;
  url: string;
  includeShualCityId: [number];
  excludeShualCityId: [number];
  customerTypeId: Types.ObjectId | string;
}

export interface dashboardNewType {
  order: number;
  name: string;
  url: string;
  showTo: {
    allAuthorities: boolean;
    allGovernments: boolean;
    allOther: boolean;
    authority: Types.ObjectId;
    government: Types.ObjectId;
    other: Types.ObjectId;
  };
}
