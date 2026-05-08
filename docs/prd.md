# Product Requirements Document (PRD)

# Siltec-Solutions | SGI
## Sistema de Gestão Integrada para Igrejas e Ministérios

---

## 1. Informações Gerais

| Campo | Valor |
|-------|-------|
| **Produto** | Siltec-Solutions |
| **Sistema** | SGI - Sistema de Gestão Integrada |
| **Versão** | 2.0.0 |
| **Status** | Planejamento Estratégico / MVP Enterprise |
| **Data** | Maio 2026 |
| **Tipo** | Plataforma SaaS Multi-Igrejas |
| **Modelo** | Web Application + Mobile Future Ready |

---

## 2. Visão Geral do Produto

O **Siltec-Solutions** é uma plataforma SaaS moderna de gestão eclesiástica desenvolvida para igrejas, ministérios e organizações religiosas.

O sistema tem como objetivo centralizar e modernizar toda a administração ministerial, oferecendo:

- Gestão de membros
- Gestão financeira
- Organização de eventos
- Controle ministerial
- Escalas de voluntários
- Relatórios gerenciais
- Comunicação interna
- Indicadores estratégicos

A plataforma foi projetada seguindo princípios modernos de:

- Escalabilidade
- Segurança
- Multi-tenancy
- Experiência do usuário
- Performance
- Governança de dados
- LGPD

---

## 3. Objetivos do Produto

### Objetivos Principais

- Modernizar a administração eclesiástica
- Centralizar informações ministeriais
- Facilitar gestão pastoral
- Melhorar comunicação interna
- Automatizar processos administrativos
- Permitir crescimento organizacional escalável
- Disponibilizar indicadores estratégicos em tempo real

---

## 4. Público-Alvo

### Primário
- Igrejas Evangélicas
- Ministérios Cristãos
- Comunidades Religiosas

### Usuários do Sistema
- Pastores
- Secretários(as)
- Tesoureiros
- Líderes Ministeriais
- Administradores
- Voluntários
- Membros

---

## 5. Modelo de Negócio

### Plataforma SaaS Multi-Tenant

Cada igreja possuirá:

- Ambiente isolado
- Dados independentes
- Usuários independentes
- Configurações próprias
- Planos de assinatura

---

## 6. Arquitetura Tecnológica

### 6.1 Frontend

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 15+ |
| **Linguagem** | TypeScript |
| **Renderização** | SSR + Server Components |
| **Estilização** | Tailwind CSS |
| **UI Components** | Shadcn/UI |
| **Animações** | Framer Motion |
| **Ícones** | Lucide React |
| **Gerenciamento de Estado** | Zustand |
| **Data Fetching** | TanStack Query |
| **Formulários** | React Hook Form + Zod |
| **Tabelas** | TanStack Table |
| **Gráficos** | Recharts |

### 6.2 Backend

| Categoria | Tecnologia |
|-----------|------------|
| **Backend as a Service** | Supabase |
| **Banco de Dados** | PostgreSQL |
| **Autenticação** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime |
| **Funções Serverless** | Edge Functions |

### 6.3 Infraestrutura

| Categoria | Tecnologia |
|-----------|------------|
| **Deploy Frontend** | Vercel |
| **Banco** | Supabase Cloud |
| **CDN** | Vercel Edge Network |
| **Monitoramento** | Sentry |
| **Logs** | Supabase Logs |

---

## 7. Arquitetura Multi-Tenant

### Estrutura Principal

Todas as tabelas principais devem possuir:

```sql
church_id UUID NOT NULL
```

### Estrutura Organizacional

```
Organizations
 └── Churches
      ├── Users
      ├── Members
      ├── Events
      ├── Departments
      ├── Financial Entries
      ├── Volunteer Schedules
      └── Reports
```

---

## 8. Controle de Acesso (RBAC)

### Roles do Sistema

| Role | Descrição |
|------|-----------|
| **Member** | Membro comum |
| **Leader** | Líder ministerial |
| **Treasurer** | Tesoureiro |
| **Admin** | Administrador |
| **Super Admin** | Administração global |

### Matriz de Permissões

| Módulo | Member | Leader | Treasurer | Admin | Super Admin |
|--------|--------|--------|-----------|-------|-------------|
| Dashboard | View | CRUD | View | CRUD | CRUD |
| Members | Own View | CRUD | View | CRUD | CRUD |
| Events | View | CRUD | View | CRUD | CRUD |
| Finance | No Access | View | CRUD | CRUD | CRUD |
| Departments | View | CRUD | View | CRUD | CRUD |
| Schedules | View | CRUD | View | CRUD | CRUD |
| Reports | View | View | CRUD | CRUD | CRUD |
| Settings | No Access | No Access | No Access | CRUD | CRUD |

---

## 9. Módulos do Sistema

### 9.1 Autenticação

#### Funcionalidades
- Login seguro
- Recuperação de senha
- Sessão persistente
- MFA (Autenticação em dois fatores)
- Controle de sessão
- Convite de usuários
- Logout global

### 9.2 Dashboard Inteligente

#### KPIs Estratégicos
- Total de membros
- Crescimento mensal
- Novos convertidos
- Total financeiro mensal
- Eventos ativos

#### Alertas
- Membros ausentes há 90 dias
- Eventos próximos
- Escalas pendentes
- Metas financeiras

#### Widgets
- Calendário
- Financeiro rápido
- Próximos cultos
- Notificações

### 9.3 Gestão de Membros

#### Cadastro Completo
- Dados pessoais
- Endereço
- Contatos
- Estado civil
- Batismo
- Conversão
- Ministérios
- Histórico ministerial

#### Recursos
- Foto/avatar
- Filtros avançados
- Exportação PDF/CSV
- Histórico de alterações
- Timeline ministerial
- Controle de presença
- Gestão familiar

### 9.4 Gestão Financeira

#### Entradas
- Dízimos
- Ofertas
- Campanhas
- Missões
- Doações

#### Saídas
- Operacional
- Manutenção
- Eventos
- Ações sociais

#### Funcionalidades
- Fluxo de caixa
- DRE
- Centros de custo
- Conciliação financeira
- Upload de comprovantes
- Relatórios gerenciais
- Auditoria financeira
- Metas financeiras
- Gráficos analíticos

#### Categorias Financeiras
- Dízimos
- Ofertas
- Missões
- Infraestrutura
- Evangelismo
- Ação Social
- Eventos
- Operacional

### 9.5 Eventos e Agenda

#### Funcionalidades
- Cadastro de eventos
- Calendário interativo
- Controle de inscrições
- Limite de vagas
- QR Code de check-in
- Eventos recorrentes
- Gestão de participantes
- Upload de mídia

### 9.6 Departamentos e Ministérios

#### Recursos
- Gestão ministerial
- Líderes
- Participantes
- Metas ministeriais
- Indicadores de engajamento
- Controle de vagas
- Comunicação interna

### 9.7 Escalas Ministeriais

#### Escalas
- Louvor
- Pregadores
- Mídia
- Infantil
- Diáconos
- Recepção

#### Recursos
- Calendário
- Confirmação de presença
- Troca de escala
- Notificações
- Histórico

### 9.8 Central de Notificações

#### Canais
- Push notifications
- E-mail
- Notificações internas
- WhatsApp (futuro)

#### Eventos de Notificação
- Escalas
- Eventos
- Financeiro
- Comunicados
- Aniversários

### 9.9 Relatórios e Analytics

#### Relatórios
- Financeiro
- Crescimento ministerial
- Presença
- Eventos
- Engajamento

#### Exportações
- PDF
- CSV
- Excel

---

## 10. Modelo de Dados Inicial

### Users

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `name` | VARCHAR | Nome completo |
| `email` | VARCHAR | E-mail |
| `phone` | VARCHAR | Telefone |
| `role` | VARCHAR | Papel no sistema |
| `status` | BOOLEAN | Ativo/Inativo |
| `created_at` | TIMESTAMP | Data de criação |

### Members

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `name` | VARCHAR | Nome completo |
| `birth_date` | DATE | Data de nascimento |
| `gender` | VARCHAR | Gênero |
| `marital_status` | VARCHAR | Estado civil |
| `phone` | VARCHAR | Telefone |
| `email` | VARCHAR | E-mail |
| `address` | TEXT | Endereço completo |
| `baptism_date` | DATE | Data do batismo |
| `conversion_date` | DATE | Data da conversão |
| `department_id` | UUID | Departamento |
| `status` | BOOLEAN | Ativo/Inativo |

### Events

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `title` | VARCHAR | Título do evento |
| `description` | TEXT | Descrição |
| `start_date` | TIMESTAMP | Data/hora início |
| `end_date` | TIMESTAMP | Data/hora fim |
| `capacity` | INTEGER | Capacidade |
| `department_id` | UUID | Departamento responsável |

### Financial Entries

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `type` | VARCHAR | Entrada/Saída |
| `category` | VARCHAR | Categoria |
| `amount` | NUMERIC | Valor |
| `description` | TEXT | Descrição |
| `created_by` | UUID | Usuário criador |
| `created_at` | TIMESTAMP | Data de criação |

### Departments

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `name` | VARCHAR | Nome do departamento |
| `leader_id` | UUID | Líder responsável |
| `capacity` | INTEGER | Capacidade |
| `status` | BOOLEAN | Ativo/Inativo |

### Volunteer Schedules

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `church_id` | UUID | Igreja associada |
| `department_id` | UUID | Departamento |
| `member_id` | UUID | Membro escalado |
| `event_id` | UUID | Evento relacionado |
| `role` | VARCHAR | Função na escala |
| `confirmed` | BOOLEAN | Confirmado |

---

## 11. Segurança

### Backend
- Row Level Security (RLS)
- JWT Authentication
- MFA
- Rate Limiting
- Logs de acesso
- Criptografia

### Infraestrutura
- HTTPS obrigatório
- Backup automático
- Disaster Recovery
- Monitoramento
- Auditoria

### Auditoria

O sistema deve registrar:

- Login
- Alterações cadastrais
- Exclusões
- Movimentações financeiras
- Alterações de permissões

---

## 12. LGPD

### Requisitos
- Consentimento explícito
- Exclusão de dados
- Exportação de dados
- Política de retenção
- Registro de consentimento

---

## 13. Requisitos Não Funcionais

### Performance
- Tempo de carregamento < 2 segundos
- Lighthouse > 90
- Lazy Loading
- Otimização de imagens

### Disponibilidade
- Uptime 99.5%
- Monitoramento contínuo
- Logs centralizados

### Compatibilidade
- Chrome
- Edge
- Firefox
- Safari
- Mobile browsers

### Responsividade
- Mobile First
- Tablet
- Desktop
- PWA Future Ready

---

## 14. UX/UI Design System

### Diretrizes Visuais

#### Estilo
- Glassmorphism
- Gradientes suaves
- Sombras leves
- Bordas arredondadas

#### Tipografia
- Manrope
- Inter

#### Navegação
- Sidebar Desktop
- Bottom Navigation Mobile

---

## 15. Estrutura de Pastas

```
src/
 ├── app/
 ├── components/
 ├── modules/
 ├── services/
 ├── hooks/
 ├── stores/
 ├── types/
 ├── lib/
 ├── utils/
 └── styles/
```

---

## 16. Roadmap do Produto

### MVP

#### Entregas
- Autenticação
- Dashboard básico
- Gestão de membros
- Eventos
- RBAC básico

### V1

#### Entregas
- Financeiro completo
- Escalas
- Relatórios
- Notificações

### V2

#### Entregas
- Aplicativo Mobile
- WhatsApp
- Analytics avançado
- Multi-filiais

### V3

#### Entregas
- Inteligência Artificial
- Automação ministerial
- Previsões financeiras
- Recomendações inteligentes

---

## 17. Diferenciais Estratégicos

- Arquitetura SaaS moderna
- Multi-Igrejas
- Mobile-first
- UX premium
- Escalabilidade enterprise
- Segurança avançada
- Gestão ministerial integrada

---

## 18. Futuras Integrações

### Planejadas
- WhatsApp API
- Mercado Pago
- Stripe
- Pix
- Google Calendar
- Outlook Calendar
- Zoom
- YouTube Live

---

## 19. Critérios de Sucesso

### Indicadores
- Tempo médio de uso
- Retenção de usuários
- Número de igrejas ativas
- Crescimento mensal
- Engajamento ministerial
- Precisão financeira

---

## 20. Considerações Finais

O **Siltec-Solutions** foi concebido como uma plataforma moderna, escalável e profissional de gestão eclesiástica.

A solução deverá atender desde pequenas congregações até grandes ministérios multi-campus, oferecendo:

- Gestão centralizada
- Segurança
- Performance
- Escalabilidade
- Excelente experiência do usuário
- Governança administrativa

O sistema deverá estar preparado para expansão futura como plataforma SaaS nacional e internacional.

---

## Créditos

**Autor:** Luciano Teles Freire  
**Documento gerado em:** Maio 2026  
**Versão:** 2.0.0  
**Status:** Planejamento Estratégico
