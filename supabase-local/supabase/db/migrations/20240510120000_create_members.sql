-- Simple members table for local testing
create extension if not exists "uuid-ossp";

create table public.members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  status boolean not null default true,
  department_id uuid,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security for local tests
alter table public.members enable row level security;

-- Allow selection of non‑deleted rows
create policy members_select on public.members for select using (deleted_at is null);

-- Allow inserts (no extra checks)
create policy members_insert on public.members for insert with check (true);

-- Allow updates (no extra checks)
create policy members_update on public.members for update using (true) with check (true);

-- Disallow hard deletes (soft delete only)
create policy members_delete on public.members for delete using (false);\n  id uuid primary key default uuid_generate_v4(),\n  name text not null,\n  email text unique not null,\n  status boolean not null default true,\n  department_id uuid,\n  deleted_at timestamptz,\n  created_at timestamptz default now(),\n  updated_at timestamptz default now()\n);\n\n-- Enable uuid-ossp extension if not present\ncreate extension if not exists uuid-ossp;\n\n-- RLS policies\ncreate policy members_select on public.members for select using ( auth.uid() = user_id() and deleted_at is null );\ncreate policy members_insert on public.members for insert with check ( auth.uid() = user_id() );\ncreate policy members_update on public.members for update using ( auth.uid() = user_id() ) with check ( auth.uid() = user_id() );\ncreate policy members_delete on public.members for delete using ( false );\n
