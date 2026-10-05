'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';
import Link from 'next/link';

function StockPurchasesPage() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    apiClient.get('/stock-purchases').then((r) => setPurchases(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Compras para Stock</h1>
        <Link href="/stock-purchases/new" className="touch-button bg-blue-600 text-white">
          + Nova
        </Link>
      </div>

      <div className="space-y-3">
        {purchases.map((p) => (
          <div key={p.id} className="bg-white border rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{p.description}</p>
                <p className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleString('pt-PT')}</p>
                {p.notes && <p className="text-xs text-gray-400 mt-1">{p.notes}</p>}
              </div>
              <p className="text-xl font-bold text-red-600">{Number(p.amount).toFixed(2)}€</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Por: {p.user?.name}</p>
          </div>
        ))}
        {purchases.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhuma compra registada</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <StockPurchasesPage />
    </DashboardLayout>
  );
}
