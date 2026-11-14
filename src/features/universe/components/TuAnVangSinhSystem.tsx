'use client';

import React, { FC, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { MemorialPublicRecord, normalizeVietnamese } from '@/lib/memorial-types';
import { MemorialDetailDialog } from '@/features/memorial/components/MemorialDetailDialog';

export const TuAnVangSinhSystem: FC = () => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<MemorialPublicRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MemorialPublicRecord | null>(null);

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
        // Bỏ qua nếu tạm mất kết nối
      });

    return () => {
      active = false;
    };
  }, []);

  const matchedRecords = useMemo(() => {
    const q = normalizeVietnamese(searchQuery);
    if (!q) return [];
    const tokens = q.split(' ').filter(Boolean);

    return records
      .filter((item) => {
        const haystack = normalizeVietnamese(
          [
            item.code,
            item.name,
            item.dharmaName,
            item.lineageType,
            item.age,
            item.deathDate,
            item.address,
            item.contactMasked,
          ]
            .filter(Boolean)
            .join(' ')
        );
        return tokens.every((tok) => haystack.includes(tok));
      })
      .slice(0, 8);
  }, [records, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-gradient-to-br from-[#23150C] via-[#1B1009] to-[#140B05] p-5 sm:p-6 shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#FFE5A3] uppercase tracking-wide"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              TRA CỨU MÃ SỐ BÀI VỊ HƯƠNG LINH
            </h2>
            <p
              className="text-xs text-[#c9b896] mt-0.5"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Nhà Tứ Ân &amp; Vãng Sinh Đường • Nhập họ tên, dòng họ, pháp danh hoặc tuổi.
            </p>
          </div>

          <Link
            href="/tra-cuu-bai-vi"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C1008] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shrink-0 self-start sm:self-center"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span>Mở trang tra cứu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            inputRef.current?.blur();
          }}
          className="relative"
          role="search"
        >
          <label htmlFor={inputId} className="sr-only">
            Tìm kiếm mã số bài vị hương linh
          </label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/75 pointer-events-none"
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Gõ tên hương linh, họ tộc, pháp danh hoặc mã số..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#120A05] border border-[#F2C14E]/40 text-sm text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] transition-colors [&::-webkit-search-cancel-button]:hidden"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Xóa từ khóa"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-[#c9b896] hover:text-[#FFE5A3] flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Chỉ hiện danh sách gọn khi người dùng nhập tìm kiếm */}
        {searchQuery.trim() && (
          <div className="space-y-1.5 pt-1">
            {matchedRecords.length === 0 ? (
              <p
                className="text-xs text-[#c9b896] py-2 px-1"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                Không tìm thấy bài vị phù hợp. Vui lòng thử gõ ngắn gọn hơn hoặc nhấn &ldquo;Mở trang tra cứu&rdquo;.
              </p>
            ) : (
              matchedRecords.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRecord(item)}
                  className="w-full text-left rounded-xl border border-[#F2C14E]/25 bg-[#160D07] hover:border-[#F2C14E] px-3 py-2 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 px-2.5 py-1 rounded bg-[#7A1B0E] border border-[#F2C14E]/60 font-mono text-xs font-bold text-[#FFE5A3]">
                      MS: {item.code || '—'}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold text-[#FFE5A3] truncate"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-[11px] text-[#c9b896] truncate"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {item.category}
                        {item.dharmaName ? ` • PD: ${item.dharmaName}` : ''}
                        {item.age ? ` • ${item.age} tuổi` : ''}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#F2C14E]/70 shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <MemorialDetailDialog
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
