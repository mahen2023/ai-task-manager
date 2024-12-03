export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  id: string;
  role?: 'ADMIN' | 'USER';
  name?: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'USER'; // Adding usertype field to specify the role
}