'use client';

import React, { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, RefreshCw, X, Flame, MapPin, Phone, Sparkles, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HUONG_LINH_DATA, KHU_VUC_LIST, HuongLinhItem } from '@/data/tu-an-data';
import { CustomDropdown } from '@/components/common/CustomDropdown';

interface HuongLinhCardProps {
  item: HuongLinhItem;
  onSelect: (item: HuongLinhItem) => void;
}

const HuongLinhCard = React.memo(({ item, onSelect }: HuongLinhCardProps) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between hover:-translate-y-1 transform-gpu will-change-transform h-[360px]"
    >
      {/* CARD BODY */}
      <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Header row: Badge + Code */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                item.type === 'Tro Cốt'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  : item.type === 'Cửu Huyền Thất Tổ'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                  : 'bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/40'
              }`}
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {item.type}
            </span>

            {/* Glowing Golden Code Badge */}
            <span
              className="text-xs font-mono font-bold text-[#F2C14E] bg-[#1C130D] px-3 py-1 rounded-lg border border-[#F2C14E]/50 shadow-[0_0_12px_rgba(242,193,78,0.3)]"
            >
              {item.code}
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-[#F2C14E] text-xl md:text-2xl font-bold leading-snug group-hover:text-white transition-colors mb-1 line-clamp-1"
            style={{ fontFamily: "'UTM Niagara', serif" }}
          >
            {item.hoTen}
          </h3>

          {/* Pháp danh */}
          {item.phapDanh && (
            <p
              className="text-[#FFE5A3] text-xs font-bold mb-2 tracking-wide truncate"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              PHÁP DANH: {item.phapDanh}
            </p>
          )}

          {/* Location / Quê quán */}
          <div className="flex items-center gap-1.5 text-xs text-[#FFE5A3]/90 bg-[#1C130D]/90 p-2.5 rounded-xl border border-[#F2C14E]/25 my-2.5">
            <MapPin className="w-4 h-4 text-[#F2C14E] shrink-0" />
            <span className="truncate font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              {item.khuVuc} • {item.viTri}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2" />
          <div
            className="flex items-center justify-between text-[11px] text-[#FFE5A3]/80 font-bold"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <div className="flex items-center gap-1 truncate max-w-[170px]">
              <Phone className="w-3 h-3 text-[#F2C14E] shrink-0" />
              <span className="truncate">{item.giaDinh}</span>
            </div>
            <span className="text-[#F2C14E] group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
              <Flame className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>Chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

HuongLinhCard.displayName = 'HuongLinhCard';

export const TuAnVangSinhSystem: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKhuVuc, setSelectedKhuVuc] = useState<string>('Tất cả khu vực');
  const [selectedItem, setSelectedItem] = useState<HuongLinhItem | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [hasLitIncense, setHasLitIncense] = useState(false);

  // Fast Instant Real-time Filter across all 1,143 records
  const filteredData = useMemo(() => {
    let result = HUONG_LINH_DATA;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const matchName = item.hoTen.toLowerCase().includes(q);
        const matchPhapDanh = item.phapDanh?.toLowerCase().includes(q) || false;
        const matchCode = item.code.toLowerCase().includes(q);
        const matchGiaDinh = item.giaDinh.toLowerCase().includes(q);
        const matchViTri = item.viTri.toLowerCase().includes(q);
        return matchName || matchPhapDanh || matchCode || matchGiaDinh || matchViTri;
      });
    }

    if (selectedKhuVuc !== 'Tất cả khu vực') {
      result = result.filter((item) => item.khuVuc === selectedKhuVuc);
    }

    return result;
  }, [searchQuery, selectedKhuVuc]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedKhuVuc('Tất cả khu vực');
    setDisplayCount(12);
  };

  const handleLightIncense = () => {
    setHasLitIncense(true);
    setTimeout(() => {
      setHasLitIncense(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── 1. HEADER SECTION ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
            >
              TRA CỨU BÀI VỊ CHƯ HƯƠNG LINH • VÃNG SINH ĐƯỜNG
            </h2>
            <p
              className="text-xs md:text-sm text-[#c9b896]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Hệ thống tra cứu thông tin bài vị, tro cốt ký gửi cúng cầu siêu tại Bổn Tự Tùng Lâm Hòa Phúc ({HUONG_LINH_DATA.length} hồ sơ)
            </p>
          </div>
        </div>

        {/* ── 2. ULTRA-FAST SINGLE SEARCH INPUT BAR & KHU VỰC DROPDOWN ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Nhãn LỰA CHỌN nhẹ nhàng thanh lịch */}
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]/80 shrink-0 select-none mr-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            LỰA CHỌN:
          </span>

          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[240px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(12);
              }}
              placeholder="Nhập tên Chư Hương Linh, Pháp danh, Mã số bài vị (VD: 255, PHÙNG THỊ MINH)..."
              className="w-full pl-10 pr-9 py-2 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 rounded-xl text-xs md:text-sm text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] hover:border-[#F2C14E]/70 transition-all shadow-inner"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c9b896] hover:text-[#F2C14E] transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Area Filter Dropdown */}
          <CustomDropdown
            labelPrefix="Khu vực"
            value={selectedKhuVuc}
            options={KHU_VUC_LIST.map((kv) => ({ id: kv, name: kv }))}
            onChange={(val) => {
              setSelectedKhuVuc(val);
              setDisplayCount(12);
            }}
            placeholder="Tất cả khu vực"
          />

          {/* Reset Filter Button */}
          {(searchQuery || selectedKhuVuc !== 'Tất cả khu vực') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#F2C14E]/35 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 text-xs text-[#FFE5A3] hover:text-white hover:border-[#F2C14E] transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(242,193,78,0.25)]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <RefreshCw className="w-3 h-3 text-[#F2C14E]" />
              <span>Xóa tìm kiếm</span>
            </button>
          )}

          {/* Count Badge */}
          <div className="text-xs text-[#F2C14E] font-bold shrink-0 px-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 rounded-xl border border-[#F2C14E]/35 shadow-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            {filteredData.length} Hương linh
          </div>
        </div>

          {/* Quick Counter Info Bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F2C14E]/15 text-xs text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            <span>
              {searchQuery.trim() ? (
                <>Tìm thấy <strong className="text-[#F2C14E] font-bold">{filteredData.length}</strong> kết quả phù hợp với từ khóa "<span className="text-white">{searchQuery}</span>"</>
              ) : (
                <>Hiển thị <strong className="text-[#F2C14E] font-bold">{filteredData.length}</strong> hồ sơ lưu trữ tại Vãng Sinh Đường</>
              )}
            </span>

            <span className="hidden sm:inline text-[#FFE5A3]/60">
              Nhấp vào từng linh vị để xem mã số chi tiết &amp; thắp hương cầu siêu
            </span>
          </div>

        {/* ── 3. 4-COLUMN CARDS GRID (FAST PAGINATED RENDER) ── */}
        {filteredData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {visibleData.map((item) => (
                <HuongLinhCard key={item.id} item={item} onSelect={setSelectedItem} />
              ))}
            </div>

            {/* Load More Button */}
            {displayCount < filteredData.length && (
              <div className="w-full flex justify-center mt-12">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 16)}
                  className="px-8 py-3.5 rounded-full bg-[#2C1C11] border border-[#F2C14E]/60 text-[#F2C14E] text-xs md:text-sm font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <span>XEM THÊM KẾT QUẢ (+{filteredData.length - displayCount} HỒ SƠ)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-[#c9b896]/60 text-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Không tìm thấy thông tin Chư Hương Linh phù hợp với từ khóa tìm kiếm. Quý vị vui lòng kiểm tra lại họ tên hoặc mã số.
          </div>
        )}
      </div>

      {/* ── 4. POPUP DETAIL & VIRTUAL INCENSE DIALOG ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative w-full max-w-[600px] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1A120B 100%)',
                border: '1px solid rgba(242,193,78,0.45)',
                boxShadow: '0 0 60px rgba(242,193,78,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 border border-[#c8aa6e]/40 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Header */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-center border-b border-[#c8aa6e]/30">
                <h3
                  className="text-lg md:text-xl font-normal text-[#F2C14E] uppercase tracking-widest text-center"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  CHI TIẾT MÃ SỐ &amp; BÀI VỊ CHƯ HƯƠNG LINH
                </h3>
              </div>

              {/* Modal Content */}
              <div className="p-6 flex flex-col gap-4 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#F2C14E] bg-[#2A1D14] mx-auto flex items-center justify-center text-[#F2C14E] shadow-[0_0_25px_rgba(242,193,78,0.5)]">
                  <Flame className={`w-8 h-8 ${hasLitIncense ? 'animate-bounce text-amber-400' : 'text-[#F2C14E]'}`} />
                </div>

                {/* Highlighted Code Badge */}
                <div>
                  <span className="px-4 py-1.5 rounded-lg bg-[#1C130D] border-2 border-[#F2C14E] text-[#F2C14E] font-mono text-base font-bold tracking-widest shadow-md inline-block mb-2">
                    MÃ SỐ BÀI VỊ: {selectedItem.code}
                  </span>
                  <h2
                    className="text-3xl md:text-4xl font-normal text-[#F2C14E] uppercase leading-tight"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {selectedItem.hoTen}
                  </h2>
                  {selectedItem.phapDanh && (
                    <p className="text-sm text-[#FFE5A3] font-bold mt-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                      PHÁP DANH: {selectedItem.phapDanh}
                    </p>
                  )}
                </div>

                <div className="bg-[#1C130D] p-4 rounded-xl border border-[#F2C14E]/20 text-left space-y-2.5 text-xs md:text-sm text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  <div className="flex justify-between border-b border-[#F2C14E]/10 pb-2">
                    <span>Phân loại ký gửi:</span>
                    <strong className="text-[#F2C14E]">{selectedItem.type} ({selectedItem.khuVuc})</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#F2C14E]/10 pb-2">
                    <span>Vị trí / Quê quán:</span>
                    <strong className="text-[#FFE5A3]">{selectedItem.viTri}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#F2C14E]/10 pb-2">
                    <span>Liên hệ thân nhân:</span>
                    <strong className="text-[#FFE5A3]">{selectedItem.giaDinh}</strong>
                  </div>
                  {selectedItem.ghiChu && (
                    <div className="pt-1 text-xs italic text-[#D3C0AD]">
                      Ghi chú bổn tự: {selectedItem.ghiChu}
                    </div>
                  )}
                </div>

                {/* Virtual Incense Burning Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleLightIncense}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-xs md:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(242,193,78,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 mx-auto"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <Flame className="w-4 h-4" />
                    <span>{hasLitIncense ? 'ĐÃ THẮP HƯƠNG CẦU SIÊU' : 'THẮP HƯƠNG CẦU SIÊU TÂM LINH'}</span>
                    {hasLitIncense && <Sparkles className="w-4 h-4 text-[#1C130D]" />}
                  </button>
                  {hasLitIncense && (
                    <p className="text-xs text-[#F2C14E] font-bold mt-2 animate-in fade-in" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                      Nam Mô A Di Đà Phật! Khói hương thơm ngát nguyện cầu Hương Linh sớm vãng sinh An Lạc Quốc.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
