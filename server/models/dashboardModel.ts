import { Schema, model } from 'mongoose';
import { dashboardType } from '../types/dashboardType';
import { checkIsURL } from '../utils/validations';

const dashboardSchema: Schema = new Schema<dashboardType>(
  {
    order: {
      type: Number,
      required: [true, 'דשבורד חייב להכיל מספר סדר'],
    },
    name: {
      type: String,
      required: [true, 'דשבורד חייב להכיל שם'],
      trim: true,
      maxlength: [40, 'שם הדשבורד צריך להיות קצר מ-40 תווים'],
      minlength: [2, 'שם הדשבורד צריך להיות ארוך מ-2 תווים'],
    },
    url: {
      type: String,
      required: [true, 'דשבורד חייב להכיל כתובת url'],
      validate: {
        validator: checkIsURL,
        message: 'נא הזן URL תקין לדוגמה: www.example.com',
      },
    },
    includeShualCityId: {
      type: [Number],
      default: null,
    },
    excludeShualCityId: {
      type: [Number],
      default: null,
    },
    customerTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'Type', // link documents to this model name
      required: [true, 'לקוח חייב להיות מקושר לסוג לקוח'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Dashboard = model<dashboardType>('Dashboard', dashboardSchema);

export default Dashboard;
