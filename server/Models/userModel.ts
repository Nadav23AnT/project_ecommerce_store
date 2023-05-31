/* eslint-disable func-names */
import crypto from 'crypto';
import { Schema, model, Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import AppError from '@Utils/AppError';
import { currentUser, IUsers } from '@Interfaces/userType';
import {
  checkIsCorrectPhone,
  checkIsStrongPassword,
} from '../Utils/validations';

const userSchema: Schema = new Schema<IUsers>(
  {
    firstName: {
      type: String,
      required: [true, 'חובה להזין שם פרטי '],
      minlength: 2,
      maxlength: 40,
    },
    lastName: {
      type: String,
      required: [true, 'חובה להזין שם משפחה'],
      minlength: 2,
      maxlength: 40,
    },
    email: {
      type: String,
      required: [true, 'חובה להזין כתובת אימייל של המשתמש'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'חובה להזין כתובת אימייל תקנית'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    photo: { type: String, default: 'default.jpg' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phoneNumber: {
      type: String,
      minlength: 9,
      validation: {
        validator: checkIsCorrectPhone,
        message: " מס' טלפון לא תקין עליך להזין מס' טלפון בתבנית 050-000-0000",
      },
    },
    password: {
      type: String,
      required: [true, 'חובה להזין סיסמה'],
      minlength: 8,
      select: false,
      validate: {
        validator: checkIsStrongPassword,
        message:
          'סיסמה לא תקינה, על הסיסמה להכיל 8 תווים ביניהם אות גדולה, קטנה, מספרים ותו מיוחד',
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, 'חובה להזין אישור סיסמה'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator(el: string): boolean {
          return el === (this as unknown as currentUser).password;
        },
        message: 'הסיסמאות אינם זהות!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailConfirmToken: String,
    resetToken: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual<IUsers>('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre<IUsers>('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  if (this.password === undefined)
    return next(new AppError('Password is undefined', 403));

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<IUsers>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre<Query<any, IUsers>>(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp =
      parseInt(this.passwordChangedAt.getTime(), 10) / 1000;

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailConfirmToken = function () {
  const resetTokenEmail = crypto.randomBytes(32).toString('hex');

  this.resetToken = resetTokenEmail as any;

  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(resetTokenEmail)
    .digest('hex');

  return resetTokenEmail;
};

const User = model<IUsers>('User', userSchema);

export default User;
