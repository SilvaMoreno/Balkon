'use client';
import { useState } from 'react';

export default function TouchNumpad({ value, onChange, onConfirm, label }) {
  const [input, setInput] = useState(value || '');

  const handleKey = (k) => {
    if (k === 'backspace') {
      setInput((p) => p.slice(0, -1));
    } else if (k === 'clear') {
      setInput('');
    } else if (k === '.') {
      if (!input.includes('.')) setInput((p) => p + '.');
    } else {
      setInput((p) => p + k);
    }
  };

  const handleConfirm = () => {
    const num = parseFloat(input) || 0;
    onChange?.(num);
    onConfirm?.(num);
    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="text-right text-3xl font-bold mb-4 min-h-[48px] px-2 bg-gray-50 rounded-xl py-2">
        {input || '0'}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="touch-numpad-key" onClick={() => handleKey(String(n))}>
            {n}
          </button>
        ))}
        <button className="touch-numpad-key" onClick={() => handleKey('.')}>.</button>
        <button className="touch-numpad-key" onClick={() => handleKey('0')}>0</button>
        <button className="touch-numpad-key" onClick={() => handleKey('clear')}>C</button>
        <button className="touch-numpad-key" onClick={() => handleKey('backspace')}>⌫</button>
        <button className="touch-button bg-blue-600 text-white col-span-3" onClick={handleConfirm}>
          Confirmar
        </button>
      </div>
    </div>
  );
}
