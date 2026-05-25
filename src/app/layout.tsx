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
      <body>{children}</body>
    </html>
  );
}
