# Convenções de Código

**Última atualização:** 2026-05-10

## Linguagem e Localização

### Idioma do Código

- **Código:** Inglês (variáveis, funções, tipos)
- **UI/Mensagens:** Português do Brasil
- **Comentários:** Português do Brasil
- **Documentação:** Português do Brasil

```typescript
// ✅ Correto
interface Member {
  name: string;
  email: string;
}

// ❌ Evitar
interface Membro {
  nome: string;
  email: string;
}
```

### Mensagens de Interface

```typescript
// ✅ Correto - UI em português
<h2>Membros</h2>
<p>Gerencie todos os membros da sua comunidade.</p>

// Comentários em português
// Busca membros ativos da igreja
const activeMembers = members.filter(m => m.status);
```

## Nomenclatura

### Arquivos

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes React | PascalCase.tsx | `Sidebar.tsx`, `TopBar.tsx` |
| Páginas Next.js | lowercase | `page.tsx`, `layout.tsx` |
| Utilitários | camelCase.ts | `supabase.ts`, `utils.ts` |
| Tipos | camelCase.ts | `member.ts`, `memberSchema.ts` |
| Hooks | camelCase.ts | `useMembers.ts`, `useAuth.ts` |

### Componentes

```typescript
// ✅ PascalCase para componentes
export default function MembersPage() { }
export function Sidebar() { }
export const Card = () => { }
```

### Funções e Variáveis

```typescript
// ✅ camelCase para funções e variáveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
function createBrowserClient() { }
const navItems = [];
```

### Tipos e Interfaces

```typescript
// ✅ PascalCase para tipos
export interface Member { }
export type GenderType = 'male' | 'female';
export type MaritalStatusType = 'single' | 'married';
```

### Constantes

```typescript
// ✅ camelCase (não SCREAMING_CASE)
const pageSize = 50;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Exceção: Enums ou constantes verdadeiramente imutáveis
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
```

## Estrutura de Componentes

### Client Components

```typescript
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Constantes no topo
const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
];

// Componente
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside>
      {/* JSX */}
    </aside>
  );
}
```

### Server Components

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Async por padrão
export default async function MembersPage() {
  const supabase = createServerClient(/* ... */);
  const { data: members } = await supabase.from('members').select();

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Estilização

### Tailwind CSS

**Sistema de Design Tokens:**

```typescript
// ✅ Usar tokens do design system
className="bg-primary text-on-primary"
className="text-on-surface-variant"
className="glass-card glass-sidebar"

// Espaçamento
className="px-lg py-md gap-md"
className="space-y-xl"

// Tipografia
className="font-h1 text-h1"
className="font-body-md"
className="font-label-sm"
```

**Ordem de Classes:**
1. Layout (flex, grid, position)
2. Dimensões (w-, h-)
3. Espaçamento (p-, m-, gap-)
4. Cores (bg-, text-)
5. Tipografia (font-, text-)
6. Bordas (border-, rounded-)
7. Efeitos (shadow-, opacity-)
8. Transições (transition-, hover:, active:)

```typescript
// ✅ Ordem organizada
className="flex items-center gap-md w-full px-lg py-md bg-primary text-on-primary rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
```

### Classes Condicionais

```typescript
// ✅ Template literals para condicionais
className={`
  flex items-center gap-md font-body-md transition-all
  ${isActive
    ? 'bg-primary/30 text-primary border-l-4 border-primary'
    : 'text-on-surface-variant hover:bg-surface-variant/30'
  }
`}

// ✅ Alternativa com clsx
import clsx from 'clsx';

className={clsx(
  'flex items-center gap-md',
  isActive && 'bg-primary/30 text-primary',
  !isActive && 'text-on-surface-variant'
)}
```

## TypeScript

### Tipagem Estrita

```typescript
// ✅ Sempre tipar parâmetros e retornos
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

// ✅ Tipar props de componentes
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) { }
```

### Tipos vs Interfaces

```typescript
// ✅ Interface para objetos e componentes
interface Member {
  id: string;
  name: string;
}

// ✅ Type para unions, primitivos, utilitários
type GenderType = 'male' | 'female' | 'other';
type Status = boolean | 'all';
```

### Nullability

```typescript
// ✅ Usar null para valores opcionais do banco
interface Member {
  email: string | null;
  phone: string | null;
}

// ✅ Usar undefined para valores opcionais de props
interface CardProps {
  title: string;
  subtitle?: string; // undefined se não fornecido
}
```

## Imports

### Ordem de Imports

```typescript
// 1. React e Next.js
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 2. Bibliotecas externas
import { Search, Filter } from 'lucide-react';

// 3. Imports internos (com alias @/)
import { useMembers } from '@/hooks/api/useMembers';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// 4. Tipos
import type { Member } from '@/types/member';

// 5. Estilos (se houver)
import './styles.css';
```

### Alias de Importação

```typescript
// ✅ Usar alias @/ configurado
import { supabase } from '@/lib/supabase';
import { Member } from '@/types/member';

// ❌ Evitar caminhos relativos longos
import { supabase } from '../../../lib/supabase';
```

## Hooks Customizados

### Nomenclatura

```typescript
// ✅ Prefixo "use"
export function useMembers() { }
export function useAuth() { }
export function useDashboard() { }
```

### Estrutura

```typescript
export function useMembers(params: MembersParams) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Lógica de fetch
  }, [params]);

  return { members, loading, error };
}
```

## Supabase

### Queries

```typescript
// ✅ Usar select específico
const { data } = await supabase
  .from('members')
  .select('id, name, email, phone')
  .eq('church_id', churchId);

// ✅ Usar tipos
const { data } = await supabase
  .from('members')
  .select<'*', Member>('*');
```

### Error Handling

```typescript
// ✅ Sempre verificar erros
const { data, error } = await supabase
  .from('members')
  .select();

if (error) {
  console.error('Erro ao buscar membros:', error);
  throw error;
}
```

## Formulários

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ✅ Schema Zod
const memberSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').nullable(),
});

type MemberFormData = z.infer<typeof memberSchema>;

// ✅ Usar no componente
const { register, handleSubmit, formState: { errors } } = useForm<MemberFormData>({
  resolver: zodResolver(memberSchema),
});
```

## Comentários

### Quando Comentar

```typescript
// ✅ Comentar lógica complexa
// Calcula a idade baseada na data de nascimento
const age = calculateAge(member.birth_date);

// ✅ Comentar decisões não óbvias
// Usamos church_id do JWT ao invés de prop para segurança
const churchId = getChurchIdFromToken();

// ❌ Evitar comentários óbvios
// Define o nome
const name = 'João';
```

### JSDoc para Funções Públicas

```typescript
/**
 * Busca membros da igreja com filtros opcionais
 * @param churchId - ID da igreja
 * @param filters - Filtros de busca (nome, status, etc)
 * @returns Lista de membros filtrados
 */
export async function fetchMembers(
  churchId: string,
  filters?: MemberFilters
): Promise<Member[]> {
  // implementação
}
```

## Tratamento de Erros

### Try-Catch

```typescript
// ✅ Try-catch em operações assíncronas
try {
  const { data, error } = await supabase.from('members').insert(member);
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Erro ao criar membro:', error);
  throw error;
}
```

### Error Boundaries (planejado)

```typescript
// Futuro: Error boundaries para componentes
<ErrorBoundary fallback={<ErrorPage />}>
  <MembersPage />
</ErrorBoundary>
```

## Performance

### Memoização

```typescript
// ✅ useMemo para cálculos pesados
const filteredMembers = useMemo(() => {
  return members.filter(m => m.name.includes(search));
}, [members, search]);

// ✅ useCallback para funções passadas como props
const handleDelete = useCallback((id: string) => {
  deleteMember(id);
}, []);
```

### Lazy Loading

```typescript
// ✅ Dynamic imports para componentes pesados
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Carregando...</p>,
});
```

## Acessibilidade

### Semântica HTML

```typescript
// ✅ Usar tags semânticas
<nav>
  <Link href="/dashboard">Dashboard</Link>
</nav>

<main>
  <h1>Membros</h1>
</main>
```

### ARIA Labels

```typescript
// ✅ Labels para ícones e botões
<button aria-label="Fechar menu">
  <X size={20} />
</button>
```

## Segurança

### Variáveis de Ambiente

```typescript
// ✅ Prefixo NEXT_PUBLIC_ para variáveis do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ✅ Sem prefixo para variáveis do servidor
const secretKey = process.env.SECRET_KEY;
```

### Sanitização

```typescript
// ✅ Nunca inserir HTML diretamente
// React escapa automaticamente
<p>{userInput}</p>

// ❌ Evitar dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## Git

### Commits

```
feat: adiciona filtro de status na lista de membros
fix: corrige bug no cálculo de idade
refactor: reorganiza estrutura de componentes
docs: atualiza README com instruções de setup
style: ajusta espaçamento no Sidebar
```

### Branches

```
feature/member-timeline
fix/auth-redirect
refactor/dashboard-layout
```
