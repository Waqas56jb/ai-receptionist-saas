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

alter table accounts add column if not exists two_factor boolean default false;
alter table account_settings add column if not exists notifications jsonb default '{}';
alter table account_settings add column if not exists team jsonb default '[]';
alter table account_settings add column if not exists catalog jsonb default '{}';

create table if not exists email_otps (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  purpose text not null,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

create table if not exists password_resets (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  email text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

create table if not exists account_sessions (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  token_hash text not null,
  device text,
  location text,
  ip text,
  last_active timestamptz,
  created_at timestamptz default now()
);

create table if not exists login_events (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  device text,
  location text,
  ip text,
  result text,
  created_at timestamptz default now()
);

create index if not exists email_otps_account_idx on email_otps(account_id);
create index if not exists password_resets_token_idx on password_resets(token_hash);
create index if not exists account_sessions_account_idx on account_sessions(account_id);
create index if not exists login_events_account_idx on login_events(account_id, created_at desc);

alter table email_otps enable row level security;
alter table password_resets enable row level security;
alter table account_sessions enable row level security;
alter table login_events enable row level security;
revoke all on table email_otps from anon, authenticated, public;
revoke all on table password_resets from anon, authenticated, public;
revoke all on table account_sessions from anon, authenticated, public;
revoke all on table login_events from anon, authenticated, public;
grant all on table email_otps to service_role;
grant all on table password_resets to service_role;
grant all on table account_sessions to service_role;
grant all on table login_events to service_role;

alter table account_settings add column if not exists voice jsonb default '{}';

create table if not exists voice_calls (
  id text primary key,
  account_id text not null references accounts(id) on delete cascade,
  conversation_id text,
  twilio_sid text unique,
  direction text not null default 'inbound',
  from_number text,
  to_number text,
  status text default 'initiated',
  duration integer default 0,
  recording_url text,
  recording_sid text,
  outcome text,
  transferred boolean default false,
  ai_handled boolean default true,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists voice_calls_account_idx on voice_calls(account_id, created_at desc);

alter table voice_calls enable row level security;
revoke all on table voice_calls from anon, authenticated, public;
grant all on table voice_calls to service_role;
