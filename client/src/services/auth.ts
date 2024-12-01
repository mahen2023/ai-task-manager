import api from '../lib/axios';
import type { User } from '../types/auth';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};