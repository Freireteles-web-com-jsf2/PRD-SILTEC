'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema, MemberFormData } from '@/types/memberSchema';
import { useMember } from '@/hooks/api/useMember';
import { useFamilyGroups } from '@/hooks/api/useFamilyGroups';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Users, 
  Plus,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function EditMemberPage() {
  const router = useRouter();
  const { id } = useParams();
  const { member, loading: loadingMember, error: memberError } = useMember(id as string);
  const { groups, createGroup, loading: loadingGroups } = useFamilyGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewFamily, setShowNewFamily] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: true,
      gender: 'prefer_not_to_say',
      marital_status: 'single'
    }
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        birth_date: member.birth_date || '',
        gender: member.gender || 'prefer_not_to_say',
        marital_status: member.marital_status || 'single',
        address: member.address || '',
        address_city: member.address_city || '',
        address_state: member.address_state || '',
        baptism_date: member.baptism_date || '',
        conversion_date: member.conversion_date || '',
        status: member.status,
        family_group_id: member.family_members?.[0]?.family_groups?.id || '',
        new_family_group_name: '',
        role: member.member_roles?.find(r => r.is_active)?.role || '',
        role_start_date: member.member_roles?.find(r => r.is_active)?.start_date?.split('T')[0] || '',
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: MemberFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let familyGroupId = data.family_group_id;

      if (showNewFamily && data.new_family_group_name) {
        const newGroup = await createGroup(data.new_family_group_name);
        familyGroupId = newGroup.id;
      }

      const { new_family_group_name, family_group_id, role, role_start_date, ...memberData } = data;

      const { error: updateError } = await supabase
        .from('members')
        .update({ ...memberData })
        .eq('id', id);

      if (updateError) throw updateError;

      if (familyGroupId) {
        const { data: existing, error: fetchError } = await supabase
          .from('family_members')
          .select('id')
          .eq('member_id', id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (existing) {
          const { error: updateError } = await supabase
            .from('family_members')
            .update({ family_group_id: familyGroupId })
            .eq('id', existing.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('family_members')
            .insert([{ member_id: id, family_group_id: familyGroupId, relationship: 'membro' }]);
          if (insertError) throw insertError;
        }
      }

      if (role) {
        const activeRole = member?.member_roles?.find(r => r.is_active);
        if (activeRole) {
          const { error: roleUpdateError } = await supabase
            .from('member_roles')
            .update({ role, start_date: role_start_date || activeRole.start_date })
            .eq('id', activeRole.id);
          if (roleUpdateError) throw roleUpdateError;
        } else {
          const { error: roleInsertError } = await supabase
            .from('member_roles')
            .insert([{
              member_id: id,
              role,
              is_active: true,
              start_date: role_start_date || new Date().toISOString().split('T')[0],
            }]);
          if (roleInsertError) throw roleInsertError;
        }
      }

      router.push(`/membros/${id}`);
    } catch (error: any) {
      const errorMessage = error?.message || error?.error_description || 'Erro desconhecido ao salvar.';
      console.error('Erro ao atualizar:', errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingMember) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (memberError || !member) {
    return (
      <div className="text-center py-2xl">
        <h3 className="text-h3 text-error">Erro ao carregar membro</h3>
        <p className="text-on-surface-variant">{memberError || 'Membro não encontrado'}</p>
        <Link href="/membros" className="text-primary hover:underline mt-md inline-block">Voltar para listagem</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-xl pb-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <Link href={`/membros/${id}`} className="p-sm hover:bg-surface-variant/30 rounded-lg text-on-surface-variant transition-all">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="font-h1 text-h1 text-primary">Editar Membro</h2>
            <p className="font-body-lg text-on-surface-variant">Editando: {member.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex items-center gap-sm bg-primary text-on-primary px-xl py-md rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Salvar Alterações
        </button>
      </div>

      {error && (
        <div className="p-md bg-error/10 border border-error/30 rounded-lg flex items-center gap-md text-error font-body-md">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        <div className="md:col-span-2 space-y-xl">
          <Card title="Dados Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Nome Completo *</label>
                <input 
                  {...register('name')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  placeholder="Ex: João Silva Santos"
                />
                {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">E-mail</label>
                <input 
                  {...register('email')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  placeholder="joao@exemplo.com"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Telefone / WhatsApp</label>
                <input 
                  {...register('phone')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Data de Nascimento</label>
                <input 
                  type="date"
                  {...register('birth_date')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Gênero</label>
                <select 
                  {...register('gender')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                  <option value="prefer_not_to_say">Prefiro não dizer</option>
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Estado Civil</label>
                <select 
                  {...register('marital_status')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                >
                  <option value="single">Solteiro(a)</option>
                  <option value="married">Casado(a)</option>
                  <option value="divorced">Divorciado(a)</option>
                  <option value="widowed">Viúvo(a)</option>
                  <option value="separated">Separado(a)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Endereço">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Logradouro completo</label>
                <input 
                  {...register('address')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  placeholder="Rua, Número, Complemento, Bairro"
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant">Cidade</label>
                  <input 
                    {...register('address_city')}
                    className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant">Estado (UF)</label>
                  <input 
                    {...register('address_state')}
                    className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Vida Ministerial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Data de Conversão</label>
                <input 
                  type="date"
                  {...register('conversion_date')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Data de Batismo</label>
                <input 
                  type="date"
                  {...register('baptism_date')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-xl">
          <Card title="Foto de Perfil">
            <div className="flex flex-col items-center gap-md py-md">
              <div className="w-32 h-32 rounded-full bg-surface-variant/30 border-2 border-dashed border-outline-variant/50 flex items-center justify-center text-on-surface-variant overflow-hidden relative group">
                <User size={48} className="opacity-20" />
                <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                  Alterar Foto
                </button>
              </div>
              <p className="text-center font-label-sm text-on-surface-variant">JPG, PNG ou WebP. Máx 2MB.</p>
            </div>
          </Card>

          <Card 
            title="Vínculo Familiar"
            headerAction={
              <button 
                onClick={() => setShowNewFamily(!showNewFamily)}
                className="text-primary hover:bg-primary/10 p-xs rounded transition-all"
              >
                {showNewFamily ? <Users size={20} /> : <Plus size={20} />}
              </button>
            }
          >
            <div className="space-y-md">
              {!showNewFamily ? (
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant">Grupo Existente</label>
                  <select 
                    {...register('family_group_id')}
                    className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  >
                    <option value="">Nenhum / Solo</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              ) : (
                <div className="space-y-xs animate-in slide-in-from-top duration-300">
                  <label className="font-label-sm text-primary">Novo Nome de Família</label>
                  <input 
                    {...register('new_family_group_name')}
                    className="w-full bg-primary/5 border border-primary/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                    placeholder="Ex: Família Silva"
                  />
                </div>
              )}
              <p className="font-body-md text-on-surface-variant italic">
                {showNewFamily 
                  ? "Um novo grupo familiar será criado e este membro será vinculado como participante."
                  : "Vincule este membro a uma família já cadastrada no sistema."}
              </p>
            </div>
          </Card>

          <Card title="Cargos Atuais">
            <div className="space-y-md">
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Cargo</label>
                <div className="relative">
                  <Award size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <select 
                    {...register('role')}
                    className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg pl-xl pr-md py-md text-on-surface focus:border-primary outline-none transition-all"
                  >
                    <option value="">Membro (padrão)</option>
                    <option value="leader">Líder</option>
                    <option value="treasurer">Tesoureiro</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant">Data de Início</label>
                <input 
                  type="date"
                  {...register('role_start_date')}
                  className="w-full bg-surface-variant/20 border border-outline-variant/20 rounded-lg px-md py-md text-on-surface focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </Card>

          <Card title="Status do Registro">
             <div className="flex items-center justify-between">
                <span className="font-body-md text-on-surface">Cadastro Ativo</span>
                <button 
                  onClick={() => setValue('status', !watch('status'))}
                  className={`w-12 h-6 rounded-full transition-all relative ${watch('status') ? 'bg-secondary' : 'bg-outline-variant'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${watch('status') ? 'left-7' : 'left-1'}`} />
                </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}