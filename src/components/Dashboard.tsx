import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Hospital,
  Pill,
  TestTube,
  FileText,
  Users,
  ShieldCheck,
  CircleAlert,
  Utensils,
  Settings,
  User,
  X
} from 'lucide-react';
import type { User as UserType, Application } from '../types';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';

interface DashboardProps {
  user: UserType;
}

interface ApplicationWithIcon extends Application {
  icon: React.ElementType;
  gradient: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const { logout } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithIcon[]>([]);
  const [loading, setLoading] = useState(true);

  // Map of app names to icons and gradients
  const appConfig: Record<string, { icon: React.ElementType; gradient: string }> = {
    'Application Control-Client': { icon: ShieldCheck, gradient: 'from-blue-500 to-blue-600' },
    'Incident Reporting System': { icon: CircleAlert, gradient: 'from-orange-500 to-orange-600' },
    'Pharmacy Management System': { icon: Pill, gradient: 'from-emerald-500 to-emerald-600' },
    'SIMGIZI - Sistem Informasi Manajemen': { icon: Utensils, gradient: 'from-teal-500 to-teal-600' },
    'Tamasudeva - Eticom Management Unit': { icon: Hospital, gradient: 'from-purple-500 to-purple-600' },
    'Laboratorium Klinik': { icon: TestTube, gradient: 'from-indigo-500 to-indigo-600' },
    'Rekam Medis Elektronik': { icon: FileText, gradient: 'from-cyan-500 to-cyan-600' },
    'Sistem Antrian Pasien': { icon: Users, gradient: 'from-pink-500 to-pink-600' },
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await dashboardService.getApplications();
        const appsWithIcons = apps.map((app: Application) => ({
          ...app,
          icon: appConfig[app.name]?.icon || Hospital,
          gradient: appConfig[app.name]?.gradient || 'from-gray-500 to-gray-600',
        }));
        setApplications(appsWithIcons);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        // Fallback to hardcoded if API fails
        setApplications([
          {
            id: '1',
            name: 'Application Control-Client',
            description: 'Aplikasi control-client untuk merevisi integrasi sistem untuk operasi akses sistem.',
            icon: ShieldCheck,
            status: 'Siapro',
            access: 'Akses: Control-Client',
            url: '#app-control',
            gradient: 'from-blue-500 to-blue-600',
            notifications: 5
          },
          // ... other hardcoded apps
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Placeholder for role and nip, will be fetched from API
  const role = 'Dokter'; // This should come from user data or API
  const nip = '123456789'; // This should come from user data or API

  const handleAppClick = (app: Application) => {
    alert(`Membuka aplikasi ${app.name}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden pb-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s', animationDelay: '3s' }} />
      </div>

      {/* User Info Modal - Desktop Popup / Mobile Sidebar */}
      {showInfoModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowInfoModal(false)} />
          
          {/* Desktop Popup */}
          <div className="fixed top-20 right-4 md:right-8 z-50 hidden md:block">
            <div className="bg-white rounded-2xl shadow-2xl w-80 animate-slideDown" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Info Akun</h2>
                  <button 
                    onClick={() => setShowInfoModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-lg font-semibold">{user?.name || 'User'}</p>
                    <p className="text-sm text-white/80">{role}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Username</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 font-medium">
                    {user?.name || 'User'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">NIP</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900">
                    {nip}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Role</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 flex items-center justify-between">
                    <span>{role}</span>
                    <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <Settings className="w-5 h-5" />
                    Admin Panel
                  </button>

                  <button 
                    onClick={logout}
                    className="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="fixed top-0 right-0 h-full z-50 md:hidden w-80 max-w-[85vw] animate-slideLeft" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white h-full shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Info Akun</h2>
                  <button 
                    onClick={() => setShowInfoModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-lg font-semibold">{user?.name || 'User'}</p>
                    <p className="text-sm text-white/80">{role}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Username</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 font-medium">
                    {user?.name || 'User'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">NIP</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900">
                    {nip}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Role</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 flex items-center justify-between">
                    <span>{role}</span>
                    <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <Settings className="w-5 h-5" />
                    Admin Panel
                  </button>

                  <button 
                    onClick={logout}
                    className="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Header - Logo and User Info */}
        <div className="flex items-center justify-between mb-8" style={{ animation: 'fadeIn 0.8s ease-out forwards' }}>
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-2.5 rounded-xl shadow-lg relative">
              <Hospital className="w-7 h-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl blur-lg opacity-50 -z-10"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                UNIFIED ACCESS
              </h1>
              <p className="text-sm text-gray-600">
                Portal akses terpadu Rumah Sakit Citra Husada Jember
              </p>
            </div>
          </div>

          {/* User Account Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="relative group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
              <User className="w-6 h-6 text-white" />
            </div>
            {/* Notification indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </button>
        </div>

        {/* Welcome Text */}
        <div className="mb-8" style={{ animation: 'fadeIn 0.8s ease-out 0.2s forwards', opacity: 0 }}>
          <p className="text-gray-600 text-sm md:text-base mb-2">SELAMAT DATANG, {user?.name?.toUpperCase() || 'USER'}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Satu pintu untuk semua <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">aplikasi layanan.</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Masuk sekali, lalu akses seluruh aplikasi operasional rumah sakit dengan aman: mutu, insiden, dokumen, hingga analitik manajemen.
          </p>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Applications Grid - Full Width */}
              <div className="w-full">
                {/* Applications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {applications.map((app, index) => {
                    const Icon = app.icon;
                    return (
                      <div
                        key={app.id}
                        style={{ opacity: 0, animation: `slideUp 0.6s ease-out ${0.1 * index}s forwards` }}
                      >
                        <button
                          onClick={() => handleAppClick(app)}
                          className="relative cursor-pointer group w-full text-left h-full"
                        >
                          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl border border-blue-100/50 transition-all duration-300 h-full relative overflow-hidden hover:scale-105 active:scale-95">
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                            {/* Notification Badge */}
                            {app.notifications && app.notifications > 0 && (
                              <div className="absolute top-3 right-3 z-20">
                                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                                  {app.notifications > 99 ? '99+' : app.notifications}
                                </div>
                              </div>
                            )}

                            {/* Icon */}
                            <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${app.gradient} text-white shadow-lg mb-4 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                              <Icon className="w-8 h-8" />
                              <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} rounded-xl blur-md opacity-50 -z-10`}></div>
                            </div>

                            {/* Content */}
                            <div className="mb-4 relative z-10">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                {app.name}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {app.description}
                              </p>
                              
                              {/* Access Info */}
                              <div className="space-y-1.5">
                                {app.access && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs border border-blue-200 text-blue-700 bg-blue-50/80 backdrop-blur-sm px-2 py-1 rounded">
                                      {app.access}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center" style={{ animation: 'fadeIn 0.8s ease-out 1.5s forwards', opacity: 0 }}>
          <p className="text-sm text-gray-500">
            Klik pada aplikasi untuk mengakses sistem • Login sekali untuk semua akses
          </p>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
        .animate-slideLeft { animation: slideLeft 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}