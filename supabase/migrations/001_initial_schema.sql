create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  credits integer not null default 0 check (credits >= 0),
  created_at timestamptz not null default now(),
  is_admin boolean not null default false
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('topup', 'boost_spend', 'admin_adjustment', 'refund')),
  amount integer not null,
  balance_after integer not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  amount integer not null check (amount > 0),
  gcash_reference_number text,
  screenshot_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.boost_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  service_type text not null,
  target_url text not null,
  quantity integer not null check (quantity > 0),
  credits_charged integer not null check (credits_charged > 0),
  status text not null default 'pending' check (status in ('pending','processing','completed','cancelled')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.boost_queue (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.boost_orders(id) on delete cascade,
  service_type text,
  target_url text,
  quantity integer,
  status text not null default 'queued' check (status in ('queued','in_progress','done','error')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.payment_verifications enable row level security;
alter table public.boost_orders enable row level security;
alter table public.boost_queue enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
using (public.is_admin_user());

create policy "Admins can update all profiles"
on public.profiles
for update
using (public.is_admin_user());

create policy "Users can read their transactions"
on public.transactions
for select
using (auth.uid() = user_id);

create policy "Admins can read all transactions"
on public.transactions
for select
using (public.is_admin_user());

create policy "No client writes to transactions"
on public.transactions
for all
using (false)
with check (false);

create policy "Users can insert own payment verification"
on public.payment_verifications
for insert
with check (auth.uid() = user_id);

create policy "Users can read own payment verifications"
on public.payment_verifications
for select
using (auth.uid() = user_id);

create policy "Admins can read all payment verifications"
on public.payment_verifications
for select
using (public.is_admin_user());

create policy "Admins can update payment verifications"
on public.payment_verifications
for update
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Users can insert own boost orders"
on public.boost_orders
for insert
with check (auth.uid() = user_id);

create policy "Users can read own boost orders"
on public.boost_orders
for select
using (auth.uid() = user_id);

create policy "Admins can read all boost orders"
on public.boost_orders
for select
using (public.is_admin_user());

create policy "Admins can update boost orders"
on public.boost_orders
for update
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Boost queue client inaccessible"
on public.boost_queue
for all
using (false)
with check (false);

create or replace function public.add_credits(user_id uuid, amount int, description text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
  new_balance integer;
begin
  if amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  select credits into current_balance
  from public.profiles
  where id = user_id
  for update;

  if current_balance is null then
    raise exception 'Profile not found';
  end if;

  new_balance := current_balance + amount;

  update public.profiles
  set credits = new_balance
  where id = user_id;

  insert into public.transactions(user_id, type, amount, balance_after, description)
  values (user_id, 'topup', amount, new_balance, description);
end;
$$;

create or replace function public.deduct_credits(user_id uuid, amount int, description text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance integer;
  new_balance integer;
begin
  if amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  select credits into current_balance
  from public.profiles
  where id = user_id
  for update;

  if current_balance is null then
    raise exception 'Profile not found';
  end if;

  if current_balance < amount then
    raise exception 'Insufficient credits';
  end if;

  new_balance := current_balance - amount;

  update public.profiles
  set credits = new_balance
  where id = user_id;

  insert into public.transactions(user_id, type, amount, balance_after, description)
  values (user_id, 'boost_spend', -amount, new_balance, description);
end;
$$;

create or replace function public.approve_payment(payment_id uuid, admin_user_id uuid, admin_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payment_record record;
begin
  select * into payment_record
  from public.payment_verifications
  where id = payment_id
  for update;

  if payment_record.id is null then
    raise exception 'Payment verification not found';
  end if;

  if payment_record.status = 'approved' then
    raise exception 'Payment already approved';
  end if;

  update public.payment_verifications
  set status = 'approved',
      admin_note = admin_note,
      reviewed_by = admin_user_id,
      reviewed_at = now()
  where id = payment_id;

  perform public.add_credits(payment_record.user_id, payment_record.amount, 'GCash payment approved');
end;
$$;

create or replace function public.reject_payment(payment_id uuid, admin_user_id uuid, admin_note text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payment_record record;
begin
  select * into payment_record
  from public.payment_verifications
  where id = payment_id
  for update;

  if payment_record.id is null then
    raise exception 'Payment verification not found';
  end if;

  update public.payment_verifications
  set status = 'rejected',
      admin_note = admin_note,
      reviewed_by = admin_user_id,
      reviewed_at = now()
  where id = payment_id;
end;
$$;

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, credits, is_admin)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 0, false)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_profile();

create or replace function public.enqueue_boost_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.boost_queue (order_id, service_type, target_url, quantity, status, attempts, last_error, created_at, updated_at)
  values (
    new.id,
    new.service_type,
    new.target_url,
    new.quantity,
    'queued',
    0,
    null,
    now(),
    now()
  );
  return new;
end;
$$;

create trigger after_boost_order_insert
after insert on public.boost_orders
for each row execute procedure public.enqueue_boost_order();
