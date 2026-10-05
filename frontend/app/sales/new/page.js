'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/DashboardLayout';
import ClientSearch from '@/components/pos/ClientSearch';
import ProductSelector from '@/components/pos/ProductSelector';
import SaleCart from '@/components/pos/SaleCart';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

function NewSalePage() {
  const router = useRouter();
  const { clientId, items, notes, setClient, clearCart, getTotal } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);

  const handleAddItem = (item) => {
    useCartStore.getState().addItem(item);
    toast.success(`${item.productName} adicionado`);
  };

  const handleSave = async () => {
    if (!clientId) { toast.error('Selecione um cliente'); return; }
    if (items.length === 0) { toast.error('Adicione pelo menos um produto'); return; }

    setSaving(true);
    try {
      const res = await apiClient.post('/sales', {
        clientId,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
        notes,
      });
      toast.success('Venda registada!');
      clearCart();
      router.push(`/sales`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao registar venda');
    }
    setSaving(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-100px)]">
      <div className="lg:w-1/2 xl:w-3/5 flex flex-col gap-4">
        <ClientSearch
          onSelect={(id, name) => setClient(id, name)}
          selectedId={clientId}
          selectedName={useCartStore.getState().clientName}
        />

        <div className="flex-1">
          <ProductSelector onAdd={handleAddItem} />
        </div>
      </div>

      <div className="lg:w-1/2 xl:w-2/5 flex flex-col">
        <div className="flex-1 overflow-auto">
          <SaleCart />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !clientId || items.length === 0}
          className="touch-button bg-green-600 text-white w-full mt-4 text-xl py-4 disabled:opacity-40"
        >
          {saving ? 'A registar...' : `Finalizar Venda — ${getTotal().toFixed(2)}€`}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <NewSalePage />
    </DashboardLayout>
  );
}
