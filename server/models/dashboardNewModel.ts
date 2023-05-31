import { Schema, model } from 'mongoose';
import { dashboardNewType } from '../types/dashboardType';
import { checkIsURL } from '../utils/validations';

const dashboardNewSchema: Schema = new Schema<dashboardNewType>(
  {
    order: {
      type: Number,
      required: [true, 'דשבורד חייב להכיל מספר סידורי'],
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
    showTo: {
      allAuthorities: {
        type: Boolean,
        default: true,
      },
      allGovernments: {
        type: Boolean,
        default: true,
      },
      allOther: {
        type: Boolean,
        default: true,
      },
      authority: {
        type: [Schema.Types.ObjectId],
        ref: 'Environment',
        default: [],
      },
      government: {
        type: [Schema.Types.ObjectId],
        ref: 'Environment',
        default: [],
      },
      other: {
        type: [Schema.Types.ObjectId],
        ref: 'Environment',
        default: [],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DashboardNew = model<dashboardNewType>(
  'DashboardNew',
  dashboardNewSchema
);

export default DashboardNew;

// this is the query to find all dashboards for Tel-Aviv-Yafo:
// we find all dashboards that related to all authorities, and all the dashboards related to Tel-Aviv-Yafo only.

// {
//   $or: [
//     { 'showTo.allAuthorities': true },
//     {
//       'showTo.authority': {
//         $in: [ObjectId('637356cb9993e0a14573dc4f')]
//       }
//     }
//   ];
// }
