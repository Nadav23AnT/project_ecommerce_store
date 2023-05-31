import { Schema, model } from 'mongoose';
import { TypeModel } from '../types/modelType';

const typeSchema: Schema = new Schema<TypeModel>(
  {
    name: {
      //
      type: String,
      required: [true, 'סוג לקוח חייב להכיל שם'],
      unique: true,
      trim: true, // trim extra whitespace "     משרד צבאי" => "     משרד צבאי"
      maxlength: [40, 'שם סוג הלקוח חייב להיות באורך של 40 תווים לכל היותר'],
      minlength: [3, 'שם סוג הלקוח חייב להיות באורך של 3 תווים לפחות'],
    },
  },
  {
    timestamps: true, // add the fields to the document: createdAt, updatedAt
    toJSON: { virtuals: true }, // include virtual field when we send JSON in the response
    toObject: { virtuals: true }, // include virtual field when we console.log the response
  }
);

// virtual populate links in type
typeSchema.virtual('customers', {
  ref: 'Customer',
  foreignField: 'customerTypeId',
  localField: '_id',
});

const Type = model<TypeModel>('Type', typeSchema);
export default Type;
