'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types/member';

interface UseMembersProps {
  search?: string;
  status?: boolean | 'all';
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

const DEBOUNCE_MS = 400;

export function useMembers({ search, status, departmentId, page = 1, pageSize = 50 }: UseMembersProps = {}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setMembers([]);
        setTotal(0);
        return;
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

      const { data, error: fetchError, count } = await query
        .order('name')
        .range(from, to);

      if (fetchError) throw fetchError;
      if (mountedRef.current) {
        setMembers(data || []);
        setTotal(count ?? 0);
      }
    } catch (err: any) {
      console.error('Erro ao buscar membros:', err);
      if (mountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [search, status, departmentId, page, pageSize]);

  useEffect(() => {
    mountedRef.current = true;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const debounceDelay = search && search.trim() ? DEBOUNCE_MS : 0;
    debounceRef.current = setTimeout(() => {
      fetchMembers();
    }, debounceDelay);

    return () => {
      mountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchMembers, search]);

  return { members, loading, error, total, page, pageSize, refresh: fetchMembers };
}