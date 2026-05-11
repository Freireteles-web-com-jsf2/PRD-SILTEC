'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Provider do React Query
 *
 * Configura o cliente de queries com estratégias de cache otimizadas
 * para a aplicação.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo que os dados são considerados "frescos" (5 minutos)
            staleTime: 5 * 60 * 1000,
            // Tempo que os dados ficam em cache (10 minutos)
            gcTime: 10 * 60 * 1000,
            // Retry automático em caso de erro
            retry: 1,
            // Refetch ao focar na janela
            refetchOnWindowFocus: true,
            // Refetch ao reconectar
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry automático para mutations
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
