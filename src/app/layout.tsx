import type { Metadata } from "next";
import "./globals.css";
// ZenAudioPlayer tạm tắt theo yêu cầu (sẽ bật lại sau)

// Sửa lại thông tin SEO chuẩn cho Cổng thông tin của Chùa
export const metadata: Metadata = {
  title: "Cổng Thông Tin Điện Tử Chùa Tùng Lâm Hòa Phúc",
  description:
    "Kênh thông tin chính thức của Chùa Tùng Lâm Hòa Phúc - Lịch tu học, lễ hội, bài giảng Phật pháp và hoạt động Phật sự.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col m-0 p-0 font-sans relative" suppressHydrationWarning>
        {children}
        {/* <ZenAudioPlayer /> - Tắt tạm thời */}
      </body>
    </html>
  );
}
