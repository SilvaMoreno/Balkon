'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import Link from 'next/link';
import toast from 'react-hot-toast';

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const load = (q) => {
    const params = q ? `?search=${encodeURIComponent(q)}` : '';
    apiClient.get(`/clients${params}`).then((r) => setClients(r.data)).catch(() => {});
  };

  useEffect(() => { load(search); }, [search]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await apiClient.post('/clients', { name: newName, phone: newPhone });
      toast.success('Cliente criado');
      setShowNew(false);
      setNewName('');
      setNewPhone('');
      load('');
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button onClick={() => setShowNew(true)} className="touch-button bg-blue-600 text-white">
          + Novo
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar cliente..."
        className="touch-input mb-4"
      />

      {showNew && (
        <div className="bg-white border rounded-2xl p-4 mb-4 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome *"
            className="touch-input"
          />
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Telefone"
            className="touch-input"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="touch-button bg-blue-600 text-white flex-1">Criar</button>
            <button onClick={() => setShowNew(false)} className="touch-button bg-gray-200 flex-1">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {clients.map((c) => (
          <Link key={c.id} href={`/clients/${c.id}`}
            className="block bg-white border rounded-2xl p-4 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{c.name}</p>
                {c.phone && <p className="text-sm text-gray-500">{c.phone}</p>}
              </div>
              <span className="text-sm text-gray-400">{c._count?.sales || 0} vendas</span>
            </div>
          </Link>
        ))}
        {clients.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum cliente encontrado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ClientsList />
    </DashboardLayout>
  );
}
