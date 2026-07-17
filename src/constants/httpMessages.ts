/**
 * Standard HTTP Response Messages
 */
export const HTTP_MESSAGES = {
  // Success Messages
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  FETCHED: 'Fetched successfully',

  // Authentication Messages
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registered successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Unauthorized',

  // Validation Messages
  VALIDATION_ERROR: 'Validation error',
  INVALID_REQUEST: 'Invalid request',

  // Resource Messages
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Already exists',
  CONFLICT: 'Conflict',

  // Server Messages
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',

  // Request Messages
  BAD_REQUEST: 'Bad request',
  FORBIDDEN: 'Forbidden',
  METHOD_NOT_ALLOWED: 'Method not allowed',
} as const;
