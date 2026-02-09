import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      checkAuth();
    }
  }, [isAuthenticated, navigate, checkAuth]);

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return <Dashboard user={user} />;
}