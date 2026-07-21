create table if not exists accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  account_number text default '****' || floor(random() * 9999)::text,
  balance decimal(12,2) default 25000.00,
  currency text default 'USD',
  created_at timestamp with time zone default now()
);

create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('credit', 'debit')),
  amount decimal(12,2) not null,
  description text not null,
  status text default 'completed',
  created_at timestamp with time zone default now()
);

alter table accounts enable row level security;
alter table transactions enable row level security;

create policy "Users can view own account" on accounts for select using (auth.uid() = user_id);
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions (demo)" on transactions for insert with check (auth.uid() = user_id);