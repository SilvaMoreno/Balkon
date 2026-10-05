'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import toast from 'react-hot-toast';

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [debts, setDebts] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    apiClient.get(`/clients/${id}`).then((r) => setClient(r.data)).catch(() => {});
    apiClient.get(`/clients/${id}/debts`).then((r) => setDebts(r.data)).catch(() => {});
  }, [id]);

  const handlePayment = async () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) { toast.error('Valor inválido'); return; }
    setPaying(true);
    try {
      await apiClient.post('/payments', { clientId: id, amount });
      toast.success('Pagamento registado');
      setPayAmount('');
      setPaying(false);
      const r = await apiClient.get(`/clients/${id}/debts`);
      setDebts(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro');
      setPaying(false);
    }
  };

  if (!client) return <div className="text-center py-8 text-gray-400">A carregar...</div>;

  return (
    <div>
      <div className="bg-white border rounded-2xl p-4 mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        {client.phone && <p className="text-gray-500">📞 {client.phone}</p>}
        {client.address && <p className="text-gray-500">{client.address}</p>}
        {client.nif && <p className="text-gray-500">NIF: {client.nif}</p>}
      </div>

      {debts && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-yellow-700">Dívida Total</p>
          <p className="text-3xl font-bold text-yellow-800">{debts.totalDebt?.toFixed(2) || '0.00'}€</p>
          <p className="text-sm text-yellow-600">
            {debts.pendingSales} vendas pendentes, {debts.partialSales} vendas parciais
          </p>
        </div>
      )}

      <div className="bg-white border rounded-2xl p-4 mb-6">
        <h2 className="font-bold text-lg mb-3">Registar Pagamento</h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="Valor (€)"
            className="touch-input flex-1"
            step="0.01"
          />
          <button onClick={handlePayment} disabled={paying || !payAmount}
            className="touch-button bg-green-600 text-white disabled:opacity-40"
          >
            {paying ? '...' : 'Pagar'}
          </button>
        </div>
      </div>

      <h2 className="font-bold text-lg mb-3">Compras</h2>
      <div className="space-y-3">
        {client.sales?.map((sale) => (
          <div key={sale.id} className="bg-white border rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{new Date(sale.createdAt).toLocaleString('pt-PT')}</p>
                <p className="text-sm text-gray-500">
                  {sale.items?.map((i) => i.productName).join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{Number(sale.total).toFixed(2)}€</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  sale.status === 'PAID' ? 'bg-green-100 text-green-700' :
                  sale.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {sale.status === 'PAID' ? 'Pago' : sale.status === 'PARTIAL' ? 'Parcial' : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ClientDetail />
    </DashboardLayout>
  );
}
