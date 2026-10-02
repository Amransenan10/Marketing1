import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req) {
  try {
    const { dialect, businessType, brief, platform, tone } = await req.json();

    if (!brief || !brief.trim()) {
      return NextResponse.json(
        { error: 'يرجى كتابة تفاصيل أو وصف المحتوى المطلوب' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Fallback template if no API key is provided yet
    if (!apiKey || apiKey.includes('your_anthropic_api_key')) {
      const mockResult = generateMockContent(dialect, businessType, brief, platform, tone);
      return NextResponse.json({ 
        output: mockResult,
        isDemoMode: true,
        note: 'تم التوليد في الوضع التجريبي. لإرسال طلبات حقيقية لـ Claude، قم بإضافة ANTHROPIC_API_KEY في إعدادات البيئة (Vercel).'
      });
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `أنت خبير تسويق رقمي وصانع محتوى محترف للمنصات العربية.
قم بكتابة منشور تسويقي جذب بالمعلومات التالية:
- اللهجة المطلوبة: ${dialect || 'سعودية'}
- نوع النشاط: ${businessType || 'عام'}
- المنصة المستهدفة: ${platform || 'انستقرام'}
- نبرة الصوت: ${tone || 'حماسي وجذاب'}
- التفاصيل والعرض المطلوب: ${brief}

المطلوب إخراج منشور مكتمل ومصمم للتفاعل العالي ويحتوي على:
1. عنوان رئيسي يخطف الانتباه (Hook)
2. محتوى النص التسويقي مصاغ بدقة وفصاحة بـ ${dialect || 'اللهجة السعودية'}
3. دعوة واضحة لاتخاذ إجراء (Call To Action - CTA)
4. مجموعة إيموجي تناسب المحتوى
5. 5 إلى 8 هاشتاقات تسويقية ذات صلة ترند ومناسبة للمنصة

الرجاء تقديم النتيجة بتنسيق جذاب وواضح ومقروء.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0]?.text || 'لم يتم استلام نص من النموذج.';

    return NextResponse.json({ output: content });

  } catch (error) {
    console.error('API Generate Error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' },
      { status: 500 }
    );
  }
}

function generateMockContent(dialect, businessType, brief, platform, tone) {
  const d = dialect || 'سعودية';
  const b = businessType || 'المشروع';

  return `✨ **${b} - عرض خاص ما يتفوت!** ✨

${brief}

🔥 لا تفوّت الفرصة وجرب التجربة المميزة معنا اليوم! خيارات متكاملة وجودة تليق بك.

📍 **ليش تختارنا؟**
• جودة عالية وضمان لجميع الخدمات
• سرعة في التوصيل والتنفيذ
• خدمة عملاء على مدار الساعة

👉 **اطلب الحين واستمتع بالعرض قبل انتهاء الكمية!**
رابط الطلب في البايو 🔗

---
#${b.replace(/\s+/g, '_')} #${d}_تسويق #عروض_السعودية #عروض_خاصة #تسوق #جديدنا`;
}
