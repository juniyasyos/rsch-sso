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
  X,
  Award,
  Lock
} from 'lucide-react';
import type { User as UserType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { dashboardService, type AccessProfileResponse, type ApplicationInProfile } from '../services/dashboardService';
import { ssoService } from '../services/ssoService';

interface DashboardProps {
  user: UserType;
}

interface ApplicationWithIcon extends ApplicationInProfile {
  icon: React.ElementType;
  gradient: string;
  isOnline: boolean;
}

export default function Dashboard({ user }: DashboardProps) {
  const { logout } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [accessProfiles, setAccessProfiles] = useState<Array<{
    profile: AccessProfileResponse;
    applications: ApplicationWithIcon[];
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [totalApps, setTotalApps] = useState(0);

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
        const profiles = await dashboardService.getApplicationsByProfile();

        let totalAppCount = 0;
        const profilesWithApps = profiles.map((profile) => {
          const appsWithIcons = profile.applications.map((app) => {
            const config = appConfig[app.name] || {
              icon: Hospital,
              gradient: 'from-gray-500 to-gray-600'
            };
            totalAppCount++;
            return {
              ...app,
              icon: config.icon,
              gradient: config.gradient,
              isOnline: app.enabled,
            };
          });

          return {
            profile,
            applications: appsWithIcons,
          };
        });

        setAccessProfiles(profilesWithApps);
        setTotalApps(totalAppCount);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setAccessProfiles([]);
        setTotalApps(0);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Placeholder for role and nip, will be fetched from user data
  const role = user?.role || 'Pengguna Sistem';
  const nip = user?.nip || '---';

  const handleAppClick = (app: ApplicationInProfile) => {
    if (app.app_url) {
      window.open(app.app_url, '_blank');
    }
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
          <div className="fixed top-20 right-6 z-50 hidden md:block">
            <div className="bg-white w-80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Info Akun</h2>
                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{role}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Details */}
              <div className="px-5 py-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Username</span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NIP</span>
                  <span className="font-medium text-gray-900">{nip}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 font-medium">Active</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Actions */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => ssoService.redirectToAdminPanel()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </button>

                <button
                  onClick={logout}
                  className="w-full text-sm text-red-600 hover:bg-red-50 py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="flex-1 bg-black/30" onClick={() => setShowInfoModal(false)} />

            <div className="w-80 max-w-full bg-white h-full shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Info Akun</h2>
                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{role}</p>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Details */}
              <div className="px-5 py-4 space-y-3 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Username</span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NIP</span>
                  <span className="font-medium text-gray-900">{nip}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 font-medium">Active</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => ssoService.redirectToAdminPanel()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin PanelF
                </button>

                <button
                  onClick={logout}
                  className="w-full text-sm text-red-600 hover:bg-red-50 py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
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
                Single Sign-On
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
          ) : accessProfiles.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Tidak ada akses profil yang tersedia</p>
                <p className="text-gray-400 text-sm mt-2">Hubungi administrator untuk diberikan akses</p>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {accessProfiles.map((profileGroup) => (
                <div key={profileGroup.profile.id}>
                  {/* Profile Header */}
                  <div className="mb-6 pb-4 border-b border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{profileGroup.profile.name}</h3>
                        {profileGroup.profile.description && (
                          <p className="text-sm text-gray-600">{profileGroup.profile.description}</p>
                        )}
                      </div>
                      {profileGroup.profile.is_system && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          <Lock className="w-3 h-3" />
                          System
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 ml-11">
                      {profileGroup.applications.length} aplikasi tersedia
                    </p>
                  </div>

                  {/* Applications Grid for this Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
                    {profileGroup.applications.map((app, index) => {
                      const Icon = app.icon;
                      return (
                        <div
                          key={app.id}
                          style={{ opacity: 0, animation: `slideUp 0.6s ease-out ${0.05 * index}s forwards` }}
                        >
                          <button
                            onClick={() => handleAppClick(app)}
                            disabled={!app.isOnline}
                            className="relative cursor-pointer group w-full text-left h-full disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl border border-blue-100/50 transition-all duration-300 h-full relative overflow-hidden ${!app.isOnline ? 'opacity-75' : 'hover:scale-105 active:scale-95'}`}>
                              {/* Gradient overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                              {/* Offline overlay */}
                              {!app.isOnline && (
                                <div className="absolute inset-0 bg-red-500/10 rounded-2xl z-30 flex items-center justify-center">
                                  <span className="text-red-700 font-semibold text-sm bg-red-100/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">Offline</span>
                                </div>
                              )}

                              {/* Notification Badge */}
                              <div className="absolute top-3 right-3 z-20">
                                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                                  0
                                </div>
                              </div>

                              {/* Icon */}
                              <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${app.gradient} text-white shadow-lg mb-4 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                <Icon className="w-8 h-8" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} rounded-xl blur-md opacity-50 -z-10`}></div>
                              </div>

                              {/* Content */}
                              <div className="mb-4 relative z-10">
                                <h4 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                  {app.name}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {app.description}
                                </p>

                                {/* Role Badge */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-600">Role:</span>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                      {app.role.name || app.role.slug}
                                    </span>
                                  </div>

                                  {/* Status Badge */}
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${app.enabled ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                      'bg-red-100 text-red-700 border border-red-200'
                                      }`}>
                                      {app.enabled && (
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                      )}
                                      {!app.enabled && (
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                      )}
                                      {app.enabled ? 'Ready' : 'Offline'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Hover indicator */}
                              <div className={`absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 z-10 ${!app.isOnline ? 'hidden' : 'group-hover:opacity-100'}`}>
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
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center" style={{ animation: 'fadeIn 0.8s ease-out 1.5s forwards', opacity: 0 }}>
          <p className="text-sm text-gray-500 mb-2">
            💡 Tip: Organisir berdasarkan Access Profile Anda. Klik aplikasi untuk membuka, atau akses Admin Panel untuk pengaturan tambahan
          </p>
          <p className="text-xs text-gray-400">
            Total {accessProfiles.length} profil akses dengan {totalApps} aplikasi yang tersedia
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