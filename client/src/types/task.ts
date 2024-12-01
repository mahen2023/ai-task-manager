export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}