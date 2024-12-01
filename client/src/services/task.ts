import api from '../lib/axios';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask({ id, ...data }: UpdateTaskInput): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};