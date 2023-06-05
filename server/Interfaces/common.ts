import { PopulateOptions } from 'mongoose';

export type IPopulateOptions = PopulateOptions | (PopulateOptions | string)[];
