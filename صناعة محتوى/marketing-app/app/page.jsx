'use client';

import { useState } from 'react';

export default function HomePage() {
  const [dialect, setDialect] = useState('سعودية');
  const [businessType, setBusinessType] = useState('مطعم وكافيه');
  const [platform, setPlatform] = useState('انستقرام');
  const [tone, setTone] = useState('حماسي ومحفز');
  const [brief, setBrief] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');

  const quickIdeas = [
    'خصم 20% لمشتركي نهاية الأسبوع بمناسبة الافتتاح',
    'منتج جديد حصري لفترة محدودة بخصم خاص',
    'مسابقة تفاعلية مع هدايا وجوائز للمتابعين',
    'عرض اشتري واحد واحصل على الثاني مجاناً',
    'خدمة التوصيل السريع مجاناً للطلبات فوق 100 ريال'
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!brief.trim()) {
      setError('الرجاء إدخال تفاصيل المنشور أو العرض المطلوب');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setDemoNotice('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialect, businessType, brief, platform, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التوليد');
      }

      setOutput(data.output);
      if (data.isDemoMode) {
        setDemoNotice(data.note);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Top Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '14px',
          color: '#c084fc',
          marginBottom: '16px'
        }}>
          ⚡ النسخة المباشرة (بدون برمجيات معقدة)
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', lineHeight: '1.2' }}>
          مولّد المحتوى التسويقي <span className="gradient-text">بالذكاء الاصطناعي</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>
          صمّم منشورات إعلانية وتكتيكات تسويقية جذابة بلهجتك المحلية ولمختلف منصات التواصل بثوانٍ.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Input Form Panel */}
        <section className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              
              {/* Dialect */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  💬 اللهجة المطلوبة
                </label>
                <select 
                  className="form-select" 
                  value={dialect} 
                  onChange={(e) => setDialect(e.target.value)}
                >
                  <option value="سعودية">سعودية 🇸🇦</option>
                  <option value="إماراتية">إماراتية 🇦🇪</option>
                  <option value="كويتية">كويتية 🇰🇼</option>
                  <option value="مصرية">مصرية 🇪🇬</option>
                  <option value="شامية">شاميّة 🇸🇾🇱🇧</option>
                  <option value="فصحى مبسطة">فصحى تسويقية 📖</option>
                </select>
              </div>

              {/* Business Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  🏬 نوع النشاط التجاري
                </label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="مثل: مطعم، متجر ملابس، عيادة..."
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>

              {/* Platform */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  📱 المنصة المستهدفة
                </label>
                <select 
                  className="form-select" 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="انستقرام">انستقرام Instagram</option>
                  <option value="تويتر X">تويتر (X)</option>
                  <option value="تيك توك">تيك توك TikTok</option>
                  <option value="واتساب">واتساب الأعمال</option>
                  <option value="سناب شات">سناب شات Snapchat</option>
                </select>
              </div>

              {/* Tone */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  🎭 نبرة الصوت
                </label>
                <select 
                  className="form-select" 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="حماسي ومحفز">حماسي وعالي الطاقة 🔥</option>
                  <option value="فكاهي ومرح">مرح وفكاهي 😄</option>
                  <option value="احترافي ورسمي">احترافي ورسمي 💼</option>
                  <option value="عاطفي ومؤثر">عاطفي ومؤثر ❤️</option>
                  <option value="مباشر ومقنع">مباشر وإقناعي 🎯</option>
                </select>
              </div>
            </div>

            {/* Brief Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '600', fontSize: '14px' }}>
                  ✍️ التفاصيل أو الفكرة المراد الترويج لها
                </label>
              </div>
              <textarea 
                className="form-textarea"
                rows={4}
                placeholder="اكتب هنا تفاصيل العرض، المنتجات، المزايا، أو الخصم الذي تريد الترويج له..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />

              {/* Quick Idea Chips */}
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>أفكار سريعة:</span>
                {quickIdeas.map((idea, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    className="chip"
                    onClick={() => setBrief(idea)}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '12px 16px',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '14px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  جاري توليد المحتوى بواسطة الذكاء الاصطناعي...
                </>
              ) : (
                '🚀 توليد المحتوى التسويقي'
              )}
            </button>
          </form>
        </section>

        {/* Output Panel */}
        {output && (
          <section className="glass-panel animate-fade-in" style={{ padding: '32px', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎉 المحتوى المولّد
              </h3>
              <button 
                onClick={handleCopy}
                style={{
                  background: copied ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? '✅ تم النسخ!' : '📋 نسخ النص'}
              </button>
            </div>

            {demoNotice && (
              <div style={{
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#fde047',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                💡 {demoNotice}
              </div>
            )}

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '24px',
              borderRadius: '14px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              fontSize: '16px',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {output}
            </div>
          </section>
        )}
      </div>

      <footer style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)', fontSize: '13px' }}>
        جاهز للرفع على Vercel مباشرة 🚀 | مصمم بأعلى معايير تجربة المستخدم
      </footer>
    </main>
  );
}
