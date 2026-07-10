-- 物件管理アプリ用のテーブル定義
-- Supabaseの SQL Editor で実行してください

-- 物件テーブル
-- 物件名・家賃・エリア名・間取りと、登録したユーザーのIDを保持する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at を更新のたびに自動で現在時刻にするトリガー関数
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
  before update on public.properties
  for each row
  execute function public.set_updated_at();

-- RLS（行単位のアクセス制御）を有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
create policy "Users can view own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のユーザーIDでのみ物件を登録できる
create policy "Users can insert own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
