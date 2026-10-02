# أداة توليد المحتوى التسويقي بالعربي

MVP جاهز: تسجيل دخول، توليد محتوى بلهجات محلية عبر Claude API، حد شهري للباقة المجانية، ولوحة أدمن بسيطة.

## التقنيات المستخدمة
- **Next.js 14** (App Router) — الواجهة والـ backend في مشروع واحد
- **Supabase** — قاعدة بيانات Postgres + نظام تسجيل دخول جاهز (بريد/كلمة مرور)
- **Anthropic API (Claude)** — توليد المحتوى
- **Vercel** — الاستضافة

اخترت Supabase لأنه أسرع طريق تبني فيها auth + قاعدة بيانات مع RLS (صلاحيات آمنة) بدون ما تبني backend من الصفر، وهو نفس الخيار المستخدم في MenuTech فخبرتك فيه تفيدك هنا.

## خطوات الإعداد

### 1. Supabase
1. أنشئ مشروع جديد في [supabase.com](https://supabase.com)
2. من SQL Editor، شغّل محتوى ملف `supabase/schema.sql` كامل
3. من Project Settings → API خذ: `Project URL`، `anon public key`، `service_role key`
4. بعد ما تسجّل أول حساب لك في التطبيق، ارجع لجدول `profiles` في Supabase وفعّل `is_admin = true` لحسابك يدويًا

### 2. متغيرات البيئة
انسخ `.env.example` إلى `.env.local` واملأ القيم:
- مفاتيح Supabase (من الخطوة السابقة)
- `ANTHROPIC_API_KEY` (من console.anthropic.com)

### 3. التشغيل محليًا
```bash
npm install
npm run dev
```
افتح http://localhost:3000

### 4. النشر على Vercel
1. ارفع المشروع على GitHub
2. من vercel.com، Import Project واختر الريبو
3. أضف نفس متغيرات `.env.local` في Vercel → Settings → Environment Variables
4. Deploy

## الخطوات التالية المقترحة
- **الدفع الفعلي**: حاليًا حقل `plan` في `profiles` يدوي. لتفعيل اشتراك مدفوع حقيقي أضف Stripe أو Moyasar/Tap (بوابات تدعم السعودية) وحدّث `plan` تلقائيًا عبر webhook عند نجاح الدفع
- **صفحة تسعير**: صفحة تعرض الفرق بين الباقة المجانية والمدفوعة مع زر ترقية
- **تحسين توليد المحتوى**: حفظ نبرة/هوية كل تاجر (اسم المطعم، أسلوبه) عشان المخرجات تصير أكثر تخصيصًا مع الوقت
- **نشر مباشر**: ربط API لنشر المحتوى مباشرة على انستقرام/واتساب بدل النسخ اليدوي

## هيكل المشروع
```
app/
  page.jsx              الصفحة الرئيسية
  login/page.jsx         تسجيل الدخول
  signup/page.jsx         إنشاء حساب
  dashboard/page.jsx      لوحة المستخدم (توليد المحتوى)
  admin/page.jsx          لوحة الأدمن
  api/generate/route.js   API التوليد + فحص حد الاشتراك
lib/
  supabaseClient.js       عميل Supabase للمتصفح
  supabaseServer.js        عميل Supabase للسيرفر (عادي + صلاحيات أدمن)
  anthropic.js             استدعاء Claude API
supabase/
  schema.sql               السكيما الكاملة لقاعدة البيانات
middleware.js               حماية /dashboard و /admin من الدخول بدون تسجيل
```
