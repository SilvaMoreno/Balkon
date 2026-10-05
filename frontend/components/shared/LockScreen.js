'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

export default function LockScreen({ onUnlock }) {
  const { unlock, user } = useAuthStore();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (k) => {
    if (k === 'backspace') {
      setPin((p) => p.slice(0, -1));
    } else if (k === 'clear') {
      setPin('');
    } else if (pin.length < 6) {
      setPin((p) => p + k);
    }
  };

  const handleUnlock = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    try {
      await unlock(pin);
      toast.success('Sistema desbloqueado');
      onUnlock?.();
    } catch {
      toast.error('PIN inválido');
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sistema Bloqueado</h2>
        <p className="text-gray-500 mt-1">{user?.name || 'Utilizador'}</p>
      </div>

      <div className="text-3xl font-mono tracking-[0.5em] mb-8 text-center h-10">
        {pin.replace(/./g, '•') || '____'}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="touch-numpad-key text-2xl" onClick={() => handleKeyPress(String(n))}>
            {n}
          </button>
        ))}
        <button className="touch-numpad-key text-lg" onClick={() => handleKeyPress('clear')}>
          Limpar
        </button>
        <button className="touch-numpad-key text-2xl" onClick={() => handleKeyPress('0')}>
          0
        </button>
        <button className="touch-numpad-key text-lg" onClick={() => handleKeyPress('backspace')}>
          ⌫
        </button>
      </div>

      <button
        onClick={handleUnlock}
        disabled={pin.length < 4 || loading}
        className="touch-button bg-blue-600 text-white mt-6 w-full max-w-xs disabled:opacity-40"
      >
        {loading ? 'A verificar...' : 'Desbloquear'}
      </button>
    </div>
  );
}
