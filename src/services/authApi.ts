import type {UserRole} from '../storage/authStorage';
import {apiRequest} from './apiClient';

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};

export type AuthPayload = {
  token: string;
  user: ApiUser;
};

export const loginRequest = (email: string, password: string) =>
  apiRequest<AuthPayload>('/api/auth/login', {
    method: 'POST',
    body: {email, password},
    skipAuth: true,
  });

export const signupRequest = (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) =>
  apiRequest<AuthPayload>('/api/auth/signup', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  });
