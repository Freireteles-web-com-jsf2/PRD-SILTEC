# Phase 4 Context: Interface do Módulo de Membros

**Phase:** 4
**Focus:** UI/UX e Integração do Módulo de Membros
**Decisions Locked:**
- **Páginas:** Listagem, Cadastro/Edição (Formulário) e Detalhes (Perfil).
- **Filtros:** Adicionar status de cargo na listagem.
- **Família:** Permitir criação de grupos familiares diretamente no formulário de cadastro de membro.
- **Ações em Massa:** Implementar seleção múltipla na tabela para ações em massa (ex: alteração de status).
- **Estética:** Manter Glassmorphism, tema escuro e componentes Shadcn/UI personalizados.
- **Tecnologia:** React Hook Form + Zod para formulários, TanStack Table para listagem, Supabase para persistência.

**Gray Areas Decided:**
- O fluxo de upload de imagem será via Supabase Storage.
- A timeline ministerial será exibida no perfil do membro.
