'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FamilyGroup } from '@/types/member';

export function useFamilyGroups() {
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('family_groups')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      setGroups(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, error, refresh: fetchGroups, createGroup };
}
