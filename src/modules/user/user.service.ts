import { User } from '../../models/user.model';
import { NotFoundError, UnauthorizedError } from '../../errors/AppError';
import { hashPassword, comparePassword } from '../../utils/password';
import type { IUserProfile, IUpdateProfileRequest } from './user.interface';

/**
 * User Service
 * Contains user profile management business logic
 */

export const userService = {
  getProfile: async (userId: string): Promise<IUserProfile> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  updateProfile: async (userId: string, data: IUpdateProfileRequest): Promise<IUserProfile> => {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedError('Password change not available for this account');
    }

    const matches = await comparePassword(oldPassword, user.password);
    if (!matches) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.password = await hashPassword(newPassword);
    await user.save();
  },

  getSettings: async (userId: string): Promise<Record<string, unknown>> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user.settings || {};
  },

  updateSettings: async (
    userId: string,
    settings: Record<string, unknown>,
  ): Promise<Record<string, unknown>> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    user.settings = { ...(user.settings || {}), ...settings };
    await user.save();
    return user.settings;
  },
};
