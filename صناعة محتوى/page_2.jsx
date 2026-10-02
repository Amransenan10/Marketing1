'use client';
import { useState } from 'react';

export default function DashboardPage() {
  const [dialect, setDialect] = useState('سعودية');
  const [businessType, setBusinessType] = useState('مطعم');
  const [brief, setBrief] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dialect, businessType, brief }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'صار خطأ غير متوقع');
      return;
    }
    setOutput(data.output);
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', direction: 'rtl', fontFamily: 'system-ui' }}>
      <h1>توليد محتوى تسويقي</h1>
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          اللهجة
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} style={{ width: '100%' }}>
            <option value="سعودية">سعودية</option>
            <option value="خليجية">خليجية عامة</option>
            <option value="مصرية">مصرية</option>
            <option value="فصحى">فصحى مبسطة</option>
          </select>
        </label>
        <label>
          نوع النشاط
          <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          وصف المنشور المطلوب
          <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={4}
            placeholder="مثال: عرض خصم 20% على وجبات نهاية الأسبوع" style={{ width: '100%' }} required />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '...جارِ التوليد' : 'ولّد المحتوى'}
        </button>
      </form>

      {output && (
        <div style={{ marginTop: 24, whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 16, borderRadius: 8 }}>
          {output}
        </div>
      )}
    </div>
  );
}
