-- Run once on a database created from the earlier schema.
alter table orders add column if not exists shipping numeric not null default 0;

create table if not exists admin_settings (
  id int primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at timestamptz not null default now()
);
alter table admin_settings enable row level security;
