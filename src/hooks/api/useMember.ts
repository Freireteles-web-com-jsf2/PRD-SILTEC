'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types/member';

export function useMember(id: string) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select(`
            *,
            member_roles(id, role, is_active, start_date),
            member_timeline(*),
            family_members(
              relationship,
              family_groups(id, name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setMember(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  return { member, loading, error };
}
