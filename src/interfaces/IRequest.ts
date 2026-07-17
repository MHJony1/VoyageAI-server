import { Request } from 'express';

/**
 * Extended Request Interface with User
 * To be used in authenticated routes
 */
export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
