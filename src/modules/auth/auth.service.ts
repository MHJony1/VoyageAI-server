import { User } from '../../models/user.model';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/token';
import { ConflictError, UnauthorizedError } from '../../errors/AppError';
import type { IRegisterRequest, IAuthResponse, IUserResponse } from './auth.interface';

/**
 * Auth Service
 * Contains authentication business logic
 */

export const authService = {
  register: async (data: IRegisterRequest): Promise<IAuthResponse> => {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
      role: 'user',
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return token and user
    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        photo: user.photo,
        provider: user.provider,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  },

  login: async (email: string, password: string): Promise<IAuthResponse> => {
    // Find user by email with password field (select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const passwordMatch = await comparePassword(password, (user as any).password || '');
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return token and user
    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        photo: user.photo,
        provider: user.provider,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  },

  googleLogin: async (_googleToken: string): Promise<IAuthResponse> => {
    // TODO: Implement Google OAuth verification and login
    // 1. Verify Google token with Google API
    // 2. Extract user info from token
    // 3. Find or create user in database
    // 4. Generate JWT token
    // 5. Return token and user data

    throw new Error('Google login not yet implemented');
  },

  getCurrentUser: async (userId: string): Promise<IUserResponse> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      photo: user.photo,
      provider: user.provider,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};
