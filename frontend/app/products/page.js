'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import toast from 'react-hot-toast';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');

  const load = (q) => {
    const params = q ? `?search=${encodeURIComponent(q)}` : '';
    apiClient.get(`/products${params}`).then((r) => setProducts(r.data)).catch(() => {});
  };

  useEffect(() => { load(search); }, [search]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await apiClient.post('/products', { name: newName });
      toast.success('Produto criado');
      setNewName('');
      load('');
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Novo produto..."
          className="touch-input flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button onClick={handleCreate} className="touch-button bg-blue-600 text-white">
          + Adicionar
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar produtos..."
        className="touch-input mb-4"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white border rounded-2xl p-4">
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('pt-PT')}</p>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8 col-span-full">Nenhum produto encontrado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ProductsPage />
    </DashboardLayout>
  );
}
