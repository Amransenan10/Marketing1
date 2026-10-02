import { NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabaseServer';
import { generateMarketingContent } from '@/lib/anthropic';

const FREE_LIMIT = parseInt(process.env.FREE_TIER_MONTHLY_LIMIT || '15', 10);

export async function POST(req) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'غير مصرح، سجّل الدخول أولاً' }, { status: 401 });
  }

  const { dialect, businessType, brief } = await req.json();
  if (!brief) {
    return NextResponse.json({ error: 'اكتب تفاصيل المنشور المطلوب' }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // تحقق من الباقة وحد الاستخدام
  const { data: profile } = await admin
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (profile?.plan !== 'paid') {
    const { data: usage } = await admin
      .from('usage_log')
      .select('count')
      .eq('user_id', user.id)
      .eq('month', month)
      .maybeSingle();

    if (usage && usage.count >= FREE_LIMIT) {
      return NextResponse.json(
        { error: 'وصلت حد الباقة المجانية لهذا الشهر، رقّي لباقة مدفوعة للاستمرار' },
        { status: 402 }
      );
    }
  }

  // التوليد الفعلي
  let output;
  try {
    output = await generateMarketingContent({
      dialect: dialect || 'سعودية',
      businessType: businessType || 'مطعم',
      brief,
    });
  } catch (err) {
    return NextResponse.json({ error: 'تعذّر توليد المحتوى، حاول مرة أخرى' }, { status: 500 });
  }

  // تسجيل الطلب وتحديث العداد
  await admin.from('generations').insert({
    user_id: user.id,
    dialect: dialect || 'سعودية',
    business_type: businessType || 'مطعم',
    prompt_input: brief,
    output,
  });

  await admin.rpc('increment_usage', { p_user_id: user.id, p_month: month }).catch(async () => {
    // fallback بسيط لو الدالة غير موجودة: upsert يدوي
    const { data: existing } = await admin
      .from('usage_log')
      .select('count')
      .eq('user_id', user.id)
      .eq('month', month)
      .maybeSingle();

    await admin.from('usage_log').upsert({
      user_id: user.id,
      month,
      count: (existing?.count || 0) + 1,
    });
  });

  return NextResponse.json({ output });
}
