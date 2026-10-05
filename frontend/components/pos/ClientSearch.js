'use client';
import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/api-client';

export default function ClientSearch({ onSelect, selectedId, selectedName }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/clients?search=${encodeURIComponent(query)}`);
        setResults(res.data);
        setShow(true);
      } catch {}
      setLoading(false);
    }, 300);
  }, [query]);

  const handleSelect = (client) => {
    onSelect(client.id, client.name);
    setQuery(client.name);
    setShow(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Cliente</label>
      {selectedName && !show ? (
        <div className="flex items-center justify-between touch-input py-2">
          <span className="font-medium">{selectedName}</span>
          <button className="text-red-500 text-sm" onClick={() => { onSelect(null, ''); setQuery(''); }}>
            Alterar
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShow(true)}
          placeholder="Pesquisar cliente..."
          className="touch-input"
          autoComplete="off"
        />
      )}

      {show && results.length > 0 && (
        <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
          {results.map((c) => (
            <button
              key={c.id}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-0"
              onClick={() => handleSelect(c)}
            >
              <div className="font-medium">{c.name}</div>
              {c.phone && <div className="text-sm text-gray-500">{c.phone}</div>}
            </button>
          ))}
        </div>
      )}

      {show && query && !loading && results.length === 0 && (
        <div className="absolute z-20 w-full bg-white border rounded-xl shadow-lg mt-1 p-4 text-center text-gray-500">
          <p>Cliente não encontrado</p>
          <button className="text-blue-600 font-medium mt-1" onClick={() => {
            onSelect('new', query);
            setShow(false);
          }}>
            Criar "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
