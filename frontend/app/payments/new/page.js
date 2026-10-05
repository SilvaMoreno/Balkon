'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/DashboardLayout';
import ClientSearch from '@/components/pos/ClientSearch';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

function NewPaymentPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('full');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!clientId) { toast.error('Selecione um cliente'); return; }
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Valor inválido'); return; }

    setSaving(true);
    try {
      await apiClient.post('/payments', {
        clientId: clientId === 'new' ? null : clientId,
        amount: val,
        notes: `Pagamento ${paymentType === 'full' ? 'total' : 'parcial'}`,
      });
      toast.success('Pagamento registado');
      router.push('/payments');
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
    setSaving(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Novo Pagamento</h1>

      <ClientSearch
        onSelect={(id, name) => { setClientId(id); setClientName(name); }}
        selectedId={clientId}
        selectedName={clientName}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Valor (€)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="touch-input text-2xl font-bold text-center"
          step="0.01"
          min="0.01"
          placeholder="0.00"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !clientId || !amount}
        className="touch-button bg-green-600 text-white w-full text-xl py-4 disabled:opacity-40"
      >
        {saving ? 'A registar...' : `Registar Pagamento — ${parseFloat(amount || 0).toFixed(2)}€`}
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <NewPaymentPage />
    </DashboardLayout>
  );
}
