/**
 * User Module - Type Definitions
 */
export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateProfileRequest {
  name?: string;
  photo?: string;
}
