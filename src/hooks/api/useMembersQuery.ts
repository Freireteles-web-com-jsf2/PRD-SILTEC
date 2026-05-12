'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types/member';
import { handleSupabaseError, AuthenticationError } from '@/lib/errors';

interface UseMembersProps {
  search?: string;
  status?: boolean | 'all';
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

interface MembersResponse {
  members: Member[];
  total: number;
}

/**
 * Hook para buscar membros com React Query
 *
 * Implementa cache automático, refetch inteligente e otimizações de performance.
 */
export function useMembers({
  search = '',
  status = 'all',
  departmentId,
  page = 1,
  pageSize = 50
}: UseMembersProps = {}) {
  const queryClient = useQueryClient();

  const fetchMembers = async (): Promise<MembersResponse> => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return { members: [], total: 0 };
    }

      let query = supabase
      .from('members')
      .select(`
        *,
        member_roles(role, is_active)
      `, { count: 'exact' })
      .is('deleted_at', null);

    if (search) {
      const sanitized = search.trim();
      if (sanitized) {
        query = query.ilike('name', `%${sanitized}%`);
      }
    }

    if (status !== 'all' && status !== undefined) {
      query = query.eq('status', status);
    }

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('name')
      .range(from, to);

    if (error) {
      throw handleSupabaseError(error);
    }

    return {
      members: data || [],
      total: count ?? 0,
    };
  };

  const queryKey = ['members', { search, status, departmentId, page, pageSize }];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
  });

  return {
    members: data?.members || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    page,
    pageSize,
    refresh: refetch,
  };
}

/**
 * Hook para criar um novo membro
 */
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberData: Partial<Member>) => {
      const { data, error } = await supabase
        .from('members')
        .insert(memberData)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries de membros para refetch
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

/**
 * Hook para atualizar um membro
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      const { data: updated, error } = await supabase
        .from('members')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw handleSupabaseError(error);
      }

      return updated;
    },
    onSuccess: (data) => {
      // Invalidar queries de membros
      queryClient.invalidateQueries({ queryKey: ['members'] });
      // Invalidar query específica do membro
      queryClient.invalidateQueries({ queryKey: ['member', data.id] });
    },
  });
}

/**
 * Hook para deletar (soft delete) um membro
 */
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('members')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw handleSupabaseError(error);
      }

      return id;
    },
    onSuccess: () => {
      // Invalidar todas as queries de membros
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

/**
 * Hook para buscar um membro específico por ID
 */
export function useMember(id: string) {
  const fetchMember = async (): Promise<Member> => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new AuthenticationError();
    }

    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        member_roles(id, role, is_active, start_date, end_date, department_id, granted_by),
        member_timeline(*),
        family_members(
          id, relationship, is_primary_contact, notes,
          family_groups(id, name)
        ),
        member_attendances(
          id, event_id, status, check_in_time, check_out_time, created_at
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['member', id],
    queryFn: fetchMember,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    member: data,
    loading: isLoading,
    error: error?.message || null,
  };
}
