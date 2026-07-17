import { Response } from 'express';

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message: string = 'Success',
  data?: T,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string = 'Something went wrong',
  errors?: Record<string, string[]>,
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  statusCode: number = 200,
  message: string = 'Success',
  data: T[],
  page: number,
  limit: number,
  total: number,
): void => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  res.status(statusCode).json(response);
};
