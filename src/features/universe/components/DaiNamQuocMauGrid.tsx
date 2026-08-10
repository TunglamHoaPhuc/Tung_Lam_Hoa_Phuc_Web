'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, X, Award, FileText, Crown } from 'lucide-react';

interface NguyenSeal {
  id: string;
  code: string;
  name: string;
  kingEra: string;
  year: string;
  material: string;
  description: string;
  significance: string;
  imgUrl: string;
}

const NGUYEN_SEALS: NguyenSeal[] = [
  {
    id: 'seal-01',
    code: 'ẤN 01',
    name: 'SẮC MỆNH CHI BẢO',
    kingEra: 'Triều Vua Gia Long',
    year: 'Năm 1802',
    material: 'Vàng ròng đúc nguyên khối (Nặng 8.3kg)',
    description: 'Ấn rồng vàng quyền lực bậc nhất của Triều Nguyễn, dùng để ban sắc phong cho chư thần, quan lại và phong vương.',
    significance: 'Biểu tượng tối cao cho tính chính thống và uy quyền thần thánh của vương triều.',
    imgUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-02',
    code: 'ẤN 02',
    name: 'HOÀNG ĐẾ CHI TỶ',
    kingEra: 'Triều Vua Minh Mạng',
    year: 'Năm 1823',
    material: 'Vàng ròng chạm khắc rồng quấn',
    description: 'Ngọc tỷ biểu trưng cho vương quyền của Hoàng Đế Minh Mạng, dùng để đóng trên các đạo chiếu dụ đại sự quốc gia.',
    significance: 'Bảo vật quốc gia chứng giám cho sự phát triển hưng thịnh của Triều Nguyễn.',
    imgUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-03',
    code: 'ẤN 03',
    name: 'TRỊ LIỆU CHI BẢO',
    kingEra: 'Triều Vua Thiệu Trị',
    year: 'Năm 1841',
    material: 'Ngọc Bích chạm hình rồng năm móng',
    description: 'Ấn ngọc quý dùng trong các nghi lễ cúng tế trời đất, ban phúc lành cho muôn dân.',
    significance: 'Thể hiện triết lý lấy dân làm gốc và sự cầu nguyện hòa bình thái bình.',
    imgUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-04',
    code: 'ẤN 04',
    name: 'ĐẠI NAM THỌ XƯƠNG CHI TỶ',
    kingEra: 'Triều Vua Tự Đức',
    year: 'Năm 1848',
    material: 'Vàng ròng chạm trổ hoa văn hoàng gia',
    description: 'Ấn vàng tượng trưng cho sự trường tồn vĩnh cửu của đất nước Đại Nam.',
    significance: 'Lưu giữ giá trị văn hóa sử học sâu sắc của dân tộc.',
    imgUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-05',
    code: 'ẤN 05',
    name: 'VĂN LÝ MỆNH TỶ',
    kingEra: 'Triều Vua Kiến Phúc',
    year: 'Năm 1883',
    material: 'Ngọc trắng chạm rồng mạ vàng',
    description: 'Ấn dành riêng cho việc phê duyệt các văn bản văn hóa, khoa cử và thi cử.',
    significance: 'Tôn vinh truyền thống hiếu học và trọng dụng nhân tài.',
    imgUrl: 'https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-06',
    code: 'ẤN 06',
    name: 'HOÀNG ĐẾ TÔN THÂN CHI TỶ',
    kingEra: 'Triều Vua Đồng Khánh',
    year: 'Năm 1885',
    material: 'Bạc mạ vàng chạm khắc tỉ mỉ',
    description: 'Ấn dùng để đóng lên các văn bản sắc phong cho hoàng tộc và tôn thất.',
    significance: 'Ghi dấu kỷ cương hoàng tộc Triều Nguyễn.',
    imgUrl: 'https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-07',
    code: 'ẤN 07',
    name: 'KHÂM VĂN CHI TỶ',
    kingEra: 'Triều Vua Thành Thái',
    year: 'Năm 1889',
    material: 'Đồng mạ vàng phỏng cổ',
    description: 'Ấn dùng cho Quốc Tử Giám và các trường thi hoàng gia.',
    significance: 'Đánh dấu sự canh tân văn hóa và học thuật.',
    imgUrl: 'https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-08',
    code: 'ẤN 08',
    name: 'BẢO ĐẠI CHI TỶ',
    kingEra: 'Triều Vua Bảo Đại',
    year: 'Năm 1926',
    material: 'Vàng ròng chạm khắc rồng thế kỷ XX',
    description: 'Ấn hoàng gia cuối cùng của triều đại phong kiến Việt Nam.',
    significance: 'Ghi dấu bước ngoặt chuyển giao lịch sử dân tộc.',
    imgUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-09',
    code: 'ẤN 09',
    name: 'TỶ PHONG THÂN CHI BẢO',
    kingEra: 'Triều Vua Gia Long',
    year: 'Năm 1804',
    material: 'Vàng ròng chạm rồng mây',
    description: 'Ấn chuyên dùng ban sắc phong cho chư thần thành hoàng các làng xã.',
    significance: 'Gắn kết tín ngưỡng làng xã Bắc Bộ với vương triều.',
    imgUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-10',
    code: 'ẤN 10',
    name: 'ĐẠI NAM QUỐC TRÙ CHI TỶ',
    kingEra: 'Triều Vua Minh Mạng',
    year: 'Năm 1830',
    material: 'Ngọc bích quý chạm đầu rồng',
    description: 'Ấn quốc gia ban hành luật pháp và bang giao.',
    significance: 'Thể hiện vị thế độc lập chủ quyền của Đại Nam.',
    imgUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-11',
    code: 'ẤN 11',
    name: 'TÔN NHƠN PHỦ CHI TỶ',
    kingEra: 'Triều Vua Thiệu Trị',
    year: 'Năm 1845',
    material: 'Bạc mạ vàng chạm phượng',
    description: 'Ấn quản lý phả hệ hoàng tộc Tôn Nhơn Phủ.',
    significance: 'Bảo tồn nguồn cội gia tộc hoàng gia.',
    imgUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=400&fit=crop',
  },
  {
    id: 'seal-12',
    code: 'ẤN 12',
    name: 'THỪA THIÊN PHỦ CHI TỶ',
    kingEra: 'Triều Vua Tự Đức',
    year: 'Năm 1850',
    material: 'Đồng thau mạ vàng tinh xảo',
    description: 'Ấn quản lý kinh đô Thừa Thiên Huế.',
    significance: 'Biểu tượng quản lý kinh kỳ đất nước.',
    imgUrl: 'https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=400&h=400&fit=crop',
  },
];

export const DaiNamQuocMauGrid: FC = () => {
  const [selectedSeal, setSelectedSeal] = useState<NguyenSeal | null>(null);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider">
              ĐẠI NAM QUỐC MẪU (ĐỀN MẪU)
            </span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
          >
            BẢO VẬT 12 ẤN TRIỀU VUA THỜI NGUYỄN
          </h2>
          <p className="text-xs md:text-sm text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Trưng bày hình ảnh &amp; ý nghĩa lịch sử của 12 chiếc ấn vàng, ngọc tỷ quý giá thuộc Triều Nguyễn
          </p>
        </div>

        {/* 12 SEALS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {NGUYEN_SEALS.map((seal) => (
            <div
              key={seal.id}
              onClick={() => setSelectedSeal(seal)}
              className="group relative rounded-2xl border border-[#F2C14E]/35 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 transform-gpu h-[360px]"
            >
              {/* IMAGE FRAME */}
              <div className="relative w-full h-[210px] bg-[#1A120B] overflow-hidden p-3 flex items-center justify-center">
                <img
                  src={seal.imgUrl}
                  alt={seal.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25170E] via-transparent to-black/40" />

                {/* Code Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-[#F2C14E] bg-[#1C130D]/90 border border-[#F2C14E]/50 font-mono shadow-md">
                  {seal.code}
                </div>
              </div>

              {/* CAPTION */}
              <div className="p-4 bg-gradient-to-b from-[#25170E] to-[#1C130D] text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-[#F2C14E] text-xl font-bold leading-snug group-hover:text-white transition-colors mb-1 truncate"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {seal.name}
                  </h3>
                  <p className="text-[#FFE5A3] text-xs font-bold mb-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {seal.kingEra} • {seal.year}
                  </p>
                </div>

                <div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2" />
                  <div className="flex items-center justify-between text-[11px] text-[#F2C14E] font-bold px-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    <span className="flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Xem Ngọc Tỷ</span>
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Chi tiết ➔
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {selectedSeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedSeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[580px] rounded-2xl overflow-hidden p-6"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1A120B 100%)',
                border: '2px solid rgba(242,193,78,0.6)',
                boxShadow: '0 0 60px rgba(242,193,78,0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedSeal(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-40 mx-auto sm:mx-0 shrink-0 rounded-xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black p-2 self-start shadow-2xl">
                  <img src={selectedSeal.imgUrl} alt={selectedSeal.name} className="w-full h-auto object-cover rounded-lg" />
                </div>

                <div className="flex-1 min-w-0 text-left space-y-2.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase font-mono">
                    {selectedSeal.code} • {selectedSeal.kingEra}
                  </span>
                  <h3 className="text-2xl font-bold text-[#F2C14E] leading-tight" style={{ fontFamily: "'UTM Niagara', serif" }}>
                    {selectedSeal.name}
                  </h3>
                  <p className="text-xs text-[#FFE5A3] font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    Chất liệu: {selectedSeal.material}
                  </p>

                  <div className="h-[1px] bg-gradient-to-r from-[#F2C14E]/50 to-transparent" style={{ width: '61.8%' }} />

                  <p className="text-xs text-[#D3C0AD] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedSeal.description}
                  </p>

                  <div className="bg-[#1C130D] p-3 rounded-xl border border-[#F2C14E]/20 text-xs text-[#FFE5A3] italic" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    Ý nghĩa: "{selectedSeal.significance}"
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
