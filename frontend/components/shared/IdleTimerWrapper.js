'use client';
import { useRouter } from 'next/navigation';
import { useIdleTimer } from 'react-idle-timer';
import { useUIStore } from '@/stores/ui-store';

export default function IdleTimerWrapper({ children }) {
  const router = useRouter();
  const setLocked = useUIStore((s) => s.setLocked);

  const onIdle = () => {
    setLocked(true);
    router.push('/unlock');
  };

  useIdleTimer({
    timeout: 5 * 60 * 1000,
    onIdle,
    events: ['mousemove', 'keydown', 'wheel', 'mousedown', 'touchstart', 'touchmove'],
    startOnMount: true,
    stopOnIdle: false,
  });

  return children;
}
