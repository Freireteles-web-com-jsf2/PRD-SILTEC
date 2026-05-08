'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const { user, session, loading } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSupabaseSession(data.session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Autenticação</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado do useAuth</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p><strong>User:</strong> {user ? user.email : 'null'}</p>
            <p><strong>Session:</strong> {session ? 'Existe' : 'null'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sessão Direta do Supabase</h2>
          <div className="space-y-2">
            <p><strong>Session:</strong> {supabaseSession ? 'Existe' : 'null'}</p>
            <p><strong>User:</strong> {supabaseSession?.user?.email || 'null'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {typeof window !== 'undefined' 
              ? JSON.stringify(
                  Object.keys(localStorage)
                    .filter(key => key.includes('supabase') || key.includes('siltec'))
                    .reduce((obj: any, key) => {
                      obj[key] = localStorage.getItem(key);
                      return obj;
                    }, {}),
                  null,
                  2
                )
              : 'N/A'}
          </pre>
        </div>
      </div>
    </div>
  );
}
