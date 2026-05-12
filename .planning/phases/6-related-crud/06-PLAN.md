---
phase: 6-related-crud
status: planned
milestone: v0.3
context: CONTEXT.md
waves: 6
---

# Plano: Fase 6 — CRUD Tabelas Relacionadas a Membros

## Objetivo

Criar CRUDs independentes com páginas dedicadas para `family_groups`, `departments`, `events` (com check-in), e `member_roles`, com sub-menu dentro de "Membros" no sidebar.

## Waves

---

### Wave 1: Estrutura (Rotas, Sidebar, Services)

**Dependências:** Nenhuma

**Arquivos modificados:**
- `src/components/layout/Sidebar.tsx`
- `src/lib/services/family.ts` (expandir)
- `src/lib/services/departments.ts` (expandir)
- `src/lib/services/attendances.ts` (criar)
- `src/lib/services/events.ts` (criar)
- `src/lib/services/roles.ts` (criar)
- `src/hooks/api/useFamilyGroupsQuery.ts` (criar — migrar de useState para RQ)
- `src/hooks/api/useDepartmentsQuery.ts` (criar)
- `src/hooks/api/useEventsQuery.ts` (criar)
- `src/hooks/api/useAttendancesQuery.ts` (criar)
- `src/hooks/api/useRolesQuery.ts` (criar)

#### Tarefas

<Task id="w1-t1">
<description>Atualizar Sidebar com sub-menu "Membros"</description>
<read_first>
- src/components/layout/Sidebar.tsx
</read_first>
<action>
Substituir o item "Membros" no `navItems` para expandir com sub-itens. Manter os itens existentes (Dashboard, Financeiro, Eventos, Ministérios, Relatórios, Configurações). O sub-menu "Membros" deve conter:
- Membros → /membros (lista)
- Famílias → /familias
- Departamentos → /departamentos
- Eventos → /eventos
- Cargos → /cargos

O sub-menu expande ao clicar ou quando a rota atual começa com algum dos hrefs. Usar transição suave (max-height ou animate).
</action>
<acceptance_criteria>
- Sidebar renderiza sub-menu "Membros" com 5 itens
- Clicar em "/membros" navega para lista de membros
- Clicar em "/familias" navega para /familias
- Clicar em "/departamentos" navega para /departamentos
- Clicar em "/eventos" navega para /eventos
- Clicar em "/cargos" navega para /cargos
</acceptance_criteria>
</Task>

<Task id="w1-t2">
<description>Criar services layer para events, attendances e roles</description>
<read_first>
- src/lib/services/family.ts (padrão a seguir)
- src/lib/services/departments.ts (padrão a seguir)
- src/lib/services/members.ts (padrão a seguir)
- src/types/member.ts (ChurchEvent, MemberAttendance, MemberRole, Department, FamilyGroup, FamilyMember)
</read_first>
<action>
Criar:

`src/lib/services/events.ts`:
- `fetchEvents()` → ChurchEvent[] (select com .is('deleted_at', null).order('start_date', { ascending: false }))
- `fetchEvent(id)` → ChurchEvent (select single)
- `createEvent(data)` → ChurchEvent (insert + select single)
- `updateEvent(id, data)` → ChurchEvent (update + select single)
- `deleteEvent(id)` → void (soft delete: update deleted_at)

`src/lib/services/attendances.ts`:
- `fetchAttendancesByEvent(eventId)` → MemberAttendance[] (select com join members(name))
- `setAttendance(id, status)` → void (update status)
- `setAttendanceBulk(attendances: {member_id, status, event_id}[])` → void (upsert com ON CONFLICT member_id+event_id DO UPDATE status)

`src/lib/services/roles.ts`:
- `fetchRoles()` → MemberRole[] (select com join members(name))
- `assignRole(data)` → MemberRole (insert)
- `revokeRole(id)` → void (set is_active=false, revoked_at=now())
</action>
<acceptance_criteria>
- events.ts exporta fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent
- attendances.ts exporta fetchAttendancesByEvent, setAttendance, setAttendanceBulk
- roles.ts exporta fetchRoles, assignRole, revokeRole
- Cada função tem tipagem correta (ChurchEvent, MemberAttendance, MemberRole)
- handleSupabaseError usado em todos os catch
</acceptance_criteria>
</Task>

<Task id="w1-t3">
<description>Criar RQ hooks para family_groups, departments, events, attendances, roles</description>
<read_first>
- src/hooks/api/useMembersQuery.ts (padrão para RQ hooks)
- src/hooks/api/useFamilyGroups.ts (existe, mas queremos migrar para RQ)
</read_first>
<action>
Criar RQ hooks equivalentes:

`src/hooks/api/useFamilyGroupsQuery.ts`:
- `useFamilyGroups()` — useQuery com queryKey ['family_groups'], staleTime 5min
- `useCreateFamilyGroup()` — useMutation, invalida ['family_groups'] onSuccess
- `useDeleteFamilyGroup()` — useMutation, invalida ['family_groups'] onSuccess

`src/hooks/api/useDepartmentsQuery.ts`:
- `useDepartments()` — useQuery
- `useCreateDepartment()` — useMutation
- `useUpdateDepartment()` — useMutation
- `useDeleteDepartment()` — useMutation

`src/hooks/api/useEventsQuery.ts`:
- `useEvents()` — useQuery
- `useEvent(id)` — useQuery com enabled:!!id
- `useCreateEvent()` — useMutation
- `useUpdateEvent()` — useMutation
- `useDeleteEvent()` — useMutation

`src/hooks/api/useAttendancesQuery.ts`:
- `useEventAttendances(eventId)` — useQuery
- `useSetAttendance()` — useMutation, invalida ['attendances', eventId]

`src/hooks/api/useRolesQuery.ts`:
- `useRoles()` — useQuery
- `useAssignRole()` — useMutation
- `useRevokeRole()` — useMutation
</action>
<acceptance_criteria>
- Cada hook exporta funções com useQuery/useMutation
- Mutation hooks invalidam queryKeys corretas no onSuccess
- Caso de erro usa handleSupabaseError via bloco try/catch na mutationFn
</acceptance_criteria>
</Task>

---

### Wave 2: CRUD Famílias

**Dependências:** Wave 1

**Arquivos criados:**
- `src/app/(dashboard)/membros/familias/page.tsx`
- `src/app/(dashboard)/membros/familias/novo/page.tsx`
- `src/app/(dashboard)/membros/familias/[id]/page.tsx`
- `src/app/(dashboard)/membros/familias/[id]/editar/page.tsx`

#### Tarefas

<Task id="w2-t1">
<description>Criar tela de lista de grupos familiares</description>
<read_first>
- src/app/(dashboard)/membros/page.tsx (padrão de listagem)
- src/components/ui/Card.tsx
- src/hooks/api/useFamilyGroupsQuery.ts
</read_first>
<action>
Criar `src/app/(dashboard)/membros/familias/page.tsx`:
- Tabela com colunas: Nome, Líder, Membros (count), Status, Ações
- Botão "Nova Família" → /membros/familias/novo
- Cada linha com link para /membros/familias/[id] e botão editar
- Loading state com Loader2
- Empty state: "Nenhum grupo familiar cadastrado"
</action>
<acceptance_criteria>
- Lista exibe grupos familiares do banco
- Cada grupo mostra nome, líder, quantidade de membros
- Botão "Nova Família" navega para /membros/familias/novo
- Loading e empty state funcionam
</acceptance_criteria>
</Task>

<Task id="w2-t2">
<description>Criar tela de criar/editar grupo familiar</description>
<read_first>
- src/app/(dashboard)/membros/novo/page.tsx (padrão de formulário)
- src/app/(dashboard)/membros/familias/page.tsx
</read_first>
<action>
Criar `src/app/(dashboard)/membros/familias/novo/page.tsx`:
- Formulário com: Nome (required), Líder (select de membros), Descrição (textarea), Status (toggle)
- Submit → createFamilyGroup + redireciona para lista

Criar `src/app/(dashboard)/membros/familias/[id]/editar/page.tsx`:
- Mesmo formulário, pré-preenchido com dados do grupo
- Submit → updateFamilyGroup + redireciona para /membros/familias/[id]
</action>
<acceptance_criteria>
- Formulário de criar salva novo grupo no banco
- Formulário de editar carrega dados existentes e salva alterações
- Validação de nome obrigatório
- Select de líder populado com membros ativos
</acceptance_criteria>
</Task>

<Task id="w2-t3">
<description>Criar tela de detalhe do grupo familiar</description>
<read_first>
- src/app/(dashboard)/membros/[id]/page.tsx (padrão de perfil)
</read_first>
<action>
Criar `src/app/(dashboard)/membros/familias/[id]/page.tsx`:
- Card com informações do grupo (nome, líder, descrição, status)
- Lista de membros do grupo com suas relações
- Botão "Editar" → /membros/familias/[id]/editar
- Loading com Loader2
- Error state se grupo não encontrado
</action>
<acceptance_criteria>
- Página carrega dados do grupo por ID
- Lista membros vinculados com relação familiar
- Botão editar navega corretamente
- 404/error state para ID inválido
</acceptance_criteria>
</Task>

---

### Wave 3: CRUD Departamentos

**Dependências:** Wave 1

**Arquivos criados:**
- `src/app/(dashboard)/membros/departamentos/page.tsx`
- `src/app/(dashboard)/membros/departamentos/novo/page.tsx`
- `src/app/(dashboard)/membros/departamentos/[id]/page.tsx`
- `src/app/(dashboard)/membros/departamentos/[id]/editar/page.tsx`

#### Tarefas

<Task id="w3-t1">
<description>Criar tela de lista de departamentos</description>
<read_first>
- src/app/(dashboard)/membros/familias/page.tsx (padrão de listagem CRUD)
- src/hooks/api/useDepartmentsQuery.ts
</read_first>
<action>
Criar `src/app/(dashboard)/membros/departamentos/page.tsx`:
- Tabela com colunas: Nome, Líder, Descrição, Status, Ações
- Botão "Novo Departamento" → /membros/departamentos/novo
- Loading, empty state
</action>
<acceptance_criteria>
- Lista departamentos do banco
- Botão "Novo Departamento" navega corretamente
</acceptance_criteria>
</Task>

<Task id="w3-t2">
<description>Criar telas de criar/editar/visualizar departamento</description>
<read_first>
- src/app/(dashboard)/membros/familias/novo/page.tsx (padrão)
</read_first>
<action>
Criar:
- `/membros/departamentos/novo/page.tsx`: Nome (required), Líder (select de membros), Descrição
- `/membros/departamentos/[id]/editar/page.tsx`: Mesmo form pré-preenchido
- `/membros/departamentos/[id]/page.tsx`: Card com info + lista de membros do departamento
</action>
<acceptance_criteria>
- CRUD completo de departamentos funcional
- Select de líder populado com membros
- Loading e error states
</acceptance_criteria>
</Task>

---

### Wave 4: CRUD Eventos + Presença (Check-in)

**Dependências:** Wave 1

**Arquivos criados:**
- `src/app/(dashboard)/membros/eventos/page.tsx`
- `src/app/(dashboard)/membros/eventos/novo/page.tsx`
- `src/app/(dashboard)/membros/eventos/[id]/page.tsx`
- `src/app/(dashboard)/membros/eventos/[id]/editar/page.tsx`
- `src/app/(dashboard)/membros/eventos/[id]/presenca/page.tsx`

#### Tarefas

<Task id="w4-t1">
<description>Criar tela de lista de eventos</description>
<read_first>
- src/hooks/api/useEventsQuery.ts
- src/types/member.ts (ChurchEvent)
</read_first>
<action>
Criar `src/app/(dashboard)/membros/eventos/page.tsx`:
- Tabela com: Título, Tipo, Data Início, Data Fim, Status, Presença (count/total), Ações
- Botão "Novo Evento" → /membros/eventos/novo
- Ordenado por data (mais recentes primeiro)
- Badge de status (scheduled/ongoing/completed/cancelled) com cores
</action>
<acceptance_criteria>
- Lista eventos ordenados por data
- Badge de status com cores diferentes
- Botão "Novo Evento" navega para /membros/eventos/novo
</acceptance_criteria>
</Task>

<Task id="w4-t2">
<description>Criar telas de criar/editar/visualizar evento</description>
<read_first>
- src/app/(dashboard)/membros/eventos/page.tsx
</read_first>
<action>
Criar formulários de criar e editar evento:
- `/membros/eventos/novo/page.tsx`: Título (required), Tipo (select: culto, reunião, evento, celebração), Descrição, Data Início (required), Data Fim, Local, Link Online (se is_online), Capacidade
- `/membros/eventos/[id]/editar/page.tsx`: Mesmo form pré-preenchido

Criar `src/app/(dashboard)/membros/eventos/[id]/page.tsx`:
- Card com info do evento
- Badge de status
- Botões: Editar, Check-in (→ /membros/eventos/[id]/presenca)
- Resumo de presença: presentes/N total
</action>
<acceptance_criteria>
- Formulário de evento com todos os campos obrigatórios
- Evento salvo corretamente no banco
- Página de detalhe exibe info do evento + botão de check-in
</acceptance_criteria>
</Task>

<Task id="w4-t3">
<description>Criar tela de check-in/presença do evento</description>
<read_first>
- src/hooks/api/useAttendancesQuery.ts
- src/hooks/api/useMembersQuery.ts
- src/lib/services/attendances.ts
</read_first>
<action>
Criar `src/app/(dashboard)/membros/eventos/[id]/presenca/page.tsx`:
- Título: "Presença — {nome do evento}"
- Lista de todos os membros ativos da igreja
- Cada linha: Nome do membro + botões de status (Presente / Ausente / Justificado)
- Botão atualmente selecionado fica destacado (cor verde/vermelho/amarelo)
- Botão "Salvar Presença" no topo
- Loading state enquanto carrega
- Ao salvar: chama setAttendanceBulk para upsert em lote
</action>
<acceptance_criteria>
- Lista todos os membros ativos
- Cada membro tem 3 opções de status (presente, ausente, justificado)
- Status atual carregado do banco se já houver registro
- Salvamento em lote funciona via setAttendanceBulk
- Redireciona para detalhe do evento após salvar
</acceptance_criteria>
</Task>

---

### Wave 5: CRUD Cargos

**Dependências:** Wave 1

**Arquivos criados:**
- `src/app/(dashboard)/membros/cargos/page.tsx`
- `src/app/(dashboard)/membros/cargos/atribuir/page.tsx`

#### Tarefas

<Task id="w5-t1">
<description>Criar tela de lista e gerenciamento de cargos</description>
<read_first>
- src/hooks/api/useRolesQuery.ts
- src/hooks/api/useMembersQuery.ts
- src/types/member.ts (MemberRole, MemberRoleType)
</read_first>
<action>
Criar `src/app/(dashboard)/membros/cargos/page.tsx`:
- Tabela com colunas: Membro, Cargo, Departamento, Início, Fim, Status (ativo/inativo), Ações
- Filtro por status (ativos/todos)
- Botão "Atribuir Cargo" → /membros/cargos/atribuir
- Botão "Revogar" ao lado de cada cargo ativo (chama revokeRole)
</action>
<acceptance_criteria>
- Lista todos os cargos com dados do membro
- Filtro por status ativo/todos funciona
- Botão "Atribuir Cargo" navega para /membros/cargos/atribuir
- Botão "Revogar" desativa o cargo (is_active=false)
</acceptance_criteria>
</Task>

<Task id="w5-t2">
<description>Criar tela de atribuição de cargo</description>
<read_first>
- src/app/(dashboard)/membros/cargos/page.tsx
</read_first>
<action>
Criar `src/app/(dashboard)/membros/cargos/atribuir/page.tsx`:
- Select de Membro (todos ativos)
- Select de Cargo (member, leader, treasurer, admin, super_admin)
- Select de Departamento (opcional)
- Data de Início (padrão hoje)
- Data de Fim (opcional)
- Botão "Atribuir" → chama assignRole + redireciona para /membros/cargos
</action>
<acceptance_criteria>
- Formulário com todos os campos
- Atribuição salva no banco com is_active=true
- Redireciona para lista de cargos após sucesso
</acceptance_criteria>
</Task>

---

### Wave 6: Integração e Polish

**Dependências:** Waves 2-5

#### Tarefas

<Task id="w6-t1">
<description>Integrar CRUDs com perfil do membro</description>
<read_first>
- src/app/(dashboard)/membros/[id]/page.tsx
- src/app/(dashboard)/membros/[id]/editar/page.tsx
</read_first>
<action>
No perfil do membro:
- Link para a família do membro → /membros/familias/[family_group_id]
- Link para o departamento do membro → /membros/departamentos/[department_id]
- Link para o cargo ativo → /membros/cargos

No formulário de editar membro:
- Link "Gerenciar Famílias" → /membros/familias
- Link "Gerenciar Departamentos" → /membros/departamentos
- Link "Gerenciar Cargos" → /membros/cargos
</action>
<acceptance_criteria>
- Perfil do membro tem links clicáveis para famílias/departamentos/cargos
- Formulário de editar tem links para gerenciamento
- Navegação cross-page funciona
</acceptance_criteria>
</Task>

<Task id="w6-t2">
<description>Verificação final (typecheck + lint)</description>
<read_first>
- (no specific file, just run tools)
</read_first>
<action>
- Rodar `npx tsc --noEmit` e corrigir erros novos
- Rodar `npm run lint` e corrigir warnings
- Verificar que todas as páginas carregam sem 400/404 no Supabase
</action>
<acceptance_criteria>
- tsc --noEmit passa sem erros novos (apenas pré-existentes)
- npm run lint sem warnings novos
- Navegação manual em cada rota não mostra erros 400 no console
</acceptance_criteria>
</Task>

## Critérios de Verificação

- [ ] Sidebar exibe sub-menu "Membros" com 5 sub-itens
- [ ] CRUD de Famílias: listar, criar, editar, visualizar, deletar
- [ ] CRUD de Departamentos: listar, criar, editar, visualizar, deletar
- [ ] CRUD de Eventos: listar, criar, editar, visualizar, deletar
- [ ] Check-in de presença funcional dentro do evento
- [ ] CRUD de Cargos: listar, atribuir, revogar
- [ ] Perfil do membro com links para entidades relacionadas
- [ ] tsc --noEmit sem erros novos
- [ ] Navegação e dados reais do Supabase (sem 400)

## Must Haves

1. CRUD de grupos familiares (list + form + detail)
2. CRUD de departamentos (list + form + detail)
3. CRUD de eventos com check-in de presença
4. Gerenciamento de cargos (list + assign + revoke)
5. Sidebar com sub-menu "Membros"
6. Integração cross-page (links do perfil para entidades)
