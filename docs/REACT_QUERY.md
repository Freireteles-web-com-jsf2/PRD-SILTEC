# React Query - Guia de Uso

Este documento explica como usar React Query no projeto SILTEC SGI para otimização de cache e queries.

## Configuração

O React Query está configurado globalmente em `src/app/layout.tsx` através do `QueryProvider`.

### Configurações Padrão

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 minutos - dados considerados "frescos"
    gcTime: 10 * 60 * 1000,        // 10 minutos - tempo em cache
    retry: 1,                       // 1 tentativa em caso de erro
    refetchOnWindowFocus: true,     // Refetch ao focar na janela
    refetchOnReconnect: true,       // Refetch ao reconectar
  },
  mutations: {
    retry: 0,                       // Sem retry para mutations
  },
}
```

## Hooks Disponíveis

### `useMembers` - Buscar Lista de Membros

```typescript
import { useMembers } from '@/hooks/api/useMembersQuery';

function MembersPage() {
  const { members, total, loading, error, refresh } = useMembers({
    search: 'João',
    status: true,
    page: 1,
    pageSize: 50,
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {members.map(member => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
```

**Parâmetros:**
- `search?: string` - Busca por nome
- `status?: boolean | 'all'` - Filtro de status
- `departmentId?: string` - Filtro por departamento
- `role?: string` - Filtro por cargo
- `page?: number` - Página atual (padrão: 1)
- `pageSize?: number` - Itens por página (padrão: 50)

**Retorno:**
- `members: Member[]` - Lista de membros
- `total: number` - Total de registros
- `loading: boolean` - Estado de carregamento
- `error: string | null` - Mensagem de erro
- `refresh: () => void` - Função para refetch manual

### `useMember` - Buscar Membro Específico

```typescript
import { useMember } from '@/hooks/api/useMembersQuery';

function MemberProfile({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!member) return <div>Membro não encontrado</div>;

  return <div>{member.name}</div>;
}
```

### `useCreateMember` - Criar Novo Membro

```typescript
import { useCreateMember } from '@/hooks/api/useMembersQuery';

function CreateMemberForm() {
  const createMember = useCreateMember();

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      await createMember.mutateAsync(data);
      // Sucesso - cache é invalidado automaticamente
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button disabled={createMember.isPending}>
        {createMember.isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

### `useUpdateMember` - Atualizar Membro

```typescript
import { useUpdateMember } from '@/hooks/api/useMembersQuery';

function EditMemberForm({ id }: { id: string }) {
  const updateMember = useUpdateMember();

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      await updateMember.mutateAsync({ id, data });
      // Sucesso - cache é invalidado automaticamente
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### `useDeleteMember` - Deletar Membro (Soft Delete)

```typescript
import { useDeleteMember } from '@/hooks/api/useMembersQuery';

function DeleteMemberButton({ id }: { id: string }) {
  const deleteMember = useDeleteMember();

  const handleDelete = async () => {
    if (confirm('Tem certeza?')) {
      try {
        await deleteMember.mutateAsync(id);
        // Sucesso - cache é invalidado automaticamente
      } catch (error) {
        // Tratar erro
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteMember.isPending}>
      {deleteMember.isPending ? 'Deletando...' : 'Deletar'}
    </button>
  );
}
```

## Vantagens do React Query

### 1. Cache Automático
- Dados são armazenados em cache por 10 minutos
- Reduz chamadas desnecessárias ao servidor
- Melhora performance e UX

### 2. Refetch Inteligente
- Atualiza dados ao focar na janela
- Atualiza dados ao reconectar à internet
- Refetch automático em intervalos configuráveis

### 3. Invalidação de Cache
- Mutations invalidam automaticamente queries relacionadas
- Garante que dados sempre estejam atualizados
- Sem necessidade de gerenciamento manual

### 4. Estados de Loading e Error
- Estados de loading, error e success gerenciados automaticamente
- Retry automático em caso de erro
- Feedback visual consistente

### 5. Otimistic Updates (Futuro)
- Atualizar UI antes da resposta do servidor
- Rollback automático em caso de erro
- UX mais responsiva

## Comparação: Antes vs Depois

### Antes (sem React Query)

```typescript
const [members, setMembers] = useState<Member[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('members').select();
      if (error) throw error;
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchMembers();
}, []);
```

**Problemas:**
- Sem cache - refetch toda vez
- Gerenciamento manual de estados
- Sem retry automático
- Sem invalidação de cache

### Depois (com React Query)

```typescript
const { members, loading, error } = useMembers();
```

**Benefícios:**
- ✅ Cache automático (5 min stale, 10 min gc)
- ✅ Estados gerenciados automaticamente
- ✅ Retry automático (1 tentativa)
- ✅ Invalidação automática após mutations
- ✅ Refetch ao focar/reconectar
- ✅ Código mais limpo e conciso

## Boas Práticas

### 1. Use Query Keys Consistentes
```typescript
// ✅ Bom - estruturado e previsível
['members', { search, status, page }]

// ❌ Ruim - inconsistente
['members-list', search, status]
```

### 2. Invalide Cache Após Mutations
```typescript
// Já implementado nos hooks
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['members'] });
}
```

### 3. Configure staleTime Apropriadamente
```typescript
// Dados que mudam frequentemente
staleTime: 1 * 60 * 1000 // 1 minuto

// Dados que mudam raramente
staleTime: 30 * 60 * 1000 // 30 minutos
```

### 4. Use Enabled para Queries Condicionais
```typescript
const { data } = useMember(id, {
  enabled: !!id, // Só executa se id existir
});
```

## Próximos Passos

### Implementar para Outros Módulos
- [ ] Family Groups
- [ ] Events
- [ ] Attendances
- [ ] Roles
- [ ] Timeline

### Otimizações Futuras
- [ ] Optimistic Updates
- [ ] Prefetching
- [ ] Infinite Queries (scroll infinito)
- [ ] Suspense Mode
- [ ] Devtools em desenvolvimento

## Referências

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
