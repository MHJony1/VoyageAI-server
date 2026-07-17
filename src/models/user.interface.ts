import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  photo?: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProvider = 'google' | 'local' | 'email';
export type UserRole = 'admin' | 'user' | 'moderator';
