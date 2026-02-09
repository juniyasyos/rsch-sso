import { LogOut, Hospital } from 'lucide-react';
import type { User as UserType } from '../types';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Hospital className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Selamat datang, {user.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Dashboard content will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
}