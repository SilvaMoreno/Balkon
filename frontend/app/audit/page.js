'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import DashboardLayout from '@/components/shared/DashboardLayout';

function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ userId: '', action: '', from: '', to: '' });

  const load = () => {
    const params = new URLSearchParams();
    if (filters.userId) params.set('userId', filters.userId);
    if (filters.action) params.set('action', filters.action);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);

    apiClient.get(`/audit?${params}`).then((r) => setLogs(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Auditoria</h1>

      <div className="bg-white border rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" placeholder="Ação" value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="touch-input text-sm" />
          <input type="date" value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="touch-input text-sm" />
          <input type="date" value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="touch-input text-sm" />
          <button onClick={load} className="touch-button bg-blue-600 text-white text-sm">
            Filtrar
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="bg-white border rounded-xl p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{log.action}</span>
              <span className="text-gray-400 text-xs">{new Date(log.createdAt).toLocaleString('pt-PT')}</span>
            </div>
            <div className="text-gray-500 mt-1">
              {log.user?.name && <span>Por: {log.user.name} | </span>}
              Entidade: {log.entityType}{log.entityId ? ` #${log.entityId.slice(0, 8)}` : ''}
            </div>
            {log.details && (
              <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">{JSON.stringify(log.details, null, 1)}</pre>
            )}
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-gray-400 py-8">Nenhum registo de auditoria</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <AuditPage />
    </DashboardLayout>
  );
}
