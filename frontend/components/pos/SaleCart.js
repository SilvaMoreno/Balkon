'use client';
import { useCartStore } from '@/stores/cart-store';

export default function SaleCart() {
  const { items, clientName, notes, updateQuantity, removeItem, setNotes, getTotal } = useCartStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🛒</span>
        <div>
          <h2 className="font-bold text-lg">Carrinho</h2>
          {clientName && <p className="text-sm text-gray-500">{clientName}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Carrinho vazio</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  {(Number(item.unitPrice)).toFixed(2)}€ × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}€</p>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    className="touch-button min-h-8 min-w-8 p-1 bg-gray-200 rounded-lg text-sm"
                    onClick={() => updateQuantity(i, Number(item.quantity) - 1)}
                  >−</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    className="touch-button min-h-8 min-w-8 p-1 bg-gray-200 rounded-lg text-sm"
                    onClick={() => updateQuantity(i, Number(item.quantity) + 1)}
                  >+</button>
                  <button
                    className="touch-button min-h-8 min-w-8 p-1 bg-red-100 text-red-600 rounded-lg ml-1"
                    onClick={() => removeItem(i)}
                  >✕</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-3 mt-3 space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações..."
          className="touch-input text-sm"
          rows={2}
        />
        <div className="flex items-center justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-600">{getTotal().toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
}
