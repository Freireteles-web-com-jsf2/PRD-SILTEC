# Plano da Fase 1: Autenticação e Dashboard

**Phase:** 1
**Created:** 2026-05-07
**Status:** Pronto para execução

---

## Visão Geral

| Métrica | Valor |
|---------|-------|
| **Tarefas** | 12 |
| **Requirements** | 21 |
| **Stack** | Next.js 15 + Supabase + Shadcn/UI |

---

## Tarefas

### Tarefa 1: Configuração Supabase Auth

**Tipo:** backend

**Descrição:** Configurar autenticação Supabase com e-mail e senha

**Detalhamento:**

1. Criar projeto Supabase (se não existir)
2. Habilitar provider "Email/Password" em Authentication → Providers
3. Configurar site's URL em Authentication → URL Configuration
4. Personalizar templates de e-mail (confirmação, recuperação)
5. Testar fluxo de autenticação

**Dependências:** Nenhuma

**Critérios de sucesso:**

- [ ] Provider Email/Password habilitado
- [ ] E-mail de confirmação enviado
- [ ] E-mail de recuperação enviado

---

### Tarefa 2: Hook de Autenticação

**Tipo:** frontend

**Descrição:** Criar hook useAuth para gerenciar estado de autenticação

**Detalhamento:**

1. Criar `src/hooks/useAuth.ts`
2. Implementar funções: signIn, signUp, signOut, resetPassword, getSession
3. Expor estado: user, loading, error
4. Integrar com Supabase Auth client
5. Testar em ambiente dev

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Hook retorna user correto
- [ ] Loading states funcionais
- [ ] Error handling implementado

---

### Tarefa 3: Página de Login

**Tipo:** frontend

**Descrição:** Criar página de login com design profissional

**Detalhamento:**

1. Criar `src/app/(auth)/login/page.tsx`
2. Implementar form com React Hook Form + Zod
3. Validação: e-mail válido, senha preenchida
4. Estilizar com Shadcn/UI
5. Adicionar link "Esqueci senha"
6. Adicionar link "Entrar"
7. Testar responsividade

**Dependências:** 2

**Critérios de sucesso:**

- [ ] Form valida campos
- [ ] Login com credenciais corretas redireciona
- [ ] Login com erro mostra mensagem

---

### Tarefa 4: Página de Registro (Admin)

**Tipo:** frontend

**Descrição:** Criar página de registro accessible somente para Admin

**Detalhamento:**

1. Criar `src/app/(auth)/register/page.tsx`
2. Campos: nome, e-mail, senha, confirmar senha
3. Validação de senha (mín 6 caracteres)
4. Proteger rota com middleware
5. Admin cria usuários do painel

**Dependências:** 3

**Critérios de sucesso:**

- [ ] Admin consegue criar usuário
- [ ] Erro se e-mail duplicado

---

### Tarefa 5: Recuperação de Senha

**Tipo:** frontend

**Descrição:** Implementar recuperação por código via e-mail

**Detalhamento:**

1. Criar `src/app/(auth)/forgot-password/page.tsx`
2. Criar `src/app/(auth)/reset-password/page.tsx`
3. Flow: forgot → e-mail com código → reset
4. Código expira em 15 minutos
5. Testar fluxo completo

**Dependências:** 2

**Critérios de sucesso:**

- [ ] E-mail enviado com código
- [ ] Código válido reseta senha
- [ ] Código expirado dá erro

---

### Tarefa 6: Middleware de Proteção

**Tipo:** frontend

**Descrição:** Proteger rotas autenticadas

**Detalhamento:**

1. Criar `src/middleware.ts`
2. Verificar sessão em cada requisição
3. Redirecionar não autenticados para /login
4. Allowlist rotas públicas
5. Testar proteção

**Dependências:** 2

**Critérios de sucesso:**

- [ ] Rota /dashboard protegida
- [ ] Sem sessão redireciona

---

### Tarefa 7: Layout do Dashboard

**Tipo:** frontend

**Descrição:** Criar layout base com grid responsivo

**Detalhamento:**

1. Criar `src/app/(dashboard)/layout.tsx`
2. Implementar Sidebar (futuro) ou top bar
3. Grid responsivo com CSS Grid/Tailwind
4. Header com info do usuário
5. Logout button

**Dependências:** 6

**Critérios de sucesso:**

- [ ] Layout responsivo
- [ ] Usuário logado visível

---

### Tarefa 8: Widgets de KPIs

**Tipo:** frontend

**Descrição:** Criar cards de métricas do dashboard

**Detalhamento:**

1. Criar `src/components/dashboard/KpiCard.tsx`
2. KPIs: membros total, crescimento, financeiros
3. Design: cartão com ícone, valor, tendência
4.hook para buscar dados (mock ou real)
5. Grid de 4 cards na linha 1

**Dependências:** 7

**Critérios de sucesso:**

- [ ] 4 cards exibidos
- [ ] Valores corretos
- [ ] Layout responsive

---

### Tarefa 9: Gráficos de Tendência

**Tipo:** frontend

**Descrição:** Adicionar mini gráficos ao dashboard

**Detalhamento:**

1. Configurar Recharts (do stack)
2. Criar `src/components/dashboard/TrendChart.tsx`
3. Gráficos: membros, financeiros
4. Mini tamanho (150px altura)
5. Posicionar abaixo dos KPIs

**Dependências:** 7

**Critérios de sucesso:**

- [ ] Gráficos renderizam
- [ ] Dados corretos
- [ ] Responsivos

---

### Tarefa 10: Calendário Mini

**Tipo:** frontend

**Descrição:** Calendário de eventos do mês

**Detalhamento:**

1. Criar `src/components/dashboard/MiniCalendar.tsx`
2. Mostrar mês atual
3. Destacar dias com eventos
4. Click abre detalhes
5. Estilizar minimalista

**Dependências:** 7

**Critérios de sucesso:**

- [ ] Mês exibido
- [ ] Eventos destacados
- [ ] Click funcional

---

### Tarefa 11: Activity Feed

**Tipo:** frontend

**Descrição:** Lista de atividades recentes

**Detalhamento:**

1. Criar `src/components/dashboard/ActivityFeed.tsx`
2. Listar últimas 5–10 atividades
3. Ícone por tipo
4. Data relativa ("há 2 dias")
5. Scroll se muitas条目

**Dependências:** 7

**Critérios de sucesso:**

- [ ] Lista exibida
- [ ] Ícones corretos
- [ ] Dados corretos

---

### Tarefa 12: Página Inicial Redirecionamento

**Tipo:** frontend

**Descrição:** Redirecionar para dashboard após login

**Detalhamento:**

1. Modificar página inicial `/`
2. Se autenticado → /dashboard
3. Se não → /login
4. Testar fluxo completo

**Dependências:** 6

**Critérios de sucesso:**

- [ ] Login redireciona para dashboard
- [ ] Logout redireciona para login
- [ ] Sessão persiste

---

## Onde Ejecutar

### Wave 1: Autenticação (Tarefas 1-6)

```
Tarefas: 1 → 2 → 3 → 4 → 5 → 6
Dependências: linear
```

| # | Tarefa | Status |
|---|--------|--------|
| 1 | Configuração Supabase | Pending |
| 2 | Hook useAuth | Pending |
| 3 | Página Login | Pending |
| 4 | Página Registro | Pending |
| 5 | Recuperação Senha | Pending |
| 6 | Middleware | Pending |

### Wave 2: Dashboard (Tarefas 7-12)

```
Tarefas: 7 → 8 → 9 → 10 → 11 → 12
Dependências: após 6
```

| # | Tarefa | Status |
|---|--------|--------|
| 7 | Layout Dashboard | Pending |
| 8 | KPIs | Pending |
| 9 | Gráficos | Pending |
| 10 | Calendário | Pending |
| 11 | Activity | Pending |
| 12 | Redirect | Pending |

---

## Observações

- Supabase Auth já configurado no stack
- Dados podem vir de mock ou query real
- Fazer merge com dados reais na Fase 2 (Members)

---

*Plano criado: 2026-05-07*
*Última atualização: 2026-05-07*