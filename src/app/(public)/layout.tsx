"use client";

import Header from "@/components/public/layout/Header";
import ContactSection from "@/components/public/home/ContactSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* scrolled={true}: header luôn có nền, dễ đọc trên trang con */}
      <Header scrolled={true} />

      <main className="flex-1 pt-[72px]">{children}</main>

      <ContactSection />
    </div>
  );
}
