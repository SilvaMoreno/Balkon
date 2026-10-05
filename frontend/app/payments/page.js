'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import Link from 'next/link';

function PaymentsList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    apiClient.get('/payments').then((r) => setPayments(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pagamentos</h1>
        <Link href="/payments/new" className="touch-button bg-green-600 text-white">
          + Novo Pagamento
        </Link>
      </div>

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="bg-white border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{p.client?.name}</p>
                <p className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleString('pt-PT')}</p>
                {p.sales?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {p.sales.length} venda(s) associada(s)
                  </p>
                )}
              </div>
              <p className="text-xl font-bold text-green-600">+{Number(p.amount).toFixed(2)}€</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Por: {p.user?.name}</p>
          </div>
        ))}
        {payments.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum pagamento registado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <PaymentsList />
    </DashboardLayout>
  );
}
