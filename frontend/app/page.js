'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

function DashboardContent() {
  const [data, setData] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    if (hasPermission('dashboard:read')) {
      apiClient.get('/dashboard/summary').then((r) => setData(r.data)).catch(() => {});
      apiClient.get('/dashboard/monthly').then((r) => setMonthly(r.data)).catch(() => {});
    }
  }, []);

  const cards = [
    { label: 'Vendas (Mês)', value: data?.totalSalesMonth || 0, color: 'bg-blue-50 text-blue-700', prefix: '€' },
    { label: 'Gastos (Mês)', value: data?.totalExpensesMonth || 0, color: 'bg-red-50 text-red-700', prefix: '€' },
    { label: 'Saldo', value: data?.balance || 0, color: 'bg-green-50 text-green-700', prefix: '€' },
    { label: 'Dívidas Pendentes', value: data?.totalPendingDebt || 0, color: 'bg-yellow-50 text-yellow-700', prefix: '€' },
    { label: 'Vendas Hoje', value: data?.todaySales || 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Clientes', value: data?.totalClients || 0, color: 'bg-indigo-50 text-indigo-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {data?.todayCashCloseout && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-green-700 font-medium">Último fecho de caixa (hoje)</p>
          <p className="text-lg font-bold text-green-800">
            Dinheiro: {data.todayCashCloseout.cashAmount.toFixed(2)}€ | Cartão: {data.todayCashCloseout.cardAmount.toFixed(2)}€
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl p-4 ${c.color}`}>
            <p className="text-sm opacity-80">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.prefix}{Number(c.value).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-4">
        <h2 className="font-bold text-lg mb-4">Vendas vs Gastos (Mensal)</h2>
        {monthly.length > 0 ? (
          <div className="space-y-2">
            {monthly.filter(m => m.sales > 0 || m.expenses > 0).map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">M{m.month}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min((m.sales / Math.max(...monthly.map(x => x.sales))) * 100, 100)}%` }} />
                  <div className="bg-red-400 h-full transition-all" style={{ width: `${Math.min((m.expenses / Math.max(...monthly.map(x => x.sales))) * 100, 100)}%` }} />
                </div>
                <span className="text-sm w-24 text-right">{m.sales.toFixed(0)}€ / {m.expenses.toFixed(0)}€</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Sem dados este ano</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link href="/sales/new" className="touch-button bg-blue-600 text-white text-center col-span-2 lg:col-span-1">
          + Nova Venda
        </Link>
        <Link href="/payments/new" className="touch-button bg-green-600 text-white text-center col-span-2 lg:col-span-1">
          + Novo Pagamento
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
