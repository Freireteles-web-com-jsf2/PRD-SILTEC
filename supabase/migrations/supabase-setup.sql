-- ============================================
-- SETUP SUPABASE (profiles a partir de auth.users)
-- ============================================

-- 1) Criar tabela profiles primeiro (antes da função/trigger/policies)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  role text NOT NULL DEFAULT 'member',
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Função para popular profiles automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    'member',
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (opcional, recomendado) Revogar EXECUTE para evitar acesso indevido
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 3) Trigger após inserir em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4) Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5) Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view their own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own data" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all users" ON public.profiles;

-- 6) Políticas RLS

-- Permitir que usuários vejam seus próprios dados
CREATE POLICY "Users can view their own data"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Permitir que usuários atualizem seus próprios dados
CREATE POLICY "Users can update their own data"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Permitir inserção via trigger (service_role ignora RLS)
-- (Se você usar só SECURITY DEFINER, normalmente não precisa disso,
-- mas mantive pela sua intenção original.)
CREATE POLICY "Enable insert for service role"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Permitir admins verem todos
-- (Aqui você está checando role, mas role está na tabela: para funcionar,
-- essa policy precisa estar coerente com como você define role em profiles.)
CREATE POLICY "Admins can view all users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );
  