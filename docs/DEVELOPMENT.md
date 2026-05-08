# Desenvolvimento

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento (http://localhost:3000) |
| `npm run build` | Build para produção |
| `npm run start` | Executar produção |
| `npm run lint` | Verificar lint |

## Stack de Desenvolvimento

- **Framework:** Next.js 15.5
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Formulários:** React Hook Form + Zod
- **Ícones:** Lucide React
- **Gráficos:** Recharts

## Estrutura de Componentes

Os componentes seguem a estrutura do Next.js App Router:

```
src/app/
├── (auth)/           # Grupo de rotasauth
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/     # Grupo de rotas protegidas
│   └── dashboard/
└── layout.tsx        # Layout raiz
```

## Hooks Customizados

### useAuth

Localização: `src/hooks/useAuth.tsx`

Funcionalidades:
- `signIn(email, password)` — Login
- `signUp(email, password, name)` — Registro
- `signOut()` — Logout
- `resetPassword(email)` — Recuperação
- `user` — Usuário atual
- `loading` — Estado de carregamento

## Styles

O arquivo `src/app/globals.css` contém:
- Variáveis CSS para cores
- Configurações de tema (light/dark)
- Utilitários customizados (glass, glass-card)

## Build

Para produção:

```bash
npm run build
npm run start
```

---

*Development guide: 2026-05-07*