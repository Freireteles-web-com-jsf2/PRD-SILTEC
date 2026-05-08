'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(data.email, data.password);

      if (result.error) {
        setError(result.error.message === 'Invalid login credentials'
          ? 'E-mail ou senha inválidos'
          : result.error.message);
        setIsLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <span className="material-symbols-outlined text-on-primary text-3xl">church</span>
          </div>
          <h1 className="font-h1 text-h1 text-primary">SGI Master</h1>
          <p className="font-body-lg text-on-surface-variant mt-1">Sistema de Gestão Integrada</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="font-h2 text-h2 text-on-surface mb-6">Entrar</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg flex items-center gap-2 text-error font-body-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-label-sm text-on-surface-variant mb-1">
                E-mail
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/50 outline-none transition"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block font-label-sm text-on-surface-variant mb-1">
                Senha
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/50 outline-none transition"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-surface-container-low"
                />
                <span className="font-body-md text-on-surface-variant">Lembrar-me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-body-md text-primary hover:text-primary-fixed transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/10 text-center">
            <p className="font-body-md text-on-surface-variant">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-primary font-semibold hover:text-primary-fixed transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-label-sm text-on-surface-variant mt-6">
          © 2026 Siltec-Solutions. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}