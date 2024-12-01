import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  isAuthenticated,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}