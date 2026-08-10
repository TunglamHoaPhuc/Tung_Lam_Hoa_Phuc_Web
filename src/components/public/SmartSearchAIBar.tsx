'use client';

import React, { FC, useState } from 'react';
import { Sparkles, BookOpen, ExternalLink, X, Mic, ChevronDown, Send } from 'lucide-react';
import Link from 'next/link';

interface SmartSearchAIBarProps {
  /** Tên bài viết hoặc chủ đề ngữ cảnh (VD: "Sư Tổ Ngộ Chân Tử", "Dòng Chảy Hoằng Pháp") */
  contextTitle?: string;
}

interface AIResponse {
  answer: string;
  relatedLinks: Array<{ title: string; url: string; category: string }>;
}

export const SmartSearchAIBar: FC<SmartSearchAIBarProps> = ({
  contextTitle = 'Giáo lý & Hoạt động Tùng Lâm Hòa Phúc',
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState('Tự viện');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    // Mock AI delay
    setTimeout(() => {
      setLoading(false);
      setResponse({
        answer: `Nam Mô A Di Đà Phật! Về câu hỏi "${query}" liên quan đến ${contextTitle}:\n\nTheo tinh thần giáo lý Đại thừa và tôn chỉ tu học tại Tùng Lâm Hòa Phúc, hành giả nên nuôi dưỡng Bồ Đề Tâm, lấy niệm Phật - lắng nghe Pháp âm làm phương tiện thanh tịnh hóa ba nghiệp Thân - Khẩu - Ý. Mọi sự chuyển hóa nội tâm đều bắt đầu từ việc thấu hiểu Tứ Diệu Đế và thực hành chánh niệm trong từng phút giây cuộc sống.`,
        relatedLinks: [
          {
            title: 'Khuyến Phát Bồ Đề Tâm Giảng Luận — Thích Tâm Hòa',
            url: '/tong-chi-tu-hoc/bo-de-tam',
            category: 'Tông Chỉ Tu Học',
          },
          {
            title: 'Pháp thoại: Tứ Diệu Đế và Con Đường Giải Thoát',
            url: '/dong-chay-hoang-phap/le-gio-to-lan-thu-37-to-dinh-hoang-phap',
            category: 'Pháp Âm',
          },
          {
            title: 'Lịch tu học & Lễ Sám Hối định kỳ tại Tùng Lâm Hòa Phúc',
            url: '/#lich-tu',
            category: 'Cộng Tu',
          },
        ],
      });
    }, 900);
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (err) {
        setIsListening(false);
      }
    } else {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói tiếng Việt.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10 px-4">
      {/* ── 1. TIÊU ĐỀ KHUNG TRỢ LÝ AI (UTM Avo, text-lg md:text-xl text-[#FFE5A3]) ── */}
      <h3
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="text-lg md:text-xl text-[#FFE5A3] font-medium text-center mb-5 tracking-wide"
      >
        Trao đổi và tìm kiếm thông tin bằng trợ lý AI
      </h3>

      {/* ── 2. THANH INPUT CHAT CAPSULE PHONG CÁCH GEMINI ── */}
      <div className="relative w-full max-w-2xl mx-auto bg-[#1C130D] border border-[#F2C14E]/30 hover:border-[#F2C14E]/60 focus-within:border-[#F2C14E] rounded-full px-5 py-3.5 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300">
        {/* Icon Nút Cộng bên trái */}
        <button
          type="button"
          className="text-[#D3C0AD] hover:text-[#F2C14E] transition-colors flex-shrink-0 cursor-pointer"
          title="Tải lên hoặc đính kèm tệp"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Ô Nhập Text (Input Field) */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center min-w-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hỏi AI Hòa Phúc"
            className="w-full bg-transparent text-[#FFE5A3] placeholder-[#A69383] text-sm md:text-base focus:outline-none font-sans"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          />
        </form>

        {/* Cụm Icon bên phía phải (Option Dropdown & Voice Mic & Send Button) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Option Mở rộng (Tùy chọn model) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="text-xs text-[#D3C0AD]/80 hover:text-[#F2C14E] cursor-pointer flex items-center gap-1 bg-[#2A1D14]/80 border border-[#F2C14E]/20 px-2.5 py-1 rounded-full transition-colors select-none"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>{selectedModel}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showModelDropdown && (
              <div className="absolute right-0 bottom-full mb-2 w-36 bg-[#1C130D] border border-[#F2C14E]/40 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                {['Tự viện', 'Flash Mở rộng', 'Tra cứu Kinh Văn'].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#F2C14E]/15 transition-colors cursor-pointer ${
                      selectedModel === model ? 'text-[#F2C14E] font-bold' : 'text-[#D3C0AD]'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nút Dictate (Ghi âm / Micro) */}
          <button
            type="button"
            title="Nhập bằng giọng nói"
            onClick={handleVoiceInput}
            className={`text-[#D3C0AD] hover:text-[#F2C14E] p-1.5 transition-colors cursor-pointer rounded-full ${
              isListening ? 'text-[#F2C14E] animate-pulse bg-[#F2C14E]/15' : ''
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Nút Gửi */}
          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            disabled={loading || !query.trim()}
            title="Gửi câu hỏi"
            className="w-8 h-8 rounded-full bg-[#F2C14E] text-[#1C130D] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40 cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4 fill-[#1C130D]" />
          </button>
        </div>
      </div>

      {/* ── State: Loading ── */}
      {loading && (
        <div className="mt-4 max-w-2xl mx-auto p-4 rounded-2xl bg-[#1C130D]/90 border border-[#F2C14E]/30 flex items-center gap-3 shadow-lg">
          <div className="w-5 h-5 rounded-full border-2 border-[#F2C14E] border-t-transparent animate-spin flex-shrink-0" />
          <span
            className="text-xs text-[#F2C14E] italic"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Trợ lý AI Tùng Lâm Hòa Phúc đang suy nghĩ và tổng hợp câu trả lời...
          </span>
        </div>
      )}

      {/* ── State: Response output ── */}
      {response && !loading && (
        <div
          className="mt-6 max-w-2xl mx-auto p-5 rounded-2xl border relative animate-in fade-in duration-300 shadow-2xl"
          style={{
            background: 'rgba(28,19,13,0.95)',
            borderColor: 'rgba(242,193,78,0.4)',
          }}
        >
          <button
            onClick={() => setResponse(null)}
            className="absolute top-3 right-3 text-[#D3C0AD] hover:text-[#F2C14E] p-1 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#F2C14E]" />
            <span
              className="text-xs uppercase font-bold text-[#F2C14E] tracking-widest"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Câu trả lời từ Trợ lý AI:
            </span>
          </div>

          <p
            className="text-sm leading-relaxed whitespace-pre-line text-[#FFE5A3] mb-5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {response.answer}
          </p>

          {/* Related links */}
          {response.relatedLinks.length > 0 && (
            <div className="border-t pt-4" style={{ borderColor: 'rgba(242,193,78,0.15)' }}>
              <div
                className="text-xs uppercase font-bold text-[#F2C14E] mb-3 flex items-center gap-1.5"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Gợi ý liên quan:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {response.relatedLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url}
                    className="p-3 rounded-xl border flex flex-col justify-between transition-all hover:border-[#F2C14E] hover:-translate-y-0.5 group bg-[#2A1D14]/60 border-[#F2C14E]/20"
                  >
                    <span
                      className="text-[10px] uppercase font-bold text-[#F2C14E] mb-1"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {link.category}
                    </span>
                    <span
                      className="text-xs text-[#FFE5A3] group-hover:text-[#F2C14E] leading-snug font-medium line-clamp-2"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {link.title}
                    </span>
                    <span className="text-[10px] text-[#F2C14E] mt-2 flex items-center gap-1">
                      <span>Xem chi tiết</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AIChatBox = SmartSearchAIBar;
export default SmartSearchAIBar;
