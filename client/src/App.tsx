import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import UserManagement from './pages/UserManagement';
import { useAuthStore } from './stores/auth';

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;