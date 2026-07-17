/**
 * Auth Module - Type Definitions
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  photo?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthPayload {
  userId: string;
  email: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}
