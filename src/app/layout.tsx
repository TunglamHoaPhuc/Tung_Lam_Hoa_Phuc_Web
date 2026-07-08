import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    // Đổi lang="en" thành lang="vi" để các trình duyệt nhận diện chính xác tiếng Việt
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 p-0">{children}</body>
    </html>
  );
}
