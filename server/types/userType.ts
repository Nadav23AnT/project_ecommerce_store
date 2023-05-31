import { Document, Types } from 'mongoose';

export interface IUsers {
  isNew: boolean;
  isModified(arg0: string): unknown;
  createPasswordResetToken(): string;
  changedPasswordAfter(iat: number | undefined): boolean;
  correctPassword(candidatePassword: string, userPassword: string): boolean;
  createEmailConfirmToken(): string;

  _id: string | Types.ObjectId;
  id: string | Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  photo: string;
  role: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | number | undefined;
  emailConfirmToken: string | undefined;
  resetToken: string | undefined;
  active: boolean;
}

export type currentUser = Document<unknown, any, IUsers> &
  IUsers & { _id: Types.ObjectId };
