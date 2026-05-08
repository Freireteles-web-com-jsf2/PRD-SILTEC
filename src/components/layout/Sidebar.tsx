'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'group', label: 'Membros', href: '/membros' },
  { icon: 'payments', label: 'Financeiro', href: '/financeiro' },
  { icon: 'event', label: 'Eventos', href: '/eventos' },
  { icon: 'church', label: 'Ministérios', href: '/ministerios' },
  { icon: 'assessment', label: 'Relatórios', href: '/relatorios' },
  { icon: 'settings', label: 'Configurações', href: '/configuracoes' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 flex flex-col glass-sidebar z-50">
      <div className="flex flex-col h-full py-xl">
        <div className="px-lg mb-xl flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">church</span>
          </div>
          <div>
            <h1 className="font-h2 text-h2 font-bold text-primary leading-none">SGI Master</h1>
            <p className="font-label-sm text-on-surface-variant">Gestão Eclesiástica</p>
          </div>
        </div>

        <nav className="flex-1 px-md flex flex-col gap-unit">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-md font-body-md transition-all
                  ${isActive
                    ? 'bg-primary/30 text-primary border-l-4 border-primary px-lg py-md rounded-r-xl'
                    : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary px-lg py-md rounded-xl'
                  }
                `}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-md">
          <button className="w-full mb-md bg-primary text-on-primary font-bold py-md rounded-xl active:scale-95 transition-transform">
            Novo Registro
          </button>
          <button className="w-full flex items-center gap-md text-error px-lg py-md hover:bg-error/10 rounded-xl transition-all">
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}