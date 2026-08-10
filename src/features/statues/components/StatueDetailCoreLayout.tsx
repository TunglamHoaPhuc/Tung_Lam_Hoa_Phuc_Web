'use client';

import { FC, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ArrowRight, Play, Eye, BookOpen, Shield, Flame, Compass } from "lucide-react";
import { StatueItem } from "@/data/statue-data";
import { ArtisticStatueSection } from "@/features/universe/components/ArtisticStatueSection";

interface StatueDetailCoreLayoutProps {
  statue: StatueItem;
}

export const StatueDetailCoreLayout: FC<StatueDetailCoreLayoutProps> = ({ statue }) => {
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  // Sub-statue fallback list if empty
  const clusterMembers = statue.clusterMembers && statue.clusterMembers.length > 0
    ? statue.clusterMembers
    : [
        { name: 'Văn Thù Bồ Tát', slug: 'van-thu-bo-tat', imgUrl: statue.avatarUrl },
        { name: 'Phổ Hiền Bồ Tát', slug: 'pho-hien-bo-tat', imgUrl: statue.avatarUrl },
      ];

  return (
    <div className="w-full space-y-12">
      {/* ══════════════════════════════════════════════════════════════
          1. HERO BANNER CHUẨN ĐỒNG BỘ 100% VỚI TÔNG CHỈ TU HỌC (HeroBanner.tsx)
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-28 pb-12">
        {/* Ảnh nền đằng sau mờ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 blur-[3px] pointer-events-none"
          style={{
            backgroundImage: `url('${statue.imgUrl || '/images/toan-canh-chua.jpg'}')`,
          }}
        />
        {/* Hiệu ứng mờ mềm mại hòa vào nền nâu */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/50 via-[#2A1D14]/80 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          {/* Emblem Icon */}
          <div className="w-12 h-12 rounded-full bg-[#3a2718] border border-[#f2cc8f]/50 flex items-center justify-center text-[#ffde59] mb-3 shadow-[0_0_20px_rgba(242,193,78,0.5)]">
            <span className="text-2xl">☸</span>
          </div>

          {/* Title flanked by glowing lines */}
          <div className="flex items-center justify-center w-full my-4 gap-4 md:gap-8 max-w-4xl">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
            <h1
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
              className="text-4xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-widest drop-shadow-[0_0_22px_rgba(242,193,78,0.8)] whitespace-nowrap flex-shrink-0"
            >
              {statue.name || "BẢO TƯỢNG PHẬT GIÁO"}
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
          </div>

          {/* Subtitle */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
          >
            {statue.subtitle || statue.titleName || "Vô Thượng Năng Nhân — Ánh Sáng Từ Bi Chiếu Soi Khắp Mười Phương"}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. GIAO DIỆN TRUNG TÂM NGHỆ THUẬT VÀ LỊCH SỬ (LEAGUE OF LEGENDS UNIVERSE STYLE)
      ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-[1280px] mx-auto px-4">

        {/* ── CỘT 1 (BÊN TRÁI - CỤM TƯỢNG & HOVER SUB-STATUES) ── */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          {/* Khối Cụm Tượng */}
          <div
            className="p-6 rounded-2xl border text-center flex-1 flex flex-col items-center justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.9) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "rgba(242,193,78,0.45)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="w-full">
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-[#F2C14E] block mb-1.5"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                CỤM TƯỢNG TÔN THỜ
              </span>
              <h3
                className="text-2xl md:text-3xl font-normal uppercase text-[#F2C14E] mb-6 drop-shadow-[0_0_12px_rgba(242,193,78,0.5)]"
                style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
              >
                {statue.clusterName || "HOA NGHIÊM TAM THÁNH"}
              </h3>

              {/* Members circular avatars with Hover Effect */}
              <div className="space-y-6">
                {clusterMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredMember(member.name)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <div
                      className="w-22 h-22 rounded-full border-2 p-1 overflow-hidden mb-2 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F2C14E] shadow-[0_0_25px_rgba(242,193,78,0.4)]"
                      style={{ borderColor: "rgba(242,193,78,0.6)", background: "rgba(28,19,13,0.9)" }}
                    >
                      <img src={member.imgUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    {/* Hover text in UTM Avo Bold */}
                    <span
                      className={`text-xs transition-all duration-300 font-bold ${
                        hoveredMember === member.name ? 'opacity-100 text-[#F2C14E] scale-105' : 'opacity-70 text-[#e3d2c1]'
                      }`}
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Chùa nhỏ dưới dải */}
            <div className="my-5">
              <div className="w-14 h-14 rounded-full border border-[#F2C14E] flex items-center justify-center mx-auto p-1.5 bg-[#1C130D] shadow-[0_0_20px_rgba(242,193,78,0.5)]">
                <img src="/images/bieu-tuong-tuong-phap.svg" alt="Mộc Ấn" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(242,193,78,0.8)]" />
              </div>
            </div>
          </div>

          {/* Nút Quay lại bản đồ tâm linh */}
          <Link
            href="/vu-tru-phat-giao"
            className="w-full py-4 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4A3728 0%, #3D2B1F 100%)",
              border: "1.5px solid #F2C14E",
              color: "#F2C14E",
              fontFamily: "'UTM Avo', sans-serif",
              boxShadow: "0 0 25px rgba(242,193,78,0.3)",
            }}
          >
            <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
            <span>QUAY LẠI BẢN ĐỒ TÂM LINH</span>
          </Link>
        </div>

        {/* ── CỘT 2 (CHÍNH GIỮA - LOL UNIVERSE STYLE IMMERSIVE HERO SHOWCASE) ── */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* LoL Champion Style Glowing Halo Avatar Stage */}
          <div className="flex justify-center -mb-10 relative z-20">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#F2C14E] via-[#FFE5A3] to-[#D4A017] opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
              <div
                className="relative w-28 h-28 rounded-full border-2 p-1 overflow-hidden shadow-[0_0_40px_rgba(242,193,78,0.8)] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #F2C14E 0%, #C9AD7B 100%)",
                  borderColor: "#ffffff",
                }}
              >
                <img src={statue.avatarUrl} alt={statue.name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
          </div>

          {/* Khối Pháp Ngữ Quote Box */}
          <div
            className="p-6 pt-12 rounded-2xl border text-center relative"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.9) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "rgba(242,193,78,0.45)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <p
              className="text-base md:text-lg leading-relaxed text-[#ffde59] italic mb-3 font-normal"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                textShadow: "0 0 14px rgba(242,193,78,0.3)",
              }}
            >
              &ldquo;{statue.quote || "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi."}&rdquo;
            </p>

            <h4
              className="text-xl md:text-2xl font-normal uppercase tracking-widest text-[#F2C14E]"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              {statue.quoteAuthor || "VÔ TRÍ - TÂM HÒA"}
            </h4>
          </div>

          {/* Khối Tóm Tắt Lịch Sử có Drop Cap D trong UTM ClassizismAntiqua */}
          <div
            className="p-6 md:p-8 rounded-2xl border flex-1 relative overflow-hidden text-justify"
            style={{
              background: "linear-gradient(160deg, rgba(42,29,20,0.9) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "rgba(242,193,78,0.35)",
            }}
          >
            <style>{`
              .statue-summary > p:first-of-type::first-letter {
                font-size: 4.2rem;
                font-weight: bold;
                float: left;
                line-height: 0.75;
                margin-right: 0.15em;
                margin-top: 0.05em;
                color: #ffde59;
                font-family: 'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif;
                text-shadow: 0 0 20px rgba(242,193,78,0.6);
              }
              .statue-summary p {
                line-height: 1.9;
                font-family: 'UTM Avo', sans-serif;
                color: #ffde59;
                font-size: 0.95rem;
                margin-bottom: 1.25rem;
                text-indent: 1.5rem;
              }
              .statue-summary p:first-of-type {
                text-indent: 0;
              }
            `}</style>

            <div
              className={`statue-summary ${expandedSummary ? "" : "line-clamp-6"}`}
              dangerouslySetInnerHTML={{
                __html: statue.fullHistoryHtml || `<p>Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện. Người đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức. Và từ bước chân ấy, thế gian bắt đầu học lại một điều tưởng như đã quên: không phải quyền lực làm người cao quý, mà là trí tuệ và từ bi. Một đời Ngài đi qua, như một vầng nhật nguyệt soi đường cho muôn nẻo.</p>`
              }}
            />

            {/* Nút XEM THÊM */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setExpandedSummary(!expandedSummary)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #4A3728 0%, #3D2B1F 100%)",
                  border: "1.5px solid #F2C14E",
                  color: "#F2C14E",
                  fontFamily: "'UTM Avo', sans-serif",
                }}
              >
                {expandedSummary ? "THU GỌN ⬆" : "XEM THÊM ⬇"}
              </button>
            </div>
          </div>
        </div>

        {/* ── CỘT 3 (BÊN PHẢI - CHÚNG HỘI & KHU VỰC TRONG CHÙA) ── */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          {/* Badge & Chúng Hội Name */}
          <div
            className="p-6 rounded-2xl border text-center"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.9) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "rgba(242,193,78,0.45)",
            }}
          >
            <div className="w-12 h-12 rounded-full border border-[#F2C14E] flex items-center justify-center mx-auto mb-3 bg-[#1C130D] shadow-[0_0_15px_rgba(242,193,78,0.4)]">
              <img src="/images/bieu-tuong-tuong-phap.svg" alt="Chư Phật" className="w-6 h-6 filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C14E] block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              DANH MỤC CHÚNG HỘI
            </span>
            <h3
              className="text-2xl md:text-3xl font-normal uppercase text-[#F2C14E]"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              {statue.assemblyName || "CHƯ PHẬT HẢI HỘI"}
            </h3>
          </div>

          {/* Card KHU VỰC LIÊN KẾT */}
          <div
            className="rounded-2xl overflow-hidden border relative flex-1 flex flex-col justify-between p-6 min-h-[280px]"
            style={{
              borderColor: "rgba(242,193,78,0.4)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <img src={statue.areaImgUrl || statue.avatarUrl} alt={statue.areaName || "Khu Vực Tam Bảo"} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,15,8,0.98) 0%, rgba(26,15,8,0.4) 60%)" }} />

            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C14E] block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                KHU VỰC TÔN THỜ
              </span>
              <h4 className="text-3xl font-normal uppercase text-white" style={{ fontFamily: "'UTM Niagara', serif" }}>
                {statue.areaName || "TAM BẢO"}
              </h4>
            </div>

            <Link
              href={`/vu-tru-phat-giao/${statue.areaSlug || 'tam-bao'}`}
              className="relative z-10 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4A3728 0%, #3D2B1F 100%)",
                border: "1.5px solid #F2C14E",
                color: "#F2C14E",
                fontFamily: "'UTM Avo', sans-serif",
              }}
            >
              <span>KHU VỰC {statue.areaName || "TAM BẢO"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. BÀI VIẾT NỔI BẬT STAGE BANNER MATCHING IMAGE 2
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-4 pt-8">
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C130D] p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[320px] shadow-2xl">
          <img src={statue.article?.bannerUrl || "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=1600&h=600&fit=crop"} alt="Bài viết" className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D] via-[#1C130D]/85 to-transparent" />

          {/* Left Vertical Sticky Dots Bar */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20">
            <div className="p-2 rounded-full border border-[#F2C14E]/40 bg-black/60 text-[10px] text-[#F2C14E] font-bold uppercase tracking-widest writing-mode-vertical rotate-180">
              CÔNG HẠNH TÂM LINH
            </div>
            <div className="w-3 h-3 rounded-full bg-[#F2C14E] shadow-[0_0_10px_#F2C14E]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]/40" />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-xs text-[#c9b896] uppercase tracking-widest block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              BÀI VIẾT LIÊN QUAN
            </span>
            <h2
              className="text-3xl md:text-5xl font-normal text-[#F2C14E] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(242,193,78,0.6)]"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              {statue.article?.title || `CÔNG HẠNH PHO TƯỢNG ${statue.name}`}
            </h2>
            <p className="text-base text-[#FFE5A3] font-normal" style={{ fontFamily: "'UTM Niagara', serif" }}>
              {statue.article?.author || "VÔ TRÍ - TÂM HÒA"}
            </p>

            <div className="pt-4">
              <Link
                href={statue.article?.url || `/bao-tuong-phat-giao/${statue.slug}`}
                className="inline-block px-8 py-3 rounded-full bg-[#2A1D14] border border-[#F2C14E] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C130D] text-xs font-bold transition-all duration-300 cursor-pointer shadow-lg uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                ĐỌC BÀI VIẾT ➔
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. NGHỆ THUẬT PHẬT GIÁO SECTION (CHUẨN TÊN FONT UTM NIAGARA)
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-4">
        <ArtisticStatueSection areaTitle={statue.name} />
      </div>
    </div>
  );
};
