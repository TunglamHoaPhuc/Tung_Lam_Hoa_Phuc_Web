'use client';

import React, { FC, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronRight, MapPin, Phone, Search, Sparkles, X } from 'lucide-react';
import {
  MemorialPublicRecord,
  matchesCategoryFilter,
  normalizeVietnamese,
} from '@/lib/memorial-types';
import { MemorialDetailDialog } from './MemorialDetailDialog';

interface MemorialSearchEngineProps {
  initialRecords: MemorialPublicRecord[];
  initialCategory?: string;
}

export const MemorialSearchEngine: FC<MemorialSearchEngineProps> = ({
  initialRecords,
  initialCategory = 'all',
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = initialCategory || 'all';
  const [records, setRecords] = useState<MemorialPublicRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(40);
  const [selectedRecord, setSelectedRecord] = useState<MemorialPublicRecord | null>(null);
  const [serverPhoneResults, setServerPhoneResults] = useState<MemorialPublicRecord[] | null>(null);
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);

  // Cập nhật dữ liệu mới nhất ngầm từ API (phòng trường hợp trang vừa qua cache CDN sau khi Admin sync)
  useEffect(() => {
    let active = true;
    fetch('/api/memorials', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data?.records)) {
          setRecords(json.data.records);
        }
      })
      .catch(() => {
        // Giữ nguyên dữ liệu SSR nếu mất mạng tạm thời
      });
    return () => {
      active = false;
    };
  }, []);

  // Nếu người dùng nhập >= 6 chữ số (tìm bằng SĐT đầy đủ), gọi API tìm theo SĐT gốc trên server
  useEffect(() => {
    const digitsOnly = searchQuery.replace(/\D/g, '');
    if (digitsOnly.length < 6) {
      setServerPhoneResults(null);
      setIsSearchingPhone(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsSearchingPhone(true);
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          khu: selectedCategory,
        });
        const res = await fetch(`/api/memorials?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data?.records)) {
          setServerPhoneResults(json.data.records);
        }
      } catch {
        // Bỏ qua nếu request bị hủy khi người dùng gõ tiếp
      } finally {
        setIsSearchingPhone(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedCategory]);

  const recordsInCategory = useMemo(() => {
    return records.filter((item) => matchesCategoryFilter(item.categorySlug, selectedCategory));
  }, [records, selectedCategory]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return recordsInCategory;

    const digitsOnly = q.replace(/\D/g, '');
    if (digitsOnly.length >= 6 && serverPhoneResults !== null) {
      return serverPhoneResults;
    }

    const normQ = normalizeVietnamese(q);
    if (!normQ) return recordsInCategory;

    const tokens = normQ.split(' ').filter(Boolean);

    return recordsInCategory.filter((item) => {
      const haystack = normalizeVietnamese(
        [
          item.code,
          item.name,
          item.dharmaName,
          item.lineageType,
          item.age,
          item.deathDate,
          item.birthDate,
          item.address,
          item.burialLocation,
          item.contactMasked,
          item.category,
        ]
          .filter(Boolean)
          .join(' ')
      );
      return tokens.every((tok) => haystack.includes(tok));
    });
  }, [recordsInCategory, searchQuery, serverPhoneResults]);

  const hasQuery = searchQuery.trim().length > 0;
  const visibleRecords = filteredRecords.slice(0, displayLimit);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Bảo vệ bộ gõ tiếng Việt IME (Unikey/Telex/VNI) theo ime-safe-enter-submit
      if (e.nativeEvent.isComposing || e.keyCode === 229) {
        return;
      }
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* ── KHUNG TÌM KIẾM TỐI GIẢN ── */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1E120A]/95 p-4 sm:p-5 shadow-xl space-y-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            inputRef.current?.blur();
          }}
          className="space-y-2"
          role="search"
        >
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#F2C14E]"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Tìm mã số bài vị (Tên hương linh, dòng họ, pháp danh, tuổi hoặc SĐT)
          </label>

          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2C14E]/75 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayLimit(40);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Ví dụ: Nguyễn Văn..., Trần Tộc, Liên Vân, 650..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#130B06] border border-[#F2C14E]/45 text-sm sm:text-base text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] focus:ring-2 focus:ring-[#F2C14E]/25 transition-all [&::-webkit-search-cancel-button]:hidden"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setServerPhoneResults(null);
                  inputRef.current?.focus();
                }}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-[#c9b896] hover:text-[#FFE5A3] hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── KHU VỰC KẾT QUẢ ── */}
      {!hasQuery ? (
        <div
          className="rounded-2xl border border-[#F2C14E]/20 bg-[#1A1009]/80 px-5 py-7 text-center space-y-2"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          <p className="text-sm font-semibold text-[#FFE5A3]">
            Nhập thông tin để tra cứu mã số bài vị
          </p>
          <p className="text-xs text-[#c9b896]/85 max-w-md mx-auto leading-relaxed">
            Quý Phật tử gõ tên hương linh (có dấu hoặc không dấu), tên dòng họ (với Tổ Tiên), pháp danh hoặc 4 số cuối SĐT người thân để tra nhanh <strong className="text-[#F2C14E]">Mã số bài vị</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Thanh đếm kết quả */}
          <div
            className="flex items-center justify-between px-1 text-xs text-[#c9b896]"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span>
              {isSearchingPhone ? (
                'Đang đối chiếu số điện thoại...'
              ) : (
                <>
                  Tìm thấy <strong className="text-[#F2C14E] text-sm">{filteredRecords.length}</strong> bài vị phù hợp
                </>
              )}
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div
              className="rounded-2xl border border-[#F2C14E]/25 bg-[#1A1009] px-5 py-8 text-center space-y-2"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <p className="text-base font-bold text-[#FFE5A3]">
                Không tìm thấy bài vị phù hợp
              </p>
              <p className="text-xs text-[#c9b896] max-w-md mx-auto leading-relaxed">
                Quý vị vui lòng thử gõ ngắn gọn hơn (chỉ nhập Tên hoặc Họ), hoặc liên hệ Ban Tri Khách Tùng Lâm Hòa Phúc để được kiểm tra sổ gốc.
              </p>
            </div>
          ) : (
            <>
              {/* Danh sách thẻ kết quả tối giản, đặt MÃ SỐ ở trung tâm */}
              <div className="space-y-2.5">
                {visibleRecords.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRecord(item)}
                    className="w-full text-left group rounded-xl border border-[#F2C14E]/25 bg-[#1B1009] hover:border-[#F2C14E] hover:bg-[#24160D] px-3.5 py-3 sm:px-4 sm:py-3.5 transition-all flex items-center gap-3.5 sm:gap-4 cursor-pointer shadow-sm"
                  >
                    {/* Ô MÃ SỐ BÀI VỊ NỔI BẬT */}
                    <div className="shrink-0 min-w-[74px] sm:min-w-[84px] rounded-lg bg-[#7A1B0E] border border-[#F2C14E]/75 px-2.5 py-2 text-center shadow-inner">
                      <span
                        className="block text-[9px] uppercase tracking-wider text-[#FFE5A3]/85 leading-none mb-1"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        Mã số
                      </span>
                      <span className="block font-mono text-lg sm:text-xl font-bold text-[#FFE5A3] leading-none">
                        {item.code || '—'}
                      </span>
                    </div>

                    {/* Thông tin nhận diện cơ bản */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <h3
                          className="text-base sm:text-lg font-bold text-[#FFE5A3] group-hover:text-[#F2C14E] transition-colors truncate"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {item.name}
                        </h3>
                        {item.lineageType && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/30 font-semibold shrink-0">
                            {item.lineageType}
                          </span>
                        )}
                      </div>

                      <div
                        className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#e3d2c1]/85"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <span className="text-[#F2C14E]/95 font-medium">{item.category}</span>
                        {item.dharmaName && (
                          <span className="inline-flex items-center gap-1 text-[#FFE5A3]">
                            <Sparkles className="w-3 h-3 text-[#F2C14E]/80 shrink-0" />
                            PD: {item.dharmaName}
                          </span>
                        )}
                        {(item.deathDate || item.age) && (
                          <span className="inline-flex items-center gap-1 text-[#c9b896]">
                            <Calendar className="w-3 h-3 text-[#F2C14E]/70 shrink-0" />
                            {item.deathDate ? `Mất: ${item.deathDate}` : ''}
                            {item.age ? `${item.deathDate ? ' • ' : ''}${item.age} tuổi` : ''}
                          </span>
                        )}
                      </div>

                      {(item.address || item.contactMasked) && (
                        <div
                          className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#c9b896]/80"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {item.address && (
                            <span className="inline-flex items-center gap-1 truncate max-w-full">
                              <MapPin className="w-3 h-3 text-[#F2C14E]/60 shrink-0" />
                              <span className="truncate">{item.address}</span>
                            </span>
                          )}
                          {item.contactMasked && (
                            <span className="inline-flex items-center gap-1 shrink-0">
                              <Phone className="w-3 h-3 text-[#F2C14E]/60 shrink-0" />
                              <span>{item.contactMasked}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <ChevronRight
                      className="w-4 h-4 text-[#F2C14E]/50 group-hover:text-[#F2C14E] group-hover:translate-x-0.5 transition-all shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              {displayLimit < filteredRecords.length && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 40)}
                    className="px-6 py-2 rounded-full border border-[#F2C14E]/45 text-xs font-semibold text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C1008] transition-colors cursor-pointer"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    Xem thêm ({filteredRecords.length - displayLimit} kết quả)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Popup chi tiết (Native <dialog>) */}
      <MemorialDetailDialog
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
