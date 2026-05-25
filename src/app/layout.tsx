import "./globals.css";

export const metadata = {
  title: "منصة المنهج الشامل التعليمية",
  description: "نماذج وزارية، إجابات تقاويم، وملخصات شاملة مع مساعد ذكي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* هذا السطر يضمن للمتصفح قراءة الترميز بشكل سليم دون تشويه المحتوى */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased min-h-screen bg-[#070510]">
        {children}
      </body>
    </html>
  );
}
