import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Noto_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fallback 1: Playfair Display – dùng cho tiêu đề trang Phật giáo khi UTM Niagara/ClassizismAntiqua chưa load
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Fallback 2: Noto Serif – dùng cho body text khi UTM Avo chưa load (hỗ trợ đầy đủ tiếng Việt)
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  display: "swap",
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
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col m-0 p-0"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
