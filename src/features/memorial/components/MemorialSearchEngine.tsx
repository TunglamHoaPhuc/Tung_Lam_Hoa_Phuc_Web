'use client';

import React, { useState, useMemo, FC } from 'react';
import { Search, Filter, Sparkles, MapPin, User, Calendar, Phone, Heart, QrCode, X, Share2, Printer, CheckCircle2 } from 'lucide-react';
import MEMORIAL_RAW_DATA from '@/data/memorial-data.json';
import { CustomDropdown } from '@/components/common/CustomDropdown';

export interface MemorialRecord {
  id: string;
  category: string;
  categorySlug: string;
  code: string;
  name: string;
  gender: string;
  dharmaName: string;
  birthDate: string;
  deathDate: string;
  age: string;
  address: string;
  contact: string;
  burialLocation: string;
}

const CATEGORIES = [
  { id: 'all', label: 'TẤT CẢ DANH BỘ' },
  { id: 'vang-sinh-duong-nu', label: 'VÃNG SINH ĐƯỜNG (NỮ)' },
  { id: 'vang-sinh-duong-nam', label: 'VÃNG SINH ĐƯỜNG (NAM)' },
  { id: 'nha-tu-an-to-tien', label: 'TỨ ÂN - TỔ TIÊN' },
  { id: 'nha-tu-an-ca-nhan', label: 'TỨ ÂN - CÁ NHÂN' },
  { id: 'phu-mau-xuat-gia', label: 'PHỤ MẪU XUẤT GIA' },
  { id: 'huong-linh-xuat-gia', label: 'HƯƠNG LINH XUẤT GIA' },
];

export const MemorialSearchEngine: FC<{ initialCategory?: string }> = ({ initialCategory = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [selectedRecord, setSelectedRecord] = useState<MemorialRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const data: MemorialRecord[] = MEMORIAL_RAW_DATA as MemorialRecord[];

  const filteredRecords = useMemo(() => {
    return data.filter((item) => {
      if (selectedCat !== 'all' && item.categorySlug !== selectedCat) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDharma = item.dharmaName?.toLowerCase().includes(q);
        const matchCode = item.code?.toLowerCase().includes(q);
        const matchAddress = item.address?.toLowerCase().includes(q);
        const matchBurial = item.burialLocation?.toLowerCase().includes(q);
        const matchContact = item.contact?.toLowerCase().includes(q);
        if (!matchName && !matchDharma && !matchCode && !matchAddress && !matchBurial && !matchContact) {
          return false;
        }
      }
      return true;
    });
  }, [data, selectedCat, searchQuery]);

  const handleShare = (rec: MemorialRecord) => {
    const shareText = `Tra cứu bài vị Tùng Lâm Hòa Phúc:\n- Họ tên: ${rec.name}\n- Pháp danh: ${rec.dharmaName || 'N/A'}\n- Mã số: ${rec.code || 'N/A'}\n- Khu vực: ${rec.category}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── 1. KHUNG TÌM KIẾM THÔNG MINH THANH TRÁT AI (MOBILE FIRST) ── */}
      <div className="bg-gradient-to-b from-[#2A170F] to-[#1C1008] p-4 sm:p-5 rounded-2xl border border-[#F2C14E]/35 shadow-2xl space-y-3">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Nhãn LỰA CHỌN nhẹ nhàng thanh lịch */}
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]/80 shrink-0 select-none mr-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            LỰA CHỌN:
          </span>

          {/* Search Input Bar */}
          <div className="relative flex-1 min-w-[220px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập họ tên, pháp danh, mã số bài vị, quê quán hoặc SĐT người thân..."
              className="w-full pl-10 pr-9 py-2 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 rounded-xl text-xs md:text-sm text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] hover:border-[#F2C14E]/70 transition-all shadow-inner"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FFE5A3]/60 hover:text-[#F2C14E] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Category Dropdown */}
          <CustomDropdown
            labelPrefix="Danh bộ"
            value={selectedCat}
            options={CATEGORIES.map((c) => ({ id: c.id, name: c.label }))}
            onChange={setSelectedCat}
            placeholder="Tất cả danh bộ"
            panelWidthClass="min-w-[250px]"
          />
        </div>

        {/* Result Header Info */}
        <div className="flex items-center justify-between text-xs text-[#FFE5A3]/80 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[#F2C14E]">❖</span>
            <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              Tìm thấy <strong className="text-[#F2C14E] font-bold text-sm">{filteredRecords.length}</strong> bài vị hương linh
            </span>
          </div>
          <span className="text-[11px] text-[#c9b896]/70 hidden sm:inline" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Cập nhật tự động từ Sổ Bộ Chùa Tùng Lâm Hòa Phúc
          </span>
        </div>
      </div>

      {/* ── 2. LƯỚI BÀI VỊ DẠNG THANH TRÁT TRUYỀN THỐNG ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredRecords.slice(0, 60).map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedRecord(item)}
            className="group relative rounded-2xl bg-gradient-to-b from-[#2A180E] via-[#201107] to-[#160B04] border border-[#F2C14E]/30 p-4 sm:p-5 hover:border-[#F2C14E] hover:shadow-[0_10px_30px_rgba(242,193,78,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Header Tag + Code */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="text-[10px] font-bold text-[#F2C14E] bg-[#140B05] px-2.5 py-0.5 rounded-md border border-[#F2C14E]/30 uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {item.category}
              </span>
              {item.code && (
                <span
                  className="text-xs font-bold text-[#FFE5A3] bg-[#8B1E0F]/80 px-2 py-0.5 rounded border border-[#F2C14E]/50"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  MÃ SỐ: {item.code}
                </span>
              )}
            </div>

            {/* Main Name & Dharma Name */}
            <div className="my-2 space-y-1">
              <h4
                className="text-2xl sm:text-3xl text-[#FFE5A3] font-normal uppercase group-hover:text-[#F2C14E] transition-colors leading-tight"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {item.name}
              </h4>
              {item.dharmaName && item.dharmaName !== 'N/A' && (
                <p className="text-xs text-[#F2C14E] font-bold tracking-wide" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  Pháp danh: {item.dharmaName}
                </p>
              )}
            </div>

            {/* Meta details */}
            <div className="space-y-1 text-xs text-[#e3d2c1]/85 border-t border-[#F2C14E]/20 pt-2.5 mt-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              {item.deathDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  <span>Ngày mất: <strong className="text-white">{item.deathDate}</strong> {item.age ? `(Hưởng ${item.age} tuổi)` : ''}</span>
                </div>
              )}
              {item.burialLocation && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  <span className="line-clamp-1">{item.burialLocation}</span>
                </div>
              )}
              {item.contact && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#c9b896]/80">
                  <Phone className="w-3 h-3 text-[#F2C14E]/70 shrink-0" />
                  <span className="line-clamp-1">LH: {item.contact}</span>
                </div>
              )}
            </div>

            {/* Bottom action bar */}
            <div className="mt-3 pt-2 border-t border-[#F2C14E]/15 flex items-center justify-between text-[11px] text-[#F2C14E]">
              <span className="group-hover:underline">Chi tiết bài vị ➔</span>
              <span className="text-xs opacity-70">❖</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#1C1008] border border-[#F2C14E]/30 space-y-3">
          <p className="text-3xl">🪔</p>
          <h4 className="text-xl font-bold text-[#FFE5A3]" style={{ fontFamily: "'UTM Niagara', serif" }}>
            KHÔNG TÌM THẤY BÀI VỊ PHÙ HỢP
          </h4>
          <p className="text-xs text-[#c9b896] max-w-md mx-auto" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Quý Phật tử vui lòng kiểm tra lại họ tên có dấu / không dấu, hoặc liên hệ trực tiếp với Ban Tri Khách Tùng Lâm Hòa Phúc để được hỗ trợ tra cứu sổ bộ.
          </p>
        </div>
      )}

      {/* ── 3. MODAL CHI TIẾT THANH TRÁT BÀI VỊ (FULL POP-UP) ── */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="relative max-w-md w-full rounded-3xl border-2 border-[#F2C14E] bg-gradient-to-b from-[#2C180E] via-[#1E1108] to-[#120904] p-6 shadow-[0_0_60px_rgba(242,193,78,0.4)] text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center border border-[#F2C14E]/50 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge */}
            <div className="text-center space-y-1">
              <span className="text-xs text-[#F2C14E] tracking-widest font-bold uppercase" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                ❖ TÙNG LÂM HÒA PHÚC ❖
              </span>
              <h3 className="text-sm font-bold text-[#FFE5A3] uppercase" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {selectedRecord.category}
              </h3>
            </div>

            {/* Traditional Tablet Border Box */}
            <div className="rounded-2xl border-2 border-[#F2C14E]/70 p-5 bg-[#140B05] text-center space-y-3 relative shadow-inner">
              {selectedRecord.code && (
                <div className="inline-block px-3 py-1 rounded-full bg-[#8B1E0F] border border-[#F2C14E] text-xs font-bold text-white mb-1">
                  MÃ SỐ BÀI VỊ: {selectedRecord.code}
                </div>
              )}

              <div>
                <p className="text-xs text-[#F2C14E]/80 uppercase tracking-wider" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  PHỤNG VÌ HƯƠNG LINH
                </p>
                <h2
                  className="text-3xl sm:text-4xl text-[#FFE5A3] font-normal uppercase py-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {selectedRecord.name}
                </h2>
                {selectedRecord.dharmaName && selectedRecord.dharmaName !== 'N/A' && (
                  <p className="text-sm text-[#F2C14E] font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    Pháp danh: {selectedRecord.dharmaName}
                  </p>
                )}
              </div>

              {/* Thông tin ngày sinh / ngày mất */}
              <div className="border-t border-[#F2C14E]/25 pt-3 space-y-1.5 text-xs text-[#e3d2c1]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {selectedRecord.birthDate && (
                  <p>Sinh ngày: <strong className="text-white">{selectedRecord.birthDate}</strong></p>
                )}
                {selectedRecord.deathDate && (
                  <p>Tạ thế ngày: <strong className="text-white">{selectedRecord.deathDate}</strong> {selectedRecord.age ? `(Hưởng ${selectedRecord.age} tuổi)` : ''}</p>
                )}
                {selectedRecord.burialLocation && (
                  <p>An táng / Thờ tự tại: <strong className="text-[#FFE5A3]">{selectedRecord.burialLocation}</strong></p>
                )}
                {selectedRecord.address && (
                  <p>Nguyên quán: <span>{selectedRecord.address}</span></p>
                )}
                {selectedRecord.contact && (
                  <p className="text-[11px] text-[#c9b896]">Liên hệ thân nhân: {selectedRecord.contact}</p>
                )}
              </div>
            </div>

            {/* Action Buttons: Share & Copy */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleShare(selectedRecord)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-xs uppercase flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'ĐÃ SAO CHÉP THÔNG TIN' : 'CHIA SẺ CHO GIA ĐÌNH'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
