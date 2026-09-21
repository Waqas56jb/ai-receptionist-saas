-- Tenant schema for the AI receptionist API.
-- IDs are text so the Node API can keep acc_/kb_/conv_ prefixes.
-- RLS is enabled with no client policies: only the service-role backend can read or write.

create table if not exists accounts (
  id text primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'Owner',
  status text not null default 'Active',
  business_name text,
  industry text,
  phone text,
  plan text default 'Starter',
  blocked_reason text,
  widget_token text unique,
  last_login timestamptz,
  created_at timestamptz default now()
);

create table if not exists admins (
  id text primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists whatsapp_connections (
  account_id text primary key references accounts(id) on delete cascade,
  status text not null default 'disconnected',
  phone text,
  push_name text,
  connected_at timestamptz,
  last_seen timestamptz
);

create table if not exists knowledge_items (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  title text not null,
  category text default 'Business Info',
  body text default '',
  source text default 'Manual',
  status text default 'Active',
  file_name text,
  mime text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists conversations (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  wa_from text not null,
  wa_name text,
  channel text not null default 'whatsapp',
  status text default 'open',
  unread boolean default true,
  lead text default 'New',
  handled_by text default 'ai',
  notes jsonb default '[]',
  last_message text,
  last_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (account_id, wa_from)
);

create table if not exists messages (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  conversation_id text not null references conversations(id) on delete cascade,
  direction text not null,
  type text not null default 'text',
  body text,
  created_at timestamptz default now()
);

create index if not exists knowledge_items_account_idx on knowledge_items(account_id);
create index if not exists conversations_account_idx on conversations(account_id);
create index if not exists conversations_channel_idx on conversations(account_id, channel);
create index if not exists messages_account_day_idx on messages(account_id, created_at);
create unique index if not exists accounts_widget_token_idx on accounts(widget_token);
create unique index if not exists accounts_email_lower_idx on accounts (lower(email));
create unique index if not exists admins_email_lower_idx on admins (lower(email));

alter table accounts add column if not exists widget_token text;
alter table conversations add column if not exists channel text default 'whatsapp';
alter table conversations add column if not exists status text default 'open';
alter table conversations add column if not exists unread boolean default true;
alter table conversations add column if not exists lead text default 'New';
alter table conversations add column if not exists handled_by text default 'ai';
alter table conversations add column if not exists notes jsonb default '[]';

alter table accounts enable row level security;
alter table admins enable row level security;
alter table whatsapp_connections enable row level security;
alter table knowledge_items enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

revoke all on table accounts from anon, authenticated, public;
revoke all on table admins from anon, authenticated, public;
revoke all on table whatsapp_connections from anon, authenticated, public;
revoke all on table knowledge_items from anon, authenticated, public;
revoke all on table conversations from anon, authenticated, public;
revoke all on table messages from anon, authenticated, public;

grant all on table accounts to service_role;
grant all on table admins to service_role;
grant all on table whatsapp_connections to service_role;
grant all on table knowledge_items to service_role;
grant all on table conversations to service_role;
grant all on table messages to service_role;

alter table accounts add column if not exists website text;
alter table accounts add column if not exists address text;
alter table accounts add column if not exists country text;
alter table accounts add column if not exists timezone text;
alter table accounts add column if not exists description text;
alter table accounts add column if not exists currency text default 'USD';
alter table accounts add column if not exists hours jsonb default '[]';

alter table messages add column if not exists channel text;
alter table messages add column if not exists visitor_key text;

create table if not exists account_settings (
  account_id text primary key references accounts(id) on delete cascade,
  ai_config jsonb default '{}',
  prompts jsonb default '{}',
  prompt_versions jsonb default '[]',
  whatsapp jsonb default '{}',
  web jsonb default '{}',
  updated_at timestamptz default now()
);

create table if not exists widget_connections (
  account_id text primary key references accounts(id) on delete cascade,
  status text default 'ready',
  last_seen timestamptz,
  last_visitor text,
  created_at timestamptz default now()
);

alter table account_settings enable row level security;
alter table widget_connections enable row level security;
revoke all on table account_settings from anon, authenticated, public;
revoke all on table widget_connections from anon, authenticated, public;
grant all on table account_settings to service_role;
grant all on table widget_connections to service_role;
