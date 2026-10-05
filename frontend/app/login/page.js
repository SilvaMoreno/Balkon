'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, token } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) router.push('/');
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login efetuado');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-3xl text-white font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold">StockControl</h1>
          <p className="text-gray-500 mt-1">Sistema de Gestão</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="touch-input"
              placeholder="admin@stock.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="touch-input"
              placeholder="••••••"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="touch-button bg-blue-600 text-white w-full disabled:opacity-40"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 space-y-1">
          <p>Demo: admin@stock.com / admin123</p>
          <p>Demo: operador@stock.com / oper123</p>
        </div>
      </div>
    </div>
  );
}
