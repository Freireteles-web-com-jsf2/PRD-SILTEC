'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <header className="h-20 sticky top-0 right-0 w-full z-40 glass-topbar border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-margin h-full">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-full pl-12 pr-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 text-body-md outline-none placeholder:text-on-surface-variant/50"
              placeholder="Pesquisar..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-lg ml-xl">
          <div className="flex items-center gap-sm">
            <button className="material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full cursor-pointer transition-colors" title="Notificações">notifications</button>
            <button className="material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full cursor-pointer transition-colors" title="Ajuda">help</button>
            <Link href="/perfil" className="material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full cursor-pointer transition-colors" title="Conta">account_circle</Link>
          </div>
        </div>
      </div>
    </header>
  );
}