'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';

function ReportsPage() {
  const [monthly, setMonthly] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    apiClient.get(`/dashboard/monthly?year=${year}`)
      .then((r) => setMonthly(r.data))
      .catch(() => {});
  }, [year]);

  const totalSales = monthly.reduce((s, m) => s + m.sales, 0);
  const totalExpenses = monthly.reduce((s, m) => s + m.expenses, 0);
  const balance = totalSales - totalExpenses;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="touch-input w-auto">
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-blue-600">Total Vendas</p>
          <p className="text-2xl font-bold text-blue-800">{totalSales.toFixed(2)}€</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-red-600">Total Gastos</p>
          <p className="text-2xl font-bold text-red-800">{totalExpenses.toFixed(2)}€</p>
        </div>
        <div className={`rounded-2xl p-4 text-center ${balance >= 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <p className={`text-sm ${balance >= 0 ? 'text-green-600' : 'text-yellow-600'}`}>Saldo</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-800' : 'text-yellow-800'}`}>
            {balance.toFixed(2)}€
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-4">
        <h2 className="font-bold text-lg mb-4">Detalhe Mensal</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Mês</th>
              <th className="py-2 text-right">Vendas</th>
              <th className="py-2 text-right">Gastos</th>
              <th className="py-2 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m) => (
              <tr key={m.month} className="border-b last:border-0">
                <td className="py-2 font-medium">{new Date(year, m.month - 1).toLocaleString('pt-PT', { month: 'long' })}</td>
                <td className="py-2 text-right text-blue-600">{m.sales.toFixed(2)}€</td>
                <td className="py-2 text-right text-red-600">{m.expenses.toFixed(2)}€</td>
                <td className={`py-2 text-right font-medium ${(m.sales - m.expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(m.sales - m.expenses).toFixed(2)}€
                </td>
              </tr>
            ))}
            {monthly.length === 0 && (
              <tr><td colSpan={4} className="text-center py-4 text-gray-400">Sem dados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ReportsPage />
    </DashboardLayout>
  );
}
