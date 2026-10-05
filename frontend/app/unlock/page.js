'use client';
import LockScreen from '@/components/shared/LockScreen';
import { useRouter } from 'next/navigation';

export default function UnlockPage() {
  const router = useRouter();
  return <LockScreen onUnlock={() => router.push('/')} />;
}
