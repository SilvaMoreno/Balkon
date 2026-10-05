'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import toast from 'react-hot-toast';

function CashCloseoutPage() {
  const [closeouts, setCloseouts] = useState([]);
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiClient.get('/cash-closeout').then((r) => setCloseouts(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    const cash = parseFloat(cashAmount) || 0;
    const card = parseFloat(cardAmount) || 0;
    if (cash <= 0 && card <= 0) { toast.error('Insira pelo menos um valor'); return; }

    setSaving(true);
    try {
      await apiClient.post('/cash-closeout', { cashAmount: cash, cardAmount: card, notes });
      toast.success('Fecho de caixa registado');
      setCashAmount('');
      setCardAmount('');
      setNotes('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Erro'); }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fecho de Caixa</h1>

      <div className="bg-white border rounded-2xl p-4 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Dinheiro Contado (€)</label>
          <input type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)}
            className="touch-input text-xl font-bold text-center" step="0.01" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Máquina Cartão (€)</label>
          <input type="number" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)}
            className="touch-input text-xl font-bold text-center" step="0.01" placeholder="0.00" />
        </div>
        <div className="text-center text-lg font-bold text-blue-600">
          Total: {(parseFloat(cashAmount || 0) + parseFloat(cardAmount || 0)).toFixed(2)}€
        </div>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações..." className="touch-input" />
        <button onClick={handleSubmit} disabled={saving}
          className="touch-button bg-blue-600 text-white w-full disabled:opacity-40">
          {saving ? 'A registar...' : 'Registar Fecho de Caixa'}
        </button>
      </div>

      <h2 className="font-bold text-lg mb-3">Histórico</h2>
      <div className="space-y-2">
        {closeouts.map((c) => (
          <div key={c.id} className="bg-white border rounded-xl p-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString('pt-PT')}</span>
              <span className="font-bold">{Number(c.totalCounted).toFixed(2)}€</span>
            </div>
            <div className="text-xs text-gray-400">
              Dinheiro: {Number(c.cashAmount).toFixed(2)}€ | Cartão: {Number(c.cardAmount).toFixed(2)}€
              <span className="ml-2">— {c.user?.name}</span>
            </div>
          </div>
        ))}
        {closeouts.length === 0 && (
          <p className="text-center text-gray-400 py-4">Nenhum fecho registado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <CashCloseoutPage />
    </DashboardLayout>
  );
}
