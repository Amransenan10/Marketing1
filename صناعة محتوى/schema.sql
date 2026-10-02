-- شغّل هذا الملف كامل في Supabase SQL Editor بعد إنشاء المشروع

-- جدول الملف الشخصي لكل مستخدم (يمتد على auth.users المدمج في Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- جدول تتبع الاستخدام الشهري (لتطبيق حد الباقة المجانية)
create table public.usage_log (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  month text not null, -- بصيغة YYYY-MM
  count int not null default 0,
  unique (user_id, month)
);

-- جدول المحتوى المولّد (سجل لكل طلب، يفيد للوحة الأدمن وللمستخدم يرجع لمحتواه)
create table public.generations (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  dialect text not null,
  business_type text,
  prompt_input text not null,
  output text not null,
  created_at timestamptz not null default now()
);

-- إنشاء صف profile تلقائيًا عند تسجيل مستخدم جديد
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- تفعيل Row Level Security
alter table public.profiles enable row level security;
alter table public.usage_log enable row level security;
alter table public.generations enable row level security;

-- المستخدم يشوف ويعدّل بياناته فقط
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "read own usage" on public.usage_log
  for select using (auth.uid() = user_id);

create policy "read own generations" on public.generations
  for select using (auth.uid() = user_id);
create policy "insert own generations" on public.generations
  for insert with check (auth.uid() = user_id);

-- دالة لزيادة عداد الاستخدام الشهري بأمان (تتجنب تضارب الطلبات المتزامنة)
create function public.increment_usage(p_user_id uuid, p_month text)
returns void as $$
begin
  insert into public.usage_log (user_id, month, count)
  values (p_user_id, p_month, 1)
  on conflict (user_id, month)
  do update set count = usage_log.count + 1;
end;
$$ language plpgsql security definer;

-- ملاحظة: بعد إنشاء أول حساب أدمن، حدّث صفه يدويًا:
-- update public.profiles set is_admin = true where email = 'you@example.com';
