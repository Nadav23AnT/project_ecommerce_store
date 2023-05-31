import { Schema, model } from 'mongoose';
import { environmentType } from '../types/environmentType';
import { checkIsURL } from '../utils/validations';

const environmentSchema: Schema = new Schema<environmentType>(
  {
    envType: {
      type: String,
      enum: ['authority', 'government', 'other'],
      default: 'other',
      required: [
        true,
        "חובה להזין סוג סביבה ('authority' או 'government' או 'other')",
      ],
    },
    shualCityId: {
      type: Number,
      required: [true, 'סביבה חייבת להכיל קוד רשות של מערכת שוע"ל'],
    },
    lamas: {
      type: Number,
    },
    name: {
      type: String,
      required: [true, 'חובה להזין שם סביבה'],
      trim: true,
      maxlength: [40, 'שם הסביבה צריך להיות קצר מ-40 תווים'],
      minlength: [2, 'שם הסביבה צריך להיות ארוך מ-2 תווים'],
    },
    isTraining: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      trim: true,
      default: 'default.jpg',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
        default: 'Point',
      },
      coordinates: {
        type: [Number, Number],
        set: (value: any) =>
          typeof value === 'string' ? value.split(',') : value,
      }, // [longtitude (Y)), latitude (X)]
    },
    envUrl: {
      type: String,
      validate: {
        validator: checkIsURL,
        message: 'נא הזן URL תקין לדוגמה: www.example.com',
      },
    },
    envUsername: {
      type: String,
      trim: true,
    },
    envPassword: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// environmentSchema.index({ order: 1, departmentId: 1 }, { unique: true });

const Environment = model<environmentType>('Environment', environmentSchema);

export default Environment;
