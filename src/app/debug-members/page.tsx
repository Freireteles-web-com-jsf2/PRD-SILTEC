'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function DebugMembersPage() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      const info: any = {};
      
      // 1. Check user metadata
      info.userMetadata = user?.user_metadata;
      info.userId = user?.id;
      
      // 2. Check JWT
      const { data: { session } } = await supabase.auth.getSession();
      info.jwtClaims = session?.access_token ? JSON.parse(atob(session.access_token.split('.')[1])) : 'No session';

      // 3. Try to fetch members without filters
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, name, church_id');
      
      info.membersCount = members?.length || 0;
      info.membersError = membersError;
      info.sampleMembers = members?.slice(0, 3);

      setDebugInfo(info);
    };

    check();
  }, [user]);

  return (
    <div className="p-xl space-y-md font-mono text-sm">
      <h1 className="text-h2 text-primary">Debug Members Sync</h1>
      <pre className="bg-surface-container p-lg rounded-xl overflow-auto max-h-[600px]">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="p-lg bg-surface-variant/30 rounded-xl space-y-md">
        <h2 className="font-bold">Análise do Problema:</h2>
        <p>
          Se <strong>membersCount</strong> for 0 mas você vê dados no Supabase Dashboard, o problema é quase certamente o <strong>RLS (Row Level Security)</strong>.
        </p>
        <p>
          A política RLS atual exige que o <code>church_id</code> do membro seja igual ao <code>church_id</code> do seu usuário.
        </p>
        <p>
          <strong>Solução Recomendada:</strong> Atualize o campo <code>church_id</code> na tabela <code>members</code> para o valor que aparece em <code>jwtClaims.church_id</code> (se existir) ou vice-versa.
        </p>
      </div>
    </div>
  );
}
