'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '📊', permission: 'dashboard:read' },
  { href: '/sales/new', label: 'Nova Venda', icon: '🛒', permission: 'sales:create' },
  { href: '/sales', label: 'Vendas', icon: '📋', permission: 'sales:read' },
  { href: '/clients', label: 'Clientes', icon: '👥', permission: 'clients:read' },
  { href: '/payments', label: 'Pagamentos', icon: '💳', permission: 'payments:read' },
  { href: '/products', label: 'Produtos', icon: '📦', permission: 'products:read' },
  { href: '/cash-closeout', label: 'Fecho de Caixa', icon: '💰', permission: 'cash-closeout:create' },
  { href: '/stock-purchases', label: 'Compras Stock', icon: '📥', permission: 'stock-purchases:create' },
  { href: '/users', label: 'Utilizadores', icon: '👤', permission: 'users:manage' },
  { href: '/audit', label: 'Auditoria', icon: '🔍', permission: 'audit:read' },
  { href: '/reports', label: 'Relatórios', icon: '📈', permission: 'dashboard:read' },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">StockControl</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {menuItems.map((item) => {
            if (!hasPermission(item.permission) && item.permission !== 'dashboard:read') return null;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base touch-button min-h-12 ${
                  active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
