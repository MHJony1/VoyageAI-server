import { User } from '../../models/user.model';
import { NotFoundError } from '../../errors/AppError';
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
};
