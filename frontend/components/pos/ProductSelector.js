'use client';
import { useState, useRef, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function ProductSelector({ onAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [price, setPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/products?search=${encodeURIComponent(query)}`);
        setResults(res.data);
        setShowResults(true);
      } catch {}
      setLoading(false);
    }, 300);
  }, [query]);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setQuery(product.name);
    setShowResults(false);
    setPrice(0);
    setShowNumpad(true);
  };

  const handleCustomProduct = () => {
    setSelectedProduct({ name: query, id: null });
    setShowResults(false);
    setPrice(0);
    setShowNumpad(true);
  };

  const confirmAdd = () => {
    if (!selectedProduct || price <= 0) return;
    onAdd({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      unitPrice: price,
    });
    setQuery('');
    setSelectedProduct(null);
    setPrice(0);
    setShowNumpad(false);
  };

  return (
    <div>
      {!showNumpad ? (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Digitar ou pesquisar produto..."
            className="touch-input text-lg"
            autoComplete="off"
          />

          {showResults && results.length > 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
              {results.map((p) => (
                <button
                  key={p.id}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-0"
                  onClick={() => selectProduct(p)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {showResults && query && !loading && results.length === 0 && (
            <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg mt-1 p-4">
              <button
                className="w-full text-center py-3 text-blue-600 font-medium"
                onClick={handleCustomProduct}
              >
                Registar "{query}"
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-lg">{selectedProduct?.name}</span>
            <button className="text-red-500 text-sm" onClick={() => { setShowNumpad(false); setQuery(''); }}>
              Cancelar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[0.50, 1, 2, 3, 5, 10, 20, 50, 100].map((v) => (
              <button
                key={v}
                className={`touch-button min-h-12 text-sm ${price === v ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                onClick={() => setPrice(v)}
              >
                {v.toFixed(2)}€
              </button>
            ))}
          </div>
          <input
            type="number"
            value={price || ''}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            placeholder="Preço"
            className="touch-input mb-3 text-center text-xl font-bold"
            step="0.01"
            min="0"
          />
          <button
            onClick={confirmAdd}
            disabled={price <= 0}
            className="touch-button bg-green-600 text-white w-full disabled:opacity-40"
          >
            Adicionar {price > 0 ? `${price.toFixed(2)}€` : ''}
          </button>
        </div>
      )}
    </div>
  );
}
