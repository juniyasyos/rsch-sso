import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (nip: string, password: string) => {
    try {
      await login({ nip, password });
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
}