"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/public/layout/Header";
import ContactSection from "@/features/home/components/ContactSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Trang quét mã QR tra cứu bài vị dùng giao diện tối giản độc lập, không kẹp Header/Footer dài
  const isStandaloneLookup = pathname?.startsWith("/tra-cuu-bai-vi");

  if (isStandaloneLookup) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* scrolled={true}: header luôn có nền, dễ đọc trên trang con */}
      <Header scrolled={true} />

      <main className="flex-1">{children}</main>

      <ContactSection />
    </div>
  );
}
