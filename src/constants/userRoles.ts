/**
 * User Roles and Permissions
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export const DEFAULT_USER_ROLE = UserRole.USER;
