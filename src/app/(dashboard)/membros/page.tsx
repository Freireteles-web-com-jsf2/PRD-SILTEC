'use client';

import { useState } from 'react';
import { useMembers } from '@/hooks/api/useMembersQuery';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Phone, 
  ChevronRight,
  ChevronLeft,
  UserX
} from 'lucide-react';
import Link from 'next/link';

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | 'all'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { members, loading, error, total } = useMembers({ search, status: statusFilter, page, pageSize });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Membros</h2>
          <p className="font-body-lg text-on-surface-variant">Gerencie todos os membros da sua comunidade.</p>
        </div>
        <Link 
          href="/membros/novo"
          className="flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <UserPlus size={20} />
          Novo Membro
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-center glass-card p-md rounded-xl">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome..."
            className="w-full bg-surface-variant/30 border-none rounded-lg pl-xl pr-md py-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <select 
            className="w-full bg-surface-variant/30 border-none rounded-lg px-md py-md text-on-surface outline-none cursor-pointer"
            value={statusFilter.toString()}
            onChange={(e) => {
              const val = e.target.value;
              setStatusFilter(val === 'all' ? 'all' : val === 'true');
            }}
          >
            <option value="all">Todos os Status</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors px-md py-md">
            <Filter size={20} />
            Mais Filtros
          </button>
        </div>
      </div>

      <Card className="!p-0 border-none shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 text-on-surface-variant uppercase tracking-wider font-label-sm border-b border-outline-variant/10">
                <th className="px-lg py-md w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-outline bg-transparent" />
                </th>
                <th className="px-lg py-md">Membro</th>
                <th className="px-lg py-md">Contato</th>
                <th className="px-lg py-md">Cargo / Depto</th>
                <th className="px-lg py-md">Status</th>
                <th className="px-lg py-md text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-lg py-xl bg-surface-variant/5"></td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-on-surface-variant italic">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-surface-variant/10 transition-colors group">
                    <td className="px-lg py-md">
                      <input type="checkbox" className="w-4 h-4 rounded border-outline bg-transparent" />
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container/40 flex items-center justify-center font-bold text-primary overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors">{member.name}</p>
                          <p className="font-label-sm text-on-surface-variant lowercase italic">@{member.name.split(' ')[0].toLowerCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="space-y-xs">
                        <div className="flex items-center gap-xs text-on-surface-variant font-body-md">
                          <Mail size={14} className="text-primary/60" />
                          {member.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-xs text-on-surface-variant font-body-md">
                          <Phone size={14} className="text-secondary/60" />
                          {member.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="space-y-xs">
                        <Badge variant="secondary">
                          {member.member_roles?.find(r => r.is_active)?.role || 'Membro'}
                        </Badge>
                        <p className="text-label-sm text-on-surface-variant px-xs">{member.departments?.name || 'Geral'}</p>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <div className={`w-2 h-2 rounded-full ${member.status ? 'bg-secondary shadow-[0_0_8px_rgba(128,255,128,0.5)]' : 'bg-outline'}`} />
                        <span className={`font-body-md ${member.status ? 'text-secondary' : 'text-on-surface-variant'}`}>
                          {member.status ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/membros/${member.id}`}
                          className="p-sm hover:bg-primary/20 rounded-lg text-primary transition-colors"
                          title="Ver Perfil"
                        >
                          <ChevronRight size={20} />
                        </Link>
                        <button 
                          className="p-sm hover:bg-error/20 rounded-lg text-error transition-colors"
                          title="Inativar"
                        >
                          <UserX size={20} />
                        </button>
                      </div>
                      <div className="group-hover:hidden">
                         <MoreHorizontal className="text-on-surface-variant ml-auto" size={20} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-md py-md">
          <span className="text-label-sm text-on-surface-variant">
            Mostrando {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} de {total}
          </span>
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-sm hover:bg-surface-variant/30 rounded-lg text-on-surface-variant disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-label-sm text-on-surface-variant px-sm">{page}/{totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-sm hover:bg-surface-variant/30 rounded-lg text-on-surface-variant disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
