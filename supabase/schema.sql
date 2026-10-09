create table products (
  id int primary key default 1 check (id = 1),
  price numeric not null default 250 check (price >= 0),
  sale_price numeric check (sale_price >= 0),
  discount_active boolean not null default false,
  in_stock boolean not null default true
);
insert into products default values on conflict do nothing;

create table planner_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  position int not null default 0
);

create table videos (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  url text not null,
  position int not null default 0
);

create table orders (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  phone text not null,
  whatsapp text not null,
  address text not null,
  city text not null,
  notes text,
  quantity int not null check (quantity between 1 and 10),
  unit_price numeric not null,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);
create index orders_created_at_idx on orders (created_at desc);

-- Row level security with no policies: only the server (service role) can read or write.
alter table products enable row level security;
alter table planner_images enable row level security;
alter table videos enable row level security;
alter table orders enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do nothing;

create table admin_settings (
  id int primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at timestamptz not null default now()
);
alter table admin_settings enable row level security;
