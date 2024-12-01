import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../stores/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Menu className="h-6 w-6" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Tasks
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/users"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}