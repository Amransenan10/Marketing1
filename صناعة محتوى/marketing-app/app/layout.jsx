import './globals.css';

export const metadata = {
  title: 'مولّد المحتوى التسويقي الذكي - بالذكاء الاصطناعي',
  description: 'أداة احترافية لتوليد منشورات وإعلانات تسويقية بجميع اللهجات العربية لمختلف منصات التواصل الاجتماعي.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
