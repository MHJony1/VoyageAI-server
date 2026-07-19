import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    photo: {
      type: String,
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      enum: ['google', 'local', 'email'],
      default: 'local',
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['admin', 'user', 'moderator'],
      default: 'user',
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>('User', userSchema);
