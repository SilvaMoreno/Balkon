'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import Link from 'next/link';

function SalesList() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = filter ? `?status=${filter}` : '';
    apiClient.get(`/sales${params}`).then((r) => setSales(r.data)).catch(() => {});
  }, [filter]);

  const statusColor = (status) => ({
    PENDING: 'bg-yellow-100 text-yellow-800',
    PARTIAL: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
  }[status] || 'bg-gray-100');

  const statusLabel = (status) => ({
    PENDING: 'Pendente',
    PARTIAL: 'Pago Parcial',
    PAID: 'Pago',
  }[status] || status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Link href="/sales/new" className="touch-button bg-blue-600 text-white">
          + Nova Venda
        </Link>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['', 'PENDING', 'PARTIAL', 'PAID'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`touch-button min-h-10 px-4 py-2 text-sm rounded-xl ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            {s || 'Todas'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sales.map((sale) => (
          <Link key={sale.id} href={`/sales/${sale.id}`}
            className="block bg-white border rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{sale.client?.name}</p>
                <p className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString('pt-PT')}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{Number(sale.total).toFixed(2)}€</p>
                <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusColor(sale.status)}`}>
                  {statusLabel(sale.status)}
                </span>
              </div>
            </div>
            {sale.items?.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {sale.items.map((item, i) => (
                  <span key={i}>{item.productName}{i < sale.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
        {sales.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhuma venda encontrada</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <SalesList />
    </DashboardLayout>
  );
}
