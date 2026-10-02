import { redirect } from 'next/navigation';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabaseServer';

export default async function AdminPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const admin = createAdminSupabase();
  const { data: myProfile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!myProfile?.is_admin) {
    return (
      <div style={{ padding: 40, direction: 'rtl', fontFamily: 'system-ui' }}>
        هذه الصفحة للأدمن فقط
      </div>
    );
  }

  const { data: profiles } = await admin
    .from('profiles')
    .select('email, plan, created_at')
    .order('created_at', { ascending: false });

  const month = new Date().toISOString().slice(0, 7);
  const { data: usage } = await admin
    .from('usage_log')
    .select('user_id, count')
    .eq('month', month);

  const { count: generationsThisMonth } = await admin
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${month}-01`);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', direction: 'rtl', fontFamily: 'system-ui' }}>
      <h1>لوحة الأدمن</h1>
      <p>إجمالي المستخدمين: {profiles?.length || 0}</p>
      <p>عدد التوليدات هذا الشهر: {generationsThisMonth || 0}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr style={{ textAlign: 'right', borderBottom: '2px solid #ccc' }}>
            <th>البريد</th>
            <th>الباقة</th>
            <th>تاريخ التسجيل</th>
          </tr>
        </thead>
        <tbody>
          {profiles?.map((p) => (
            <tr key={p.email} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.email}</td>
              <td>{p.plan === 'paid' ? 'مدفوعة' : 'مجانية'}</td>
              <td>{new Date(p.created_at).toLocaleDateString('ar-SA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
