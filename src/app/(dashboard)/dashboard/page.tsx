'use client';

import { useAuth } from '@/hooks/useAuth';

export const dynamic = 'force-dynamic';

const kpis = [
  { icon: 'groups', label: 'Total de Membros', value: '1,248', trend: '+4%', color: 'primary', colorBg: 'bg-primary/10' },
  { icon: 'trending_up', label: 'Crescimento Mensal', value: '12.4%', trend: 'Meta: 85%', color: 'secondary', colorBg: 'bg-secondary/10', borderAccent: 'border-l-4 border-secondary' },
  { icon: 'person_add', label: 'Novos Convertidos', value: '42', trend: 'Este Mês', color: 'tertiary', colorBg: 'bg-tertiary/10' },
  { icon: 'account_balance_wallet', label: 'Saldo Financeiro', value: 'R$ 48.250', trend: 'R$ 1.2k+', color: 'error', colorBg: 'bg-error/10' },
];

const activities = [
  { initials: 'JS', name: 'João Silva', action: 'Inscrição novo membro', category: 'Secretaria', categoryColor: 'bg-primary/10 text-primary', time: 'Hoje, 14:30', status: 'Concluído', statusColor: 'text-secondary' },
  { initials: 'MA', name: 'Maria Alves', action: 'Lançamento de Dízimo R$ 500', category: 'Tesouraria', categoryColor: 'bg-secondary/10 text-secondary', time: 'Hoje, 10:15', status: 'Concluído', statusColor: 'text-secondary' },
  { initials: 'RP', name: 'Roberto P.', action: 'Agendamento de Evento', category: 'Calendário', categoryColor: 'bg-tertiary/10 text-tertiary', time: 'Ontem, 16:50', status: 'Pendente', statusColor: 'text-on-surface-variant' },
];

const events = [
  { day: 'DOM', date: '19', title: 'Culto de Celebração', time: '19:00h • Sede Principal' },
  { day: 'QUA', date: '22', title: 'Noite de Oração', time: '20:00h • Sala de Oração', active: true },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Pastor(a)';

  return (
    <div>
      <div className="mb-xl">
        <h2 className="font-h1 text-h1 text-primary">Bem-vindo, {firstName}</h2>
        <p className="font-body-lg text-on-surface-variant">Visão geral do seu ministério hoje.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {kpis.map((kpi, i) => (
          <div key={i} className={`col-span-12 lg:col-span-3 glass-card rounded-xl p-lg flex flex-col gap-sm ${kpi.borderAccent || ''}`}>
            <div className="flex items-center justify-between">
              <div className={`p-sm ${kpi.colorBg} rounded-lg`}>
                <span className={`material-symbols-outlined text-${kpi.color}`}>{kpi.icon}</span>
              </div>
              <span className={`text-${kpi.color} font-label-sm`}>{kpi.trend}</span>
            </div>
            <div>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">{kpi.label}</p>
              <h3 className="font-h1 text-h1 text-on-surface mt-xs">{kpi.value}</h3>
            </div>
          </div>
        ))}

        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-lg">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h4 className="font-h3 text-h3 text-on-surface">Visão Geral Financeira</h4>
              <p className="font-label-sm text-on-surface-variant">Comparativo de Dízimos vs Despesas</p>
            </div>
            <select className="bg-surface-variant/50 border-none rounded-lg font-body-md px-md py-sm outline-none cursor-pointer text-on-surface">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>

          <div className="h-64 w-full flex items-end justify-between px-md gap-md">
            {[
              { h1: 60, h2: 40 },
              { h1: 75, h2: 45 },
              { h1: 90, h2: 35 },
              { h1: 65, h2: 50 },
              { h1: 85, h2: 30, highlight: true },
              { h1: 95, h2: 40 },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-sm h-full justify-end">
                <div className={`w-full bg-primary/40 rounded-t-lg h-[${bar.h1}%] relative group`} style={{ height: `${bar.h1}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container text-label-sm p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">R$ 12k</div>
                </div>
                <div className={`w-full bg-error/40 rounded-t-lg`} style={{ height: `${bar.h2}%` }} />
                <span className="font-label-sm text-on-surface-variant">{(['JAN','FEV','MAR','ABR','MAI','JUN'] as const)[i]}</span>
              </div>
            ))}
          </div>

          <div className="mt-lg flex gap-lg justify-center border-t border-outline-variant/10 pt-md">
            <div className="flex items-center gap-xs">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-label-sm text-on-surface-variant">Dízimos/Ofertas</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-label-sm text-on-surface-variant">Despesas</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="glass-card rounded-xl p-lg">
            <div className="flex justify-between items-center mb-md">
              <h4 className="font-h3 text-h3 text-on-surface">Calendário</h4>
              <span className="font-label-sm text-primary">Maio 2026</span>
            </div>
            <div className="grid grid-cols-7 gap-sm text-center">
              {['D','S','T','Q','Q','S','S'].map((d, i) => (
                <span key={i} className="text-label-sm text-on-surface-variant opacity-50">{d}</span>
              ))}
              {[28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((n, i) => (
                <span
                  key={i}
                  className={`font-body-md p-sm ${n > 12 ? 'opacity-30' : ''} ${n === 13 ? 'bg-primary text-on-primary rounded-lg font-bold' : ''} ${n === 14 ? 'relative' : ''}`}
                >
                  {n}
                  {n === 14 && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-lg">
            <h4 className="font-h3 text-h3 text-on-surface mb-md">Próximos Cultos</h4>
            <div className="flex flex-col gap-md">
              {events.map((ev, i) => (
                <div key={i} className={`flex items-center gap-md p-sm hover:bg-surface-variant/20 rounded-lg transition-colors cursor-pointer group ${ev.active ? 'border-l-2 border-primary/40' : ''}`}>
                  <div className="flex flex-col items-center bg-surface-container-high rounded-lg p-xs min-w-[48px]">
                    <span className="text-label-sm text-secondary">{ev.day}</span>
                    <span className="font-h3 text-h3">{ev.date}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-on-surface">{ev.title}</p>
                    <p className="font-label-sm text-on-surface-variant">{ev.time}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 glass-card rounded-xl overflow-hidden">
          <div className="p-lg border-b border-outline-variant/10">
            <h4 className="font-h3 text-h3 text-on-surface">Atividades Recentes</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md">
              <thead>
                <tr className="bg-surface-container-high/50 text-on-surface-variant uppercase tracking-wider font-label-sm">
                  <th className="px-lg py-md">Usuário</th>
                  <th className="px-lg py-md">Ação</th>
                  <th className="px-lg py-md">Categoria</th>
                  <th className="px-lg py-md">Data/Hora</th>
                  <th className="px-lg py-md">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {activities.map((act, i) => (
                  <tr key={i} className="hover:bg-surface-variant/10 transition-colors">
                    <td className="px-lg py-md flex items-center gap-sm text-on-surface">
                      <div className="w-8 h-8 rounded-full bg-primary-container/40 flex items-center justify-center font-bold text-label-sm text-primary">{act.initials}</div>
                      {act.name}
                    </td>
                    <td className="px-lg py-md text-on-surface">{act.action}</td>
                    <td className="px-lg py-md">
                      <span className={`${act.categoryColor} px-sm py-xs rounded text-label-sm`}>{act.category}</span>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant">{act.time}</td>
                    <td className="px-lg py-md">
                      <span className={`flex items-center gap-xs ${act.statusColor}`}>
                        <div className={`w-2 h-2 rounded-full ${act.status === 'Concluído' ? 'bg-secondary' : 'bg-outline'}`} />
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button className="fixed bottom-margin right-margin w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50" title="Novo Registro">
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform">add</span>
      </button>
    </div>
  );
}