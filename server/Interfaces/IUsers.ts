import { Document, ObjectId } from 'mongoose';

export interface IUsers {
  isNew: boolean;
  isModified(arg0: string): unknown;
  createPasswordResetToken(): string;
  changedPasswordAfter(iat: number | undefined): boolean;
  correctPassword(candidatePassword: string, userPassword: string): boolean;
  createEmailConfirmToken(): string;

  _id: string | ObjectId;
  id: string | ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  photo: string;
  role: 'admin' | 'user';
  phoneNumber: string;
  password?: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | number | undefined;
  emailConfirmToken: string | undefined;
  resetToken: string | undefined;
  active: boolean;
}

export type currentUser = Document<unknown, unknown, IUsers> &
  IUsers & { _id: ObjectId };
