# Integrações

**Última atualização:** 2026-05-10

## Visão Geral

O projeto integra-se principalmente com Supabase como BaaS (Backend as a Service) e Vercel para deploy. Não há integrações com APIs externas de terceiros no momento.

## Supabase

### Autenticação

**Pacote:** `@supabase/ssr` v0.5.2

**Funcionalidades:**
- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Sessões via JWT em cookies httpOnly
- Refresh automático de tokens

**Implementação:**
```typescript
// src/middleware.ts
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => { /* ... */ }
    }
  }
);

const { data: { user } } = await supabase.auth.getUser();
```

**Fluxo:**
1. Usuário submete credenciais em `/login`
2. Supabase Auth valida e retorna JWT
3. JWT armazenado em cookie httpOnly
4. Middleware valida JWT em cada request
5. RLS usa JWT para extrair `church_id`

### Database (PostgreSQL)

**Pacote:** `@supabase/supabase-js` v2.47.0

**Funcionalidades:**
- Queries SQL via JavaScript client
- Row Level Security (RLS) automático
- Transações
- Realtime subscriptions (não implementado ainda)

**Implementação:**
```typescript
// src/lib/supabase.ts
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Uso em componentes
const { data, error } = await supabase
  .from('members')
  .select('*')
  .eq('church_id', churchId);
```

**Tabelas Principais:**
- `members` - Cadastro de membros
- `family_groups` - Grupos familiares
- `family_members` - Relacionamento N:N
- `member_timeline` - Histórico de eventos
- `member_roles` - Cargos e permissões
- `member_attendances` - Presença em eventos
- `events` - Eventos da igreja

**RLS Policies:**
- Todas as tabelas têm policies baseadas em `church_id`
- Função helper: `get_current_church_id()` extrai do JWT
- Isolamento total entre igrejas (multi-tenancy)

### Storage (planejado)

**Status:** Não implementado

**Uso Planejado:**
- Upload de avatares de membros
- Documentos da igreja
- Imagens de eventos

**Configuração Futura:**
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);
```

### Realtime (planejado)

**Status:** Não implementado

**Uso Planejado:**
- Notificações em tempo real
- Atualizações de presença
- Chat/mensagens

**Configuração Futura:**
```typescript
supabase
  .channel('members')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Vercel

### Deploy

**Plataforma:** Vercel Edge Network

**Funcionalidades:**
- Deploy automático via Git push
- Preview deployments para PRs
- Edge Functions para middleware
- CDN global
- Image optimization

**Configuração:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

**Variáveis de Ambiente:**
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase

### Analytics (planejado)

**Status:** Não implementado

**Uso Planejado:**
- Vercel Analytics para métricas de uso
- Web Vitals tracking
- Conversão de funis

## Integrações Futuras Planejadas

### v0.3 - Financeiro

**Possíveis Integrações:**
- Gateway de pagamento (Stripe/Mercado Pago)
- Geração de boletos
- Relatórios financeiros em PDF

### v0.4 - Comunicação

**Possíveis Integrações:**
- Envio de emails (SendGrid/Resend)
- SMS (Twilio)
- WhatsApp Business API
- Push notifications

### v0.5 - Avançado

**Possíveis Integrações:**
- Google Calendar (eventos)
- Google Maps (localização)
- Zoom/Meet (reuniões online)
- Export para Excel/PDF

## Configuração de Ambiente

### Variáveis Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis Opcionais (futuro)

```env
# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx

# Error Tracking
SENTRY_DSN=xxx

# Email
SENDGRID_API_KEY=xxx

# Pagamentos
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

## Segurança

### Chaves Públicas vs Privadas

**Públicas (NEXT_PUBLIC_):**
- Expostas no bundle do cliente
- Apenas chaves anônimas do Supabase
- Sem permissões administrativas

**Privadas:**
- Apenas no servidor
- Nunca expostas ao cliente
- Usadas em Server Actions e API Routes

### CORS

**Supabase:**
- Configurado para aceitar requests do domínio do projeto
- Anon key tem permissões limitadas por RLS

**Vercel:**
- CORS configurado automaticamente
- Edge Functions respeitam políticas de segurança

## Monitoramento

### Logs

**Supabase Dashboard:**
- Logs de queries SQL
- Logs de autenticação
- Logs de RLS policies

**Vercel Dashboard:**
- Logs de deploy
- Logs de runtime
- Logs de Edge Functions

### Métricas (planejado)

**Supabase:**
- Número de queries
- Tempo de resposta
- Uso de storage
- Conexões ativas

**Vercel:**
- Tempo de build
- Tempo de resposta
- Core Web Vitals
- Taxa de erro

## Limitações Conhecidas

### Supabase Free Tier

- 500 MB de storage
- 2 GB de transferência/mês
- 50.000 usuários ativos/mês
- Pausado após 1 semana de inatividade

### Vercel Hobby Plan

- 100 GB de bandwidth/mês
- 6.000 minutos de build/mês
- 1 usuário
- Sem proteção DDoS

## Observações

- Todas as integrações atuais são serverless
- Sem necessidade de gerenciar infraestrutura
- Escalabilidade automática via Vercel Edge
- Multi-tenancy garantido por RLS no Supabase
- Sem vendor lock-in crítico (PostgreSQL é portável)
