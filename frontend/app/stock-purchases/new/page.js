'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/DashboardLayout';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

function NewStockPurchasePage() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) { toast.error('Descrição é obrigatória'); return; }
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Valor inválido'); return; }

    setSaving(true);
    try {
      await apiClient.post('/stock-purchases', { description, amount: val, notes });
      toast.success('Compra registada');
      router.push('/stock-purchases');
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
    setSaving(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nova Compra para Stock</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição *</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          className="touch-input" placeholder="Ex: Compra no Continente" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Valor Gasto (€) *</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="touch-input text-2xl font-bold text-center" step="0.01" placeholder="0.00" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Observações</label>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
          className="touch-input" placeholder="Notas adicionais..." />
      </div>

      <button onClick={handleSave} disabled={saving || !description || !amount}
        className="touch-button bg-blue-600 text-white w-full text-xl py-4 disabled:opacity-40">
        {saving ? 'A registar...' : 'Registar Compra'}
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <NewStockPurchasePage />
    </DashboardLayout>
  );
}
