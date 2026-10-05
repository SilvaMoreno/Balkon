import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  clientId: null,
  clientName: '',
  items: [],
  notes: '',

  setClient: (id, name) => set({ clientId: id, clientName: name }),

  addItem: (item) => {
    const items = get().items;
    const existing = items.find((i) => i.productName === item.productName);
    if (existing) {
      set({
        items: items.map((i) =>
          i.productName === item.productName
            ? { ...i, quantity: Number(i.quantity) + Number(item.quantity || 1) }
            : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, quantity: Number(item.quantity || 1) }] });
    }
  },

  updateQuantity: (index, qty) => {
    const items = get().items;
    if (qty <= 0) {
      set({ items: items.filter((_, i) => i !== index) });
    } else {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], quantity: qty };
      set({ items: newItems });
    }
  },

  removeItem: (index) => {
    set({ items: get().items.filter((_, i) => i !== index) });
  },

  clearCart: () => set({ clientId: null, clientName: '', items: [], notes: '' }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + Number(i.unitPrice || 0) * Number(i.quantity || 0), 0);
  },
}));
