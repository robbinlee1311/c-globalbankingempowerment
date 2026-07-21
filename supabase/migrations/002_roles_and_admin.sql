create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'staff', 'user')) default 'user',
  full_name text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can update all profiles" on profiles for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'user', new.raw_user_meta_data->>'full_name');
  
  insert into public.accounts (user_id, balance)
  values (new.id, 25000.00);
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "Users can view own account" on accounts;
drop policy if exists "Users can insert own transactions (demo)" on transactions;

create policy "Users and staff can view own account" on accounts for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

create policy "Users can view own transactions" on transactions for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'staff'))
);

create policy "Users can insert own transactions (demo)" on transactions for insert with check (auth.uid() = user_id);

create policy "Admin full access accounts" on accounts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin full access transactions" on transactions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);