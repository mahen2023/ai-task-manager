import api from '../lib/axios';
import type { User, UpdateUserInput } from '../types/user';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async updateUser({ id, ...data }: UpdateUserInput): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};