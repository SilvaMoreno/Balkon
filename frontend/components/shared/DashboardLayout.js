'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import Sidebar from './Sidebar';
import IdleTimerWrapper from './IdleTimerWrapper';
import LockScreen from './LockScreen';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { sidebarOpen, toggleSidebar, locked, setLocked } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) router.push('/login');
  }, [token, router]);

  if (!mounted || !token) return null;

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />;

  return (
    <IdleTimerWrapper>
      <div className="min-h-screen flex">
        <Sidebar open={sidebarOpen} onClose={() => useUIStore.getState().toggleSidebar()} />

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b px-4 py-3 flex items-center justify-between lg:justify-end sticky top-0 z-30">
            <button onClick={toggleSidebar} className="touch-button min-h-10 min-w-10 p-2 lg:hidden">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{user?.name}</span>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/login');
                }}
                className="touch-button min-h-10 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-xl"
              >
                Sair
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </IdleTimerWrapper>
  );
}
