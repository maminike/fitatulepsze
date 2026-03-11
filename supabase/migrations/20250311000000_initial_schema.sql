-- FitatuLepsze: schemat bazy danych
-- Uruchom w Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Tabela produktów (wspólna dla wszystkich użytkowników lub per-user)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Nabial', 'Mieso', 'Warzywa', 'Przekaski', 'Napoje')),
  calories numeric(6,2) not null default 0,
  protein numeric(6,2) not null default 0,
  carbs numeric(6,2) not null default 0,
  fat numeric(6,2) not null default 0,
  created_at timestamptz default now()
);

-- Tabela posiłków (per-user)
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_date date not null default current_date,
  time text not null,
  calories numeric(8,2) not null default 0,
  protein numeric(8,2) not null default 0,
  carbs numeric(8,2) not null default 0,
  fat numeric(8,2) not null default 0,
  created_at timestamptz default now()
);

-- Tabela wagi (per-user)
create table if not exists public.weight_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight numeric(5,2) not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Tabela ustawień użytkownika (profil, cele)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  calorie_goal int default 2300,
  protein_target int default 160,
  carbs_target int default 240,
  fat_target int default 75,
  water_goal_ml int default 2500,
  steps_goal int default 10000,
  updated_at timestamptz default now()
);

-- RLS (Row Level Security)
alter table public.products enable row level security;
alter table public.meals enable row level security;
alter table public.weight_history enable row level security;
alter table public.user_profiles enable row level security;

-- Products: odczyt dla wszystkich, zapis dla zalogowanych
create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Authenticated users can insert products"
  on public.products for insert with check (auth.role() = 'authenticated');

create policy "Users can update own products" on public.products
  for update using (true);

-- Meals: tylko własne dane
create policy "Users can view own meals"
  on public.meals for select using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on public.meals for insert with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on public.meals for update using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on public.meals for delete using (auth.uid() = user_id);

-- Weight: tylko własne dane
create policy "Users can view own weight"
  on public.weight_history for select using (auth.uid() = user_id);

create policy "Users can insert own weight"
  on public.weight_history for insert with check (auth.uid() = user_id);

create policy "Users can update own weight"
  on public.weight_history for update using (auth.uid() = user_id);

create policy "Users can delete own weight"
  on public.weight_history for delete using (auth.uid() = user_id);

-- Profiles: tylko własny profil
create policy "Users can view own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- Indeksy
create index if not exists idx_meals_user_date on public.meals(user_id, meal_date);
create index if not exists idx_weight_user_date on public.weight_history(user_id, date);

-- Auto-tworzenie profilu przy rejestracji
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed produktów (opcjonalnie – usuń jeśli nie chcesz danych startowych)
insert into public.products (name, category, calories, protein, carbs, fat) values
  ('Skyr naturalny', 'Nabial', 63, 11, 3.6, 0.2),
  ('Filet z kurczaka', 'Mieso', 120, 23, 0, 2.2),
  ('Papryka czerwona', 'Warzywa', 31, 1, 6, 0.3),
  ('Baton proteinowy', 'Przekaski', 190, 20, 16, 5.5),
  ('Napoj izotoniczny', 'Napoje', 22, 0, 5.3, 0),
  ('Jogurt grecki light', 'Nabial', 75, 8.6, 4.5, 2.3);
