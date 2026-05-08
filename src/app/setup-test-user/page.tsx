'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function SetupTestUserPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testando conexão com Supabase...\n');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      setStatus(prev => prev + `✅ Conexão OK\n`);
      setStatus(prev => prev + `Sessão atual: ${data.session ? 'Existe' : 'Nenhuma'}\n\n`);
    } catch (err: any) {
      setStatus(prev => prev + `❌ Erro de conexão: ${err.message}\n`);
    }
    
    setLoading(false);
  };

  const createTestUser = async () => {
    setLoading(true);
    setStatus('Criando usuário de teste...\n');
    
    const testEmail = 'admin@siltec.com';
    const testPassword = 'admin123456'; // Senha mais forte
    
    try {
      // Tenta criar o usuário
      setStatus(prev => prev + `Criando usuário: ${testEmail}\n`);
      setStatus(prev => prev + `Senha: ${testPassword}\n\n`);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Admin Siltec',
          },
        }
      });

      if (error) {
        setStatus(prev => prev + `❌ Erro ao criar usuário:\n`);
        setStatus(prev => prev + `Mensagem: ${error.message}\n`);
        setStatus(prev => prev + `Status: ${error.status}\n`);
        setStatus(prev => prev + `Detalhes: ${JSON.stringify(error, null, 2)}\n\n`);
        
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          setStatus(prev => prev + `⚠️ Usuário já existe, tentando fazer login...\n\n`);
          
          // Tenta fazer login
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });
          
          if (loginError) {
            setStatus(prev => prev + `❌ Erro no login:\n`);
            setStatus(prev => prev + `Mensagem: ${loginError.message}\n`);
            setStatus(prev => prev + `Status: ${loginError.status}\n\n`);
            
            setStatus(prev => prev + `💡 Possíveis soluções:\n`);
            setStatus(prev => prev + `1. Verifique se o email foi confirmado no painel do Supabase\n`);
            setStatus(prev => prev + `2. Tente resetar a senha do usuário no painel\n`);
            setStatus(prev => prev + `3. Delete o usuário e crie novamente\n`);
          } else {
            setStatus(prev => prev + `✅ Login bem-sucedido!\n`);
            setStatus(prev => prev + `User ID: ${loginData.user?.id}\n`);
            setStatus(prev => prev + `Email: ${loginData.user?.email}\n`);
            setStatus(prev => prev + `Email confirmado: ${loginData.user?.email_confirmed_at ? 'Sim' : 'Não'}\n\n`);
            setStatus(prev => prev + `🎉 Agora você pode ir para /login e usar:\n`);
            setStatus(prev => prev + `Email: ${testEmail}\n`);
            setStatus(prev => prev + `Senha: ${testPassword}\n`);
          }
        } else {
          setStatus(prev => prev + `\n💡 Possíveis soluções:\n`);
          setStatus(prev => prev + `1. Verifique as configurações de Auth no Supabase:\n`);
          setStatus(prev => prev + `   - Authentication > Settings\n`);
          setStatus(prev => prev + `   - Verifique se "Enable email signup" está habilitado\n`);
          setStatus(prev => prev + `2. Verifique se há políticas RLS bloqueando\n`);
          setStatus(prev => prev + `3. Tente criar o usuário manualmente no painel do Supabase\n`);
        }
      } else {
        setStatus(prev => prev + `✅ Usuário criado com sucesso!\n`);
        setStatus(prev => prev + `User ID: ${data.user?.id}\n`);
        setStatus(prev => prev + `Email: ${data.user?.email}\n`);
        setStatus(prev => prev + `Email confirmado: ${data.user?.email_confirmed_at ? 'Sim' : 'Não'}\n`);
        setStatus(prev => prev + `Session: ${data.session ? 'Criada' : 'Não criada'}\n\n`);
        
        if (!data.session) {
          setStatus(prev => prev + `⚠️ IMPORTANTE: Sessão não foi criada automaticamente.\n`);
          setStatus(prev => prev + `Isso significa que a confirmação de email está habilitada.\n\n`);
          setStatus(prev => prev + `Você precisa confirmar o email no painel do Supabase:\n`);
          setStatus(prev => prev + `1. Acesse: https://supabase.com/dashboard\n`);
          setStatus(prev => prev + `2. Vá em Authentication > Users\n`);
          setStatus(prev => prev + `3. Clique no usuário ${testEmail}\n`);
          setStatus(prev => prev + `4. Clique em "Confirm email"\n\n`);
          setStatus(prev => prev + `Depois volte aqui e clique no botão novamente para testar o login.\n`);
        } else {
          setStatus(prev => prev + `🎉 Tudo pronto! Agora você pode ir para /login e usar:\n`);
          setStatus(prev => prev + `Email: ${testEmail}\n`);
          setStatus(prev => prev + `Senha: ${testPassword}\n`);
        }
      }
    } catch (err: any) {
      setStatus(prev => prev + `❌ Erro inesperado: ${err.message}\n`);
      setStatus(prev => prev + `Stack: ${err.stack}\n`);
    }
    
    setLoading(false);
  };

  const checkSupabaseConfig = () => {
    setStatus('Verificando configuração do Supabase...\n\n');
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setStatus(prev => prev + `NEXT_PUBLIC_SUPABASE_URL: ${url ? '✅ Configurado' : '❌ Ausente'}\n`);
    setStatus(prev => prev + `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? '✅ Configurado' : '❌ Ausente'}\n\n`);
    
    if (url) {
      setStatus(prev => prev + `URL: ${url}\n\n`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Setup de Usuário de Teste</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ações</h2>
          <div className="space-y-3">
            <button
              onClick={checkSupabaseConfig}
              className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg"
            >
              1. Verificar Configuração
            </button>
            
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              2. Testar Conexão
            </button>
            
            <button
              onClick={createTestUser}
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              3. Criar/Testar Usuário admin@siltec.com
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-gray-900 text-green-400 rounded-lg shadow p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{status}</pre>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h3>
          <p className="text-sm text-yellow-800">
            Se o usuário for criado mas o email não for confirmado automaticamente, você precisa:
          </p>
          <ol className="list-decimal list-inside text-sm text-yellow-800 mt-2 space-y-1">
            <li>Acessar o painel do Supabase: <a href="https://supabase.com/dashboard" target="_blank" className="underline">supabase.com/dashboard</a></li>
            <li>Ir em Authentication → Users</li>
            <li>Clicar no usuário criado</li>
            <li>Clicar em "Confirm email"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
