import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import type { User } from '../../types/user';

interface UserFormProps {
  user: User;
  onSubmit: (role: 'ADMIN' | 'USER') => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  role: 'ADMIN' | 'USER';
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      role: user.role,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.role))}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Edit User Role: {user.name}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            {...register('role')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}