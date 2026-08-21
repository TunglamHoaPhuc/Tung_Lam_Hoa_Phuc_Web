'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, UserCheck, Flame } from 'lucide-react';

export interface DeTuItem {
  id: string;
  name: string;
  sanskritName: string;
  titleBadge: string;
  role: string;
  quote: string;
  description: string;
  imageUrl: string;
}

export const THAP_DAI_DE_TU_DATA: DeTuItem[] = [
  {
    id: 'dt01',
    name: 'Ma Ha Ca Diếp',
    sanskritName: 'Mahākāśyapa',
    titleBadge: 'ĐẦU ĐÀ ĐỆ NHẤT',
    role: 'Tổ Sư Thiền Tông • Khổ Hạnh Bậc Nhất',
    quote: '“Niêm hoa vi tiếu — Tâm truyền tâm, không lập văn tự.”',
    description: 'Bậc thượng thủ trong hàng Thánh chúng, giữ gìn giới luật khổ hạnh nghiêm túc nhất, người chủ trì kỳ kết tập kinh điển đầu tiên sau khi Phật nhập Niết Bàn.',
    imageUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=800&fit=crop',
  },
  {
    id: 'dt02',
    name: 'A Nan Đà',
    sanskritName: 'Ānanda',
    titleBadge: 'ĐA VĂN ĐỆ NHẤT',
    role: 'Thị Giả Của Phật • Ghi Nhớ Toàn Bộ Kinh Tạng',
    quote: '“Như thị ngã văn — Tôi từng nghe Đức Thế Tôn dạy như vầy.”',
    description: 'Thị giả trung thành và tận tụy nhất của Đức Phật, có trí nhớ siêu phàm đã tụng lại toàn bộ các bài kinh Phật dạy trong kỳ kết tập kinh điển.',
    imageUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=800&fit=crop',
  },
  {
    id: 'dt03',
    name: 'Xá Lợi Phất',
    sanskritName: 'Śāriputra',
    titleBadge: 'TRÍ TUỆ ĐỆ NHẤT',
    role: 'Tướng Quân Chánh Pháp • Bậc Thầy Bát Nhã',
    quote: '“Sắc bất dị không, không bất dị sắc — Trí tuệ soi thấu chân tướng vạn pháp.”',
    description: 'Vị đại đệ tử đứng đầu về trí tuệ siêu việt, thông hiểu tường tận mọi giáo pháp sâu kín của Đức Như Lai và trợ duyên hoằng hóa chúng sinh.',
    imageUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=600&h=800&fit=crop',
  },
  {
    id: 'dt04',
    name: 'Mục Kiền Liên',
    sanskritName: 'Maudgalyāyana',
    titleBadge: 'THẦN THÔNG ĐỆ NHẤT',
    role: 'Đại Hiếu Mục Kiền Liên • Cứu Mẹ Khỏi Địa Ngục',
    quote: '“Lòng hiếu thảo vô biên mở toang cánh cửa u minh tăm tối.”',
    description: 'Bậc đại thánh tăng thần thông quảng đại, tấm gương hiếu đạo ngàn đời làm khởi nguồn cho Đại lễ Vu Lan Báo Hiếu truyền thống của Phật giáo.',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=800&fit=crop',
  },
  {
    id: 'dt05',
    name: 'Phú Lâu Na',
    sanskritName: 'Pūrṇa Maitrāyanīputra',
    titleBadge: 'THUYẾT PHÁP ĐỆ NHẤT',
    role: 'Biện Tài Vô Ngại • Xả Thân Hoằng Pháp',
    quote: '“Nơi nào tối tăm, nơi đó cần ngọn đèn chánh pháp soi đường.”',
    description: 'Hùng biện bậc nhất, tâm từ bi vô lượng sẵn sàng đi đến những vùng đất nguy hiểm, biên thùy xa xôi để đem ánh sáng Phật pháp cứu độ dân lành.',
    imageUrl: 'https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=800&fit=crop',
  },
  {
    id: 'dt06',
    name: 'Ca Chiên Diên',
    sanskritName: 'Kātyāyana',
    titleBadge: 'LUẬN NGHỊ ĐỆ NHẤT',
    role: 'Phân Tích Giáo Pháp • Khai Sáng Chân Lý',
    quote: '“Lý lẽ sáng tỏ, chặt chẽ như kim cương phá tan tà kiến.”',
    description: 'Tài năng phân tích, diễn giải sâu sắc những lời dạy ngắn gọn của Đức Phật thành những bài thuyết giáo rõ ràng, dễ hiểu cho mọi tầng lớp.',
    imageUrl: 'https://images.unsplash.com/photo-1709064159097-91b634741c96?w=600&h=800&fit=crop',
  },
  {
    id: 'dt07',
    name: 'A Nậu Lâu Đà',
    sanskritName: 'Aniruddha',
    titleBadge: 'THIÊN NHÃN ĐỆ NHẤT',
    role: 'Đôi Mắt Trí Tuệ • Tinh Tấn Không Mỏi Mệt',
    quote: '“Khi đôi mắt trần thế khép lại, thiên nhãn tâm linh bừng sáng tam thiên đại thiên thế giới.”',
    description: 'Bậc đại thánh tinh tấn vượt bậc, dù bị mù đôi mắt nhưng đã chứng đắc Thiên Nhãn Thông, nhìn thấu suốt cả tam thiên đại thiên thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=600&h=800&fit=crop',
  },
  {
    id: 'dt08',
    name: 'Ưu Ba Ly',
    sanskritName: 'Upāli',
    titleBadge: 'TRÌ GIỚI ĐỆ NHẤT',
    role: 'Bảo Vệ Giới Luật • Nền Tảng Tăng Đoàn',
    quote: '“Giới luật còn là Phật pháp còn, giới luật thanh tịnh là đạo trang nghiêm.”',
    description: 'Xuất thân người thợ cạo bình dị, tôn giả tu tập nghiêm cẩn tuyệt đối và trở thành người tụng đọc toàn bộ Luật tạng trong lần kết tập đầu tiên.',
    imageUrl: 'https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=600&h=800&fit=crop',
  },
  {
    id: 'dt09',
    name: 'La Hầu La',
    sanskritName: 'Rāhula',
    titleBadge: 'MẬT HẠNH ĐỆ NHẤT',
    role: 'Con Trai Phật Thích Ca • Nhẫn Nhục Lặng Thầm',
    quote: '“Âm thầm tu dưỡng, nhẫn nhục hành trì mọi oai nghi tế hạnh.”',
    description: 'Con trai duy nhất của Đức Phật trước khi xuất gia, tu tập âm thầm khiêm cung, không bao giờ tự hào về xuất thân cao quý, đắc quả A La Hán.',
    imageUrl: 'https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=600&h=800&fit=crop',
  },
  {
    id: 'dt10',
    name: 'Tu Bồ Đề',
    sanskritName: 'Subhūti',
    titleBadge: 'GIẢI KHÔNG ĐỆ NHẤT',
    role: 'Thấu Suốt Tính Không • Trụ Cột Kinh Kim Cương',
    quote: '“Phàm sở hữu tướng, giai thị hư vọng — Thấy các tướng phi tướng tức thấy Như Lai.”',
    description: 'Thấu hiểu sâu sắc nhất về triết lý Tính Không (Śūnyatā) của Bát Nhã, nhân vật đối thoại chính cùng Đức Thế Tôn trong Kinh Kim Cương Bát Nhã.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=800&fit=crop',
  },
];

export const ThapDaiDeTuCards: FC = () => {
  const [selectedDeTu, setSelectedDeTu] = useState<DeTuItem | null>(null);

  return (
    <div className="w-full py-8 space-y-6">
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
          <span className="text-xl">☸</span>
        </div>
        <span className="text-xs text-[#F2C14E] font-bold uppercase tracking-widest" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          ❖ 10 BẢN BÁT POSTCARD TÔN TƯỢNG ❖
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#FFE5A3] font-normal uppercase mt-1"
          style={{ fontFamily: "'UTM Niagara', serif" }}
        >
          THẬP ĐẠI ĐỆ TỬ CỦA ĐỨC PHẬT
        </h2>
        <p className="text-xs sm:text-sm text-[#c9b896] max-w-2xl mx-auto mt-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          Mười bậc đại Thánh Tăng với những công hạnh siêu việt, là ngọn đèn dẫn đường sáng ngời cho Tăng đoàn muôn đời.
        </p>
      </div>

      {/* ── 2. 10 POSTCARDS GRID (5 CỘT TRÊN DESKTOP, 2 CỘT MOBILE) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {THAP_DAI_DE_TU_DATA.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedDeTu(item)}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#2A180E] via-[#1C1008] to-[#120803] border border-[#F2C14E]/30 p-3 flex flex-col justify-between hover:border-[#F2C14E] hover:shadow-[0_12px_35px_rgba(242,193,78,0.3)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Postcard Image with golden border */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#100702] border border-[#F2C14E]/20 mb-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              {/* Badge Đệ nhất */}
              <div className="absolute top-2 left-2 right-2">
                <span
                  className="inline-block w-full text-center text-[10px] font-bold text-[#FFE5A3] bg-[#8B1E0F]/90 px-2 py-0.5 rounded border border-[#F2C14E]/50 uppercase tracking-wider backdrop-blur-sm"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {item.titleBadge}
                </span>
              </div>

              {/* Number Badge */}
              <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/80 border border-[#F2C14E] text-[#F2C14E] text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </div>
            </div>

            {/* Name and Sanskrit */}
            <div className="text-center space-y-1">
              <h3
                className="text-xl sm:text-2xl text-[#FFE5A3] group-hover:text-[#F2C14E] transition-colors leading-tight uppercase"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {item.name}
              </h3>
              <p className="text-[11px] text-[#c9b896]/80 italic truncate" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {item.sanskritName}
              </p>
            </div>

            {/* View detail hover action */}
            <div className="mt-2 pt-2 border-t border-[#F2C14E]/15 flex items-center justify-center text-[11px] text-[#F2C14E] font-bold">
              <span className="group-hover:underline">Chi tiết công hạnh ➔</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedDeTu && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
            onClick={() => setSelectedDeTu(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full rounded-3xl border-2 border-[#F2C14E] bg-gradient-to-b from-[#2C180E] via-[#1E1108] to-[#120904] p-6 shadow-[0_0_60px_rgba(242,193,78,0.4)] text-white space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDeTu(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center border border-[#F2C14E]/50 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-[#FFE5A3] bg-[#8B1E0F] border border-[#F2C14E] uppercase"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedDeTu.titleBadge}
                </span>

                <h2
                  className="text-4xl text-[#FFE5A3] uppercase"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {selectedDeTu.name}
                </h2>
                <p className="text-xs text-[#F2C14E] font-bold tracking-wide" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {selectedDeTu.sanskritName} • {selectedDeTu.role}
                </p>
              </div>

              {/* Quote box */}
              <div className="p-3.5 rounded-xl bg-[#140B05] border border-[#F2C14E]/30 text-center">
                <p className="text-xs text-[#FFE5A3] italic leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {selectedDeTu.quote}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-[#e3d2c1] leading-relaxed text-justify" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {selectedDeTu.description}
              </p>

              <div className="text-center pt-2 border-t border-[#F2C14E]/20">
                <span className="text-[11px] text-[#c9b896]/70 uppercase" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  ❖ TÔN TRÍ TẠI LẦU KINH LUÂN • TÙNG LÂM HÒA PHÚC ❖
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
