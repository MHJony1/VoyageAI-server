import { User } from '../../models/user.model';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/token';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../../errors/AppError';
import { config } from '../../config/environment';
import { OAuth2Client } from 'google-auth-library';
import type { IRegisterRequest, IAuthResponse, IUserResponse } from './auth.interface';

/**
 * Auth Service
 * Contains authentication business logic
 */

const googleClient = new OAuth2Client(config.googleClientId);

const buildAuthResponse = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  photo?: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): IAuthResponse => {
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

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
};

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

    return buildAuthResponse(user);
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

    if ((user as any).blocked) {
      throw new ForbiddenError('Your account has been blocked. Contact support.');
    }

    return buildAuthResponse(user);
  },

  googleLogin: async (idToken: string): Promise<IAuthResponse> => {
    // Verify the Google ID token against our client ID
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedError('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedError('Google account has no email');
    }

    // Find existing user or create a new one
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        photo: payload.picture,
        provider: 'google',
        role: 'user',
      });
    } else if (payload.picture && !user.photo) {
      user.photo = payload.picture;
      await user.save();
    }

    return buildAuthResponse(user);
  },

  demoLogin: async (): Promise<IAuthResponse> => {
    // Find the demo user or create it on first use
    let user = await User.findOne({ email: config.demoEmail });
    if (!user) {
      const hashedPassword = await hashPassword(config.demoPassword);
      user = await User.create({
        name: config.demoName,
        email: config.demoEmail,
        password: hashedPassword,
        provider: 'local',
        role: 'user',
      });
    }

    return buildAuthResponse(user);
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
