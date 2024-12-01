import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserTable } from '../components/users/UserTable';
import { userService } from '../services/user';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleUpdateRole = async (id: string, role: 'ADMIN' | 'USER') => {
    await updateMutation.mutateAsync({ id, role });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles and permissions
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <UserTable
          users={users}
          onUpdate={handleUpdateRole}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}