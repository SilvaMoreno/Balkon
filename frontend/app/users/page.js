'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import toast from 'react-hot-toast';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', pin: '', role: 'OPERATOR' });

  const load = () => apiClient.get('/users').then((r) => setUsers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.pin) {
      toast.error('Preencha todos os campos'); return;
    }
    try {
      await apiClient.post('/users', form);
      toast.success('Utilizador criado');
      setShowNew(false);
      setForm({ name: '', email: '', password: '', pin: '', role: 'OPERATOR' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
  };

  const handleToggleActive = async (user) => {
    try {
      await apiClient.put(`/users/${user.id}`, { isActive: !user.isActive });
      toast.success(`Utilizador ${user.isActive ? 'desativado' : 'ativado'}`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
  };

  const roleLabel = { ADMIN: 'Administrador', MANAGER: 'Gerente', OPERATOR: 'Operador' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Utilizadores</h1>
        <button onClick={() => setShowNew(true)} className="touch-button bg-blue-600 text-white">
          + Novo
        </button>
      </div>

      {showNew && (
        <div className="bg-white border rounded-2xl p-4 mb-4 space-y-3">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome *" className="touch-input" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email *" className="touch-input" />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password *" className="touch-input" />
          <input type="text" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })}
            placeholder="PIN * (para desbloqueio)" className="touch-input" maxLength={6} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="touch-input">
            <option value="OPERATOR">Operador</option>
            <option value="MANAGER">Gerente</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="touch-button bg-blue-600 text-white flex-1">Criar</button>
            <button onClick={() => setShowNew(false)} className="touch-button bg-gray-200 flex-1">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className={`bg-white border rounded-2xl p-4 ${!u.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-400">{roleLabel[u.role] || u.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <button onClick={() => handleToggleActive(u)}
                  className="touch-button min-h-10 px-3 py-1 text-sm bg-gray-100 rounded-xl">
                  {u.isActive ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum utilizador encontrado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <UsersPage />
    </DashboardLayout>
  );
}
