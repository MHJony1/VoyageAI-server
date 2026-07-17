/**
 * Auth Module - Type Definitions
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface IGoogleLoginRequest {
  token: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}
