'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Palette,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface FeaturedProgram {
  id: string;
  title: string;
  schedule: string;
  summary: string;
  imgUrl: string;
}

interface MonthTheme {
  month: number;
  bannerImg: string;
  title: string;
  quoteLines: string[];
  author: string;
  primaryColor: string;
  secondaryColor: string;
  themeBg: string;
}

interface CustomEvent {
  id: string;
  solarDateStr: string;
  title: string;
  category: string;
  timeSlot1Label?: string;
  timeSlot1Time?: string;
  location: string;
  description: string;
  imgUrl?: string;
}

const DEFAULT_BANNER_SUGGESTIONS = [
  { label: 'Tháng 1: Đức Bản Sư Thành Đạo', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-01-duc-ban-su-thanh-dao.webp' },
  { label: 'Tháng 2: Nghinh Xuân Di Lặc', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-02-nghinh-xuan-di-lac.webp' },
  { label: 'Tháng 3: Hương Sen Tây Bắc', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-03-huong-sen-tay-bac.webp' },
  { label: 'Tháng 4: Hướng Về Cội Nguồn', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-04-huong-ve-coi-nguon.webp' },
  { label: 'Tháng 5: Phật Đản', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-05-phat-dan.webp' },
  { label: 'Tháng 6: Ươm Mầm Sen Việt', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-06-uom-mam-sen-viet.webp' },
  { label: 'Tháng 7: Đền Ơn Đáp Nghĩa', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-07-den-on-dap-nghia.webp' },
  { label: 'Tháng 8: Hiếu Hạnh Đáp Đền', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-08-hieu-hanh-dap-den.webp' },
  { label: 'Tháng 9: Thanh Nguyệt Hương Thu', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-09-thanh-nguyet-huong-thu.webp' },
  { label: 'Tháng 10: Hạnh Nguyện Quan Âm', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-10-hanh-nguyen-quan-am.webp' },
  { label: 'Tháng 11: Ân Đức Tổ Thầy', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-11-an-duc-to-thay.webp' },
  { label: 'Tháng 12: Vía Phật Di Đà', url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-12-via-phat-di-da.webp' },
];

export default function AdminSchedulePage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'themes' | 'custom'>('programs');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [monthThemes, setMonthThemes] = useState<Record<string, MonthTheme>>({});
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(7); // Default August (index 7)

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/schedule');
      const data = await res.json();
      if (data.success && data.data) {
        setPrograms(data.data.featuredPrograms || []);
        setMonthThemes(data.data.monthThemes || {});
        setCustomEvents(data.data.customEvents || []);
      }
    } catch (err: any) {
      setMessage({ text: 'Lỗi tải lịch: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featuredPrograms: programs,
          monthThemes,
          customEvents,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Đã lưu lịch tu học lên Cloud S3 thành công!', type: 'success' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: data.error || 'Lỗi khi lưu dữ liệu', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: 'Lỗi kết nối: ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Program Handlers
  const addProgram = () => {
    const newProg: FeaturedProgram = {
      id: 'p-' + Date.now(),
      title: 'CHƯƠNG TRÌNH TU HỌC MỚI',
      schedule: 'ĐỊNH KỲ HẰNG THÁNG',
      summary: 'Mô tả tóm tắt thời khóa tu học và ý nghĩa sự kiện...',
      imgUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
    };
    setPrograms([newProg, ...programs]);
  };

  const updateProgram = (index: number, field: keyof FeaturedProgram, value: string) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const deleteProgram = (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chương trình này?')) {
      const updated = programs.filter((_, i) => i !== index);
      setPrograms(updated);
    }
  };

  const moveProgram = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === programs.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...programs];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setPrograms(updated);
  };

  // Month Theme Handlers
  const currentMonthData = monthThemes[String(selectedMonthIdx)] || {
    month: selectedMonthIdx + 1,
    bannerImg: '',
    title: '',
    quoteLines: [],
    author: 'Vô Trí - Tâm Hòa',
    primaryColor: '#8B3A1C',
    secondaryColor: '#F2C14E',
    themeBg: '#2A170F',
  };

  const updateCurrentMonthField = (field: keyof MonthTheme, value: any) => {
    setMonthThemes({
      ...monthThemes,
      [String(selectedMonthIdx)]: {
        ...currentMonthData,
        [field]: value,
      },
    });
  };

  // Custom Events Handlers
  const addCustomEvent = () => {
    const newEvent: CustomEvent = {
      id: 'evt-' + Date.now(),
      solarDateStr: '15.08.2026',
      title: 'ĐẠI LỄ ĐẶC BIỆT',
      category: 'Đại Lễ Sự Kiện',
      timeSlot1Label: 'Buổi Sáng',
      timeSlot1Time: '08h00',
      location: 'Đại Hùng Bảo Điện & Giảng Đường',
      description: 'Nội dung chi tiết về chương trình đại lễ...',
    };
    setCustomEvents([newEvent, ...customEvents]);
  };

  const updateCustomEvent = (index: number, field: keyof CustomEvent, value: string) => {
    const updated = [...customEvents];
    updated[index] = { ...updated[index], [field]: value };
    setCustomEvents(updated);
  };

  const deleteCustomEvent = (index: number) => {
    if (confirm('Xóa sự kiện này?')) {
      setCustomEvents(customEvents.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2A180D] via-[#1E1109] to-[#2A180D] p-6 rounded-2xl border border-[#F2C14E]/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F2C14E]/15 rounded-xl border border-[#F2C14E]/40 text-[#F2C14E]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#F2C14E] tracking-wide">
                Quản Trị Lịch Tu Học & Sự Kiện
              </h1>
              <p className="text-xs md:text-sm text-[#e3d2c1]/80 mt-0.5">
                Thiết lập chương trình nổi bật, sắp xếp thời khóa và tùy biến banner 12 tháng
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/#calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#2A180D] hover:bg-[#3A2213] text-[#e3d2c1] border border-[#F2C14E]/30 rounded-xl text-xs md:text-sm flex items-center gap-2 transition"
          >
            <Eye className="w-4 h-4 text-[#F2C14E]" />
            <span>Xem Trang Chủ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#F2C14E] to-[#D4A338] hover:from-[#f5cb68] hover:to-[#dfaf44] text-black font-semibold rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-lg hover:shadow-[#F2C14E]/20 transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi (Cloud S3)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert / Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#F2C14E]/20 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('programs')}
          className={`px-5 py-3 font-medium text-sm rounded-t-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'programs'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Chương Trình Tu Học Nổi Bật ({programs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('themes')}
          className={`px-5 py-3 font-medium text-sm rounded-t-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'themes'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Chủ Đề & Banner 12 Tháng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`px-5 py-3 font-medium text-sm rounded-t-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'custom'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sự Kiện Đặc Biệt Bổ Sung ({customEvents.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#e3d2c1]/60 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#F2C14E]" />
          <p>Đang tải dữ liệu lịch tu học...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: FEATURED PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#e3d2c1]/70">
                  Các thẻ chương trình định kỳ hiển thị nổi bật dạng Carousel và danh sách trên trang chủ.
                </p>
                <button
                  type="button"
                  onClick={addProgram}
                  className="px-4 py-2 bg-[#2A180D] hover:bg-[#3A2213] text-[#F2C14E] border border-[#F2C14E]/40 rounded-xl text-xs md:text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Chương Trình Mới</span>
                </button>
              </div>

              <div className="space-y-4">
                {programs.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 bg-[#1E1109] rounded-2xl border border-[#F2C14E]/25 shadow-xl flex flex-col lg:flex-row gap-6 items-start transition hover:border-[#F2C14E]/40"
                  >
                    {/* Thumbnail Preview */}
                    <div className="w-full lg:w-48 h-32 relative rounded-xl overflow-hidden shrink-0 border border-[#F2C14E]/20 bg-black/40">
                      {item.imgUrl ? (
                        <Image
                          src={item.imgUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#e3d2c1]/40">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] font-bold text-[#F2C14E]">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                          TIÊU ĐỀ CHƯƠNG TRÌNH
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateProgram(idx, 'title', e.target.value)}
                          className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                          LỊCH THỜI KHÓA (SCHEDULE TAG)
                        </label>
                        <input
                          type="text"
                          value={item.schedule}
                          onChange={(e) => updateProgram(idx, 'schedule', e.target.value)}
                          placeholder="Ví dụ: 14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG"
                          className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                          TÓM TẮT THỜI KHÓA & Ý NGHĨA
                        </label>
                        <textarea
                          rows={2}
                          value={item.summary}
                          onChange={(e) => updateProgram(idx, 'summary', e.target.value)}
                          className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                          ĐƯỜNG DẪN ẢNH BANNER / THUMBNAIL S3
                        </label>
                        <input
                          type="text"
                          value={item.imgUrl}
                          onChange={(e) => updateProgram(idx, 'imgUrl', e.target.value)}
                          placeholder="https://s2-cnv03.s3.us-east-005.backblazeb2.com/..."
                          className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] font-mono text-xs focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>
                    </div>

                    {/* Actions & Reordering */}
                    <div className="flex lg:flex-col items-center gap-2 shrink-0 self-center lg:self-start pt-2">
                      <button
                        type="button"
                        onClick={() => moveProgram(idx, 'up')}
                        disabled={idx === 0}
                        title="Di chuyển lên"
                        className="p-2 bg-[#2A180D] hover:bg-[#3A2213] text-[#e3d2c1] rounded-lg border border-[#F2C14E]/20 disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProgram(idx, 'down')}
                        disabled={idx === programs.length - 1}
                        title="Di chuyển xuống"
                        className="p-2 bg-[#2A180D] hover:bg-[#3A2213] text-[#e3d2c1] rounded-lg border border-[#F2C14E]/20 disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProgram(idx)}
                        title="Xóa chương trình"
                        className="p-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 rounded-lg border border-rose-700/30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MONTH THEMES */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Month Selector Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const mInfo = monthThemes[String(i)];
                  const isSelected = selectedMonthIdx === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedMonthIdx(i)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#F2C14E] text-black font-bold border-[#F2C14E] shadow-lg'
                          : 'bg-[#1E1109] text-[#e3d2c1]/80 hover:bg-[#2A180D] border-[#F2C14E]/25'
                      }`}
                    >
                      <span className="text-xs uppercase opacity-80">Tháng</span>
                      <span className="text-base font-bold">{i + 1}</span>
                      <span className="text-[10px] truncate max-w-[70px] opacity-70">
                        {mInfo?.title ? mInfo.title.split(' ')[0] : `T${i + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Month Detail Editor */}
              <div className="p-6 bg-[#1E1109] rounded-2xl border border-[#F2C14E]/30 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F2C14E]/20 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#F2C14E] flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Cấu Hình Banner & Thiền Ngữ: Tháng {selectedMonthIdx + 1} Dương Lịch</span>
                    </h3>
                    <p className="text-xs text-[#e3d2c1]/70 mt-1">
                      Hiển thị trực tiếp trên hero banner phần Lịch Tu Học ngoài trang chủ khi người dùng chọn xem tháng này.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#e3d2c1]/60">Màu chủ đạo:</span>
                    <input
                      type="color"
                      value={currentMonthData.primaryColor || '#8B3A1C'}
                      onChange={(e) => updateCurrentMonthField('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-[#F2C14E]/30 cursor-pointer bg-transparent"
                    />
                    <input
                      type="color"
                      value={currentMonthData.secondaryColor || '#F2C14E'}
                      onChange={(e) => updateCurrentMonthField('secondaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-[#F2C14E]/30 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Banner Preview & Image URL */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#F2C14E]/30 bg-black/60 shadow-lg">
                      {currentMonthData.bannerImg ? (
                        <Image
                          src={currentMonthData.bannerImg}
                          alt={currentMonthData.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#e3d2c1]/40">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <div>
                          <p className="text-xs text-[#F2C14E] uppercase tracking-widest font-semibold">
                            Tháng {selectedMonthIdx + 1}
                          </p>
                          <h4 className="text-base font-bold text-white uppercase drop-shadow">
                            {currentMonthData.title || 'CHƯA CÓ TIÊU ĐỀ'}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                        URL ẢNH BANNER S3
                      </label>
                      <input
                        type="text"
                        value={currentMonthData.bannerImg}
                        onChange={(e) => updateCurrentMonthField('bannerImg', e.target.value)}
                        placeholder="https://s2-cnv03.s3.us-east-005.backblazeb2.com/..."
                        className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-xs font-mono text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    {/* Suggestion list */}
                    <div className="pt-1">
                      <span className="text-[11px] text-[#e3d2c1]/60 block mb-1.5">
                        Gợi ý ảnh chuẩn từ kho S3 Tùng Lâm Hòa Phúc:
                      </span>
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {DEFAULT_BANNER_SUGGESTIONS.map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => updateCurrentMonthField('bannerImg', sug.url)}
                            className="w-full text-left text-[11px] px-2.5 py-1.5 rounded bg-[#140A04] hover:bg-[#2A180D] text-[#e3d2c1]/80 hover:text-[#F2C14E] border border-[#F2C14E]/10 truncate cursor-pointer transition"
                          >
                            {sug.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Title, Quotes, Author */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                        TIÊU ĐỀ CHỦ ĐỀ THÁNG
                      </label>
                      <input
                        type="text"
                        value={currentMonthData.title}
                        onChange={(e) => updateCurrentMonthField('title', e.target.value)}
                        placeholder="Ví dụ: ĐỨC BẢN SƯ THÀNH ĐẠO"
                        className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] font-bold focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                        LỜI DẠY / BÀI KỆ THIỀN NGỮ (MỖI DÒNG LÀ MỘT CÂU)
                      </label>
                      <textarea
                        rows={7}
                        value={(currentMonthData.quoteLines || []).join('\n')}
                        onChange={(e) => updateCurrentMonthField('quoteLines', e.target.value.split('\n'))}
                        placeholder="Nhập từng dòng thơ hoặc lời dạy thiền ngữ..."
                        className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] leading-relaxed focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                        TÁC GIẢ / BẬC KHAI SƠN
                      </label>
                      <input
                        type="text"
                        value={currentMonthData.author || 'Vô Trí - Tâm Hòa'}
                        onChange={(e) => updateCurrentMonthField('author', e.target.value)}
                        className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM SPECIAL EVENTS */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#e3d2c1]/70">
                  Thêm các khóa tu đột xuất hoặc sự kiện đặc biệt theo ngày cụ thể (Dương lịch DD.MM.YYYY).
                </p>
                <button
                  type="button"
                  onClick={addCustomEvent}
                  className="px-4 py-2 bg-[#2A180D] hover:bg-[#3A2213] text-[#F2C14E] border border-[#F2C14E]/40 rounded-xl text-xs md:text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sự Kiện Đặc Biệt</span>
                </button>
              </div>

              {customEvents.length === 0 ? (
                <div className="py-16 text-center text-[#e3d2c1]/60 bg-[#1E1109] rounded-2xl border border-[#F2C14E]/20">
                  <Calendar className="w-10 h-10 mx-auto text-[#F2C14E]/50 mb-3" />
                  <p className="text-sm">Chưa có sự kiện đột xuất nào được tạo.</p>
                  <p className="text-xs opacity-70 mt-1">
                    Các sự kiện định kỳ (Sám hối, Cầu an, Niệm Phật...) đã được hệ thống tính toán tự động theo quy chuẩn Tùng Lâm.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customEvents.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="p-5 bg-[#1E1109] rounded-2xl border border-[#F2C14E]/25 shadow-xl flex flex-col md:flex-row gap-4 items-start"
                    >
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            NGÀY DƯƠNG LỊCH (DD.MM.YYYY)
                          </label>
                          <input
                            type="text"
                            value={evt.solarDateStr}
                            onChange={(e) => updateCustomEvent(idx, 'solarDateStr', e.target.value)}
                            placeholder="Ví dụ: 15.08.2026"
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] font-mono focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            TIÊU ĐỀ SỰ KIỆN
                          </label>
                          <input
                            type="text"
                            value={evt.title}
                            onChange={(e) => updateCustomEvent(idx, 'title', e.target.value)}
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] font-bold focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            DANH MỤC
                          </label>
                          <select
                            value={evt.category}
                            onChange={(e) => updateCustomEvent(idx, 'category', e.target.value)}
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                          >
                            <option value="Khóa Lễ Truyền Thống">Khóa Lễ Truyền Thống</option>
                            <option value="Đại Lễ Sự Kiện">Đại Lễ Sự Kiện</option>
                            <option value="Cộng Tu">Cộng Tu</option>
                            <option value="Tịnh Độ Nhân Gian">Tịnh Độ Nhân Gian</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            THỜI GIAN
                          </label>
                          <input
                            type="text"
                            value={evt.timeSlot1Time || ''}
                            onChange={(e) => updateCustomEvent(idx, 'timeSlot1Time', e.target.value)}
                            placeholder="Ví dụ: 08h00 - 11h30"
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            ĐỊA ĐIỂM
                          </label>
                          <input
                            type="text"
                            value={evt.location}
                            onChange={(e) => updateCustomEvent(idx, 'location', e.target.value)}
                            placeholder="Ví dụ: Đại Hùng Bảo Điện & Tổ Đường"
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-[#F2C14E] mb-1">
                            NỘI DUNG TÓM TẮT
                          </label>
                          <textarea
                            rows={2}
                            value={evt.description}
                            onChange={(e) => updateCustomEvent(idx, 'description', e.target.value)}
                            className="w-full bg-[#140A04] border border-[#F2C14E]/30 rounded-lg px-3 py-2 text-sm text-[#e3d2c1] focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCustomEvent(idx)}
                        className="p-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 rounded-lg border border-rose-700/30 shrink-0 cursor-pointer self-center md:self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
