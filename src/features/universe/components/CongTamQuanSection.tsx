'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Compass } from 'lucide-react';

export const CongTamQuanSection: FC = () => {
  const [activeTab, setActiveTab] = useState<'cong-tam-quan' | 'cau-bat-chanh-dao' | 'them-that-thanh-tai'>('cong-tam-quan');

  const batChanhDao = [
    { title: 'Chánh Kiến', desc: 'Thấy hiểu chân lý vô thường, nhân quả và tứ diệu đế.' },
    { title: 'Chánh Tư Duy', desc: 'Suy nghĩ chân chính, buông bỏ tham sân si.' },
    { title: 'Chánh Ngữ', desc: 'Lời nói chân thật, hòa nhã, mang lại an lạc.' },
    { title: 'Chánh Nghiệp', desc: 'Hành động thiện lành, tôn trọng sự sống.' },
    { title: 'Chánh Mạng', desc: 'Mưu sinh bằng nghề nghiệp thanh cao, chính đáng.' },
    { title: 'Chánh Tinh Tấn', desc: 'Nỗ lực siêng năng tu tập, dứt trừ việc ác.' },
    { title: 'Chánh Niệm', desc: 'Tỉnh thức ghi nhớ trong từng phút giây hiện tại.' },
    { title: 'Chánh Định', desc: 'Tâm an định, không bị chao đảo trước biến động.' },
  ];

  const thatThanhTai = [
    { title: 'Bậc 1: Tín Tài', desc: 'Báu vật Lòng Tín Tâm kiên cố đối với Tam Bảo.' },
    { title: 'Bậc 2: Giới Tài', desc: 'Báu vật Giới Luật giữ gìn thân tâm trong sạch.' },
    { title: 'Bậc 3: Tàm Tài', desc: 'Báu vật Lòng Hổ Thẹn khi làm điều sai quấy.' },
    { title: 'Bậc 4: Quý Tài', desc: 'Báu vật Lòng Sợ Hãi tác hại của tội lỗi.' },
    { title: 'Bậc 5: Văn Tài', desc: 'Báu vật Lắng Nghe và học hỏi chánh pháp.' },
    { title: 'Bậc 6: Thí Tài', desc: 'Báu vật Buông Bỏ và bố thí xả tài vật.' },
    { title: 'Bậc 7: Tuệ Tài', desc: 'Báu vật Trí Tuệ thấu suốt bản chất cuộc đời.' },
  ];

  return (
    <div className="w-full bg-[#1C130D] p-6 md:p-8 rounded-2xl border border-[#F2C14E]/30 shadow-2xl">
      {/* TAB SELECTOR */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('cong-tam-quan')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'cong-tam-quan'
              ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-[0_0_20px_rgba(242,193,78,0.5)]'
              : 'bg-[#2A1D14] text-[#c9b896] border-[#F2C14E]/30 hover:text-[#F2C14E]'
          }`}
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          1. CỔNG TAM QUAN
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cau-bat-chanh-dao')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'cau-bat-chanh-dao'
              ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-[0_0_20px_rgba(242,193,78,0.5)]'
              : 'bg-[#2A1D14] text-[#c9b896] border-[#F2C14E]/30 hover:text-[#F2C14E]'
          }`}
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          2. CẦU BÁT CHÁNH ĐẠO (8 NHÁNH)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('them-that-thanh-tai')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'them-that-thanh-tai'
              ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-[0_0_20px_rgba(242,193,78,0.5)]'
              : 'bg-[#2A1D14] text-[#c9b896] border-[#F2C14E]/30 hover:text-[#F2C14E]'
          }`}
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          3. THỀM THẤT THÁNH TÀI (7 BẬC ĐÁ PHÁT SÁNG)
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'cong-tam-quan' && (
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-[#F2C14E]" style={{ fontFamily: "'UTM Niagara', serif" }}>
            CỔNG TAM QUAN — TAM GIẢI THOÁT MÔN
          </h3>
          <p className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Cửa ngõ đầu tiên dẫn lối vào chốn thiêng gồm 3 cửa tượng trưng cho Tam Giải Thoát Môn: Không Môn, Vô Tướng Môn và Vô Nguyện Môn. Giúp bước chân hành giả rũ bỏ mọi trần lụy, hướng tâm về cội nguồn giác ngộ.
          </p>
        </div>
      )}

      {activeTab === 'cau-bat-chanh-dao' && (
        <div>
          <h3 className="text-2xl font-bold text-[#F2C14E] text-center mb-6" style={{ fontFamily: "'UTM Niagara', serif" }}>
            CẦU BÁT CHÁNH ĐẠO — 8 CON ĐƯỜNG CHÂN CHÍNH
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {batChanhDao.map((item, idx) => (
              <div key={idx} className="bg-[#2A1D14] p-4 rounded-xl border border-[#F2C14E]/30 text-left">
                <span className="text-[10px] font-bold text-[#F2C14E] bg-[#1C130D] px-2 py-0.5 rounded border border-[#F2C14E]/20">
                  NHÁNH {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-[#F2C14E] mt-1" style={{ fontFamily: "'UTM Niagara', serif" }}>
                  {item.title}
                </h4>
                <p className="text-xs text-[#c9b896] mt-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'them-that-thanh-tai' && (
        <div>
          <h3 className="text-2xl font-bold text-[#F2C14E] text-center mb-6" style={{ fontFamily: "'UTM Niagara', serif" }}>
            THỀM THẤT THÁNH TÀI — 7 BẬC ĐÁ TÂM LINH PHÁT SÁNG
          </h3>
          <div className="space-y-3 max-w-2xl mx-auto">
            {thatThanhTai.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-r from-[#2A1D14] to-[#3A2718] p-3.5 rounded-xl border border-[#F2C14E]/40 flex items-center gap-4 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#F2C14E] text-[#1C130D] font-bold text-sm flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(242,193,78,0.6)]">
                  {idx + 1}
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-[#F2C14E]" style={{ fontFamily: "'UTM Niagara', serif" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#D3C0AD]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
