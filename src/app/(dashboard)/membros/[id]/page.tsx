'use client';

import { useParams } from 'next/navigation';
import { useMember } from '@/hooks/api/useMember';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Edit2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  History,
  Users,
  Award,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MemberProfilePage() {
  const { id } = useParams();
  const { member, loading, error } = useMember(id as string);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="text-center py-2xl">
        <h3 className="text-h3 text-error">Erro ao carregar membro</h3>
        <p className="text-on-surface-variant">{error || 'Membro não encontrado'}</p>
        <Link href="/membros" className="text-primary hover:underline mt-md inline-block">Voltar para listagem</Link>
      </div>
    );
  }

  const activeRole = member.member_roles?.find(r => r.is_active)?.role || 'Membro';
  const family = member.family_members?.[0];

  return (
    <div className="space-y-xl pb-2xl">
      {/* Header / Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden glass-card border-none shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-tertiary/20" />
        <div className="absolute bottom-md left-lg flex items-end gap-xl">
           <div className="w-32 h-32 rounded-full border-4 border-background bg-surface-container flex items-center justify-center font-bold text-h1 text-primary shadow-2xl overflow-hidden">
             {member.avatar_url ? (
               <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
             ) : (
               member.name.substring(0, 2).toUpperCase()
             )}
           </div>
           <div className="mb-md">
             <h2 className="font-h1 text-h1 text-on-surface leading-tight">{member.name}</h2>
             <div className="flex items-center gap-md mt-xs">
                <Badge variant="primary">{activeRole}</Badge>
                <div className="flex items-center gap-xs text-on-surface-variant font-label-sm">
                   <div className={`w-2 h-2 rounded-full ${member.status ? 'bg-secondary' : 'bg-outline'}`} />
                   {member.status ? 'Ativo' : 'Inativo'}
                </div>
             </div>
           </div>
        </div>
        <div className="absolute top-md right-md flex gap-md">
          <Link href="/membros" className="p-sm bg-background/50 hover:bg-background/80 rounded-lg text-on-surface transition-all backdrop-blur-md">
            <ArrowLeft size={20} />
          </Link>
          <Link href={`/membros/${id}/editar`} className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-bold hover:scale-105 transition-all">
            <Edit2 size={18} />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Coluna Esquerda: Informações e Contato */}
        <div className="lg:col-span-4 space-y-xl">
          <Card title="Informações de Contato">
            <div className="space-y-lg">
              <div className="flex items-center gap-md group">
                <div className="p-sm bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">E-mail</p>
                  <p className="font-body-md text-on-surface">{member.email || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-md group">
                <div className="p-sm bg-secondary/10 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Telefone</p>
                  <p className="font-body-md text-on-surface">{member.phone || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-md group">
                <div className="p-sm bg-tertiary/10 rounded-lg text-tertiary group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Endereço</p>
                  <p className="font-body-md text-on-surface">
                    {member.address ? `${member.address}, ${member.address_city}-${member.address_state}` : 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Vida Ministerial">
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm text-on-surface-variant">
                   <Calendar size={18} />
                   <span className="font-body-md">Conversão</span>
                </div>
                <span className="font-body-md font-bold text-on-surface">
                  {member.conversion_date ? format(new Date(member.conversion_date), 'dd MMM yyyy', { locale: ptBR }) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm text-on-surface-variant">
                   <ShieldCheck size={18} />
                   <span className="font-body-md">Batismo</span>
                </div>
                <span className="font-body-md font-bold text-on-surface">
                   {member.baptism_date ? format(new Date(member.baptism_date), 'dd MMM yyyy', { locale: ptBR }) : '-'}
                </span>
              </div>
              <div className="pt-md border-t border-outline-variant/10">
                <div className="flex items-center gap-sm text-on-surface-variant mb-sm">
                   <Users size={18} />
                   <span className="font-body-md">Família</span>
                </div>
                {family ? (
                  <div className="bg-surface-variant/20 p-md rounded-lg flex items-center justify-between">
                     <div>
                       <p className="font-body-md font-bold text-on-surface">{family.family_groups?.name}</p>
                       <p className="text-label-sm text-on-surface-variant">{family.relationship}</p>
                     </div>
                     <ChevronRight size={16} className="text-on-surface-variant" />
                  </div>
                ) : (
                  <p className="font-body-md text-on-surface-variant italic">Sem vínculo familiar</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Timeline e Atividades */}
        <div className="lg:col-span-8 space-y-xl">
          <Card 
            title="Linha do Tempo Ministerial" 
            subtitle="Histórico de alterações, cargos e departamentos."
            headerAction={<History size={20} className="text-primary/50" />}
          >
            <div className="relative pl-lg border-l-2 border-outline-variant/20 space-y-xl py-md">
              {member.member_timeline?.length > 0 ? (
                member.member_timeline.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                    <div>
                      <div className="flex items-center justify-between mb-xs">
                        <Badge variant={item.event_type === 'role_change' ? 'secondary' : 'tertiary'}>
                          {({
                            role_change: 'CARGO',
                            department_change: 'DEPARTAMENTO', 
                            status_change: 'STATUS',
                            observation: 'OBSERVAÇÃO'
                          } as Record<string, string>)[item.event_type] || item.event_type?.toUpperCase() || 'EVENTO'}
                        </Badge>
                        <span className="text-label-sm text-on-surface-variant">
                          {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="font-body-md text-on-surface">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-outline ring-4 ring-background" />
                  <p className="font-body-md text-on-surface-variant italic">Nenhum evento registrado na timeline.</p>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
            <Card title="Cargos Atuais">
               <div className="space-y-md">
                  {member.member_roles?.filter(r => r.is_active).map((role, i) => (
                    <div key={i} className="flex items-center gap-md p-md bg-surface-variant/10 rounded-xl">
                      <div className="p-sm bg-secondary/10 rounded-lg text-secondary">
                        <Award size={24} />
                      </div>
                      <div>
                        <p className="font-body-md font-bold text-on-surface">{role.role}</p>
                        <p className="text-label-sm text-on-surface-variant">Desde {format(new Date(role.start_date), 'dd/MM/yy')}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </Card>

            <Card title="Presença em Eventos">
               <div className="flex flex-col items-center justify-center py-xl text-center space-y-md">
                  <div className="w-20 h-20 rounded-full border-4 border-secondary/20 flex items-center justify-center">
                    <span className="text-h2 text-secondary">85%</span>
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface">Frequência Excelente</p>
                    <p className="text-label-sm text-on-surface-variant">Últimos 30 dias</p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
