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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  FileText,
  Video,
  X,
  Edit3,
} from 'lucide-react';
import { useTableDragDrop, GripHandleIcon } from '@/components/admin/useTableDragDrop';
import { AdminPagination, useAdminPagination } from '@/components/admin/AdminPagination';
import { S3FileExplorerModal } from '@/components/admin/S3FileExplorerModal';
import {
  getDaysInMonth,
  getStartDayOffset,
  getLunarCellString,
  getBuddhistEraYear,
  convertSolarToLunar,
} from '@/lib/lunar-calendar';
import {
  getEventCategoryIcon,
  splitEventTitle,
} from '@/data/schedule-data';

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

export interface CustomScheduleEvent {
  id: string;
  slug?: string;
  solarDateStr: string; // "DD.MM.YYYY"
  title: string;
  subtitle?: string; // Sub tiêu đề bóc tách (đỡ dài dòng trong ô lịch)
  category: 'Cộng Tu' | 'Đại Lễ Sự Kiện' | 'Khóa Lễ Truyền Thống' | string;
  timeSlot1Label?: string;
  timeSlot1Time?: string;
  location: string;
  description: string;
  notes?: string;
  imgUrl?: string;
  videoUrl?: string;
  gallery?: string[];
  contentHtml?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminSchedulePage() {
  const [activeTab, setActiveTab] = useState<'traditional' | 'calendar'>('calendar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [monthThemes, setMonthThemes] = useState<Record<string, MonthTheme>>({});
  const [customEvents, setCustomEvents] = useState<CustomScheduleEvent[]>([]);

  // Calendar view states
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(7); // 0-indexed: 7 = Tháng 8
  const [isThemeCollapsed, setIsThemeCollapsed] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('Tất Cả');

  // Modal S3 Explorer
  const [s3ModalOpen, setS3ModalOpen] = useState(false);
  const [s3TargetCallback, setS3TargetCallback] = useState<((url: string) => void) | null>(null);
  const [s3InitialPath, setS3InitialPath] = useState<string>('01-trang-chu');

  // Event Edit Modal
  const [editingEvent, setEditingEvent] = useState<CustomScheduleEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);

  // Drag Drop for Traditional Rituals (Programs)
  const {
    draggedId,
    dragOverId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useTableDragDrop({
    items: programs,
    setItems: setPrograms,
    onToast: (msg) => setMessage({ text: msg, type: 'success' }),
    getId: (p) => p.id,
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedPrograms,
    startIndex,
    endIndex,
  } = useAdminPagination({
    items: programs,
    defaultPageSize: 10,
  });

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

  // Open S3 Image Picker
  const handleOpenImagePicker = (callback: (url: string) => void, initialPath = '01-trang-chu') => {
    setS3TargetCallback(() => callback);
    setS3InitialPath(initialPath);
    setS3ModalOpen(true);
  };

  // Traditional Rituals Handlers
  const addProgram = () => {
    const newProg: FeaturedProgram = {
      id: 'p-' + Date.now(),
      title: 'KHÓA LỄ TRUYỀN THỐNG MỚI',
      schedule: 'ĐỊNH KỲ HẰNG THÁNG',
      summary: 'Mô tả tóm tắt thời khóa tu học và ý nghĩa sự kiện...',
      imgUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
    };
    setPrograms([newProg, ...programs]);
  };

  const updateProgram = (index: number, field: keyof FeaturedProgram, value: string) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const deleteProgram = (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa lễ truyền thống này?')) {
      const updated = programs.filter((_, i) => i !== index);
      setPrograms(updated);
    }
  };

  // Month Theme Handlers
  const currentMonthData: MonthTheme = monthThemes[String(selectedMonthIdx)] || {
    month: selectedMonthIdx + 1,
    bannerImg: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-08-hieu-hanh-dap-den.webp',
    title: 'HIẾU HẠNH ĐÁP ĐỀN',
    quoteLines: [
      'Không một tác phẩm nào đẹp và thiêng liêng',
      'bằng sự hiện hữu của cha và mẹ.',
      'Đó là tượng đài của tình thương',
      'và sự hy sinh bất tử.',
    ],
    author: 'Vô Trí - Tâm Hòa',
    primaryColor: '#7C2D12',
    secondaryColor: '#F2C14E',
    themeBg: '#240E06',
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

  // Calendar calculations
  const daysInMonth = getDaysInMonth(currentYear, selectedMonthIdx);
  const startDayOffset = getStartDayOffset(currentYear, selectedMonthIdx);
  const buddhistEra = getBuddhistEraYear(currentYear);

  // Month navigation
  const handlePrevMonth = () => {
    if (selectedMonthIdx === 0) {
      setSelectedMonthIdx(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setSelectedMonthIdx((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIdx === 11) {
      setSelectedMonthIdx(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setSelectedMonthIdx((prev) => prev + 1);
    }
  };

  // Event modal actions
  const handleOpenAddEventForDay = (day: number) => {
    const formattedDate = `${String(day).padStart(2, '0')}.${String(selectedMonthIdx + 1).padStart(2, '0')}.${currentYear}`;
    const newEvt: CustomScheduleEvent = {
      id: 'evt-' + Date.now(),
      slug: slugify(`khoa-tu-ngay-${day}-thang-${selectedMonthIdx + 1}-${currentYear}`),
      solarDateStr: formattedDate,
      title: 'PHÁP HỘI CỘNG TU NIỆM PHẬT',
      subtitle: '',
      category: 'Cộng Tu',
      timeSlot1Label: 'Buổi Sáng',
      timeSlot1Time: '08h00 - 11h30',
      location: 'Đại Hùng Bảo Điện & Giảng Đường',
      description: 'Khóa tu hành trì trang nghiêm, thanh tịnh thân tâm và hồi hướng công đức an lạc.',
      notes: 'Phật tử vân tập trước 07h30, y phục áo tràng lam trang nghiêm, ăn chay và giữ tâm thanh tịnh.',
      imgUrl: currentMonthData.bannerImg || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
      videoUrl: '',
    };
    setEditingEvent(newEvt);
    setIsNewEvent(true);
  };

  const handleOpenEditEvent = (evt: CustomScheduleEvent) => {
    setEditingEvent({ ...evt });
    setIsNewEvent(false);
  };

  const handleSaveEditingEvent = () => {
    if (!editingEvent) return;
    if (!editingEvent.title.trim()) {
      alert('Vui lòng nhập tên khóa lễ / sự kiện');
      return;
    }

    const finalSlug = editingEvent.slug?.trim() || slugify(editingEvent.title + '-' + editingEvent.solarDateStr);
    const eventWithSlug = { ...editingEvent, slug: finalSlug };

    if (isNewEvent) {
      setCustomEvents([eventWithSlug, ...customEvents]);
    } else {
      setCustomEvents(customEvents.map((e) => (e.id === eventWithSlug.id ? eventWithSlug : e)));
    }
    setEditingEvent(null);
    setMessage({ text: 'Đã cập nhật thời khóa sự kiện thành công! Hãy bấm "Lưu Thay Đổi (Cloud S3)" để đồng bộ vĩnh viễn.', type: 'success' });
  };

  const handleDeleteEditingEvent = () => {
    if (!editingEvent) return;
    if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      setCustomEvents(customEvents.filter((e) => e.id !== editingEvent.id));
      setEditingEvent(null);
      setMessage({ text: 'Đã xóa sự kiện thành công!', type: 'success' });
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-[1550px] mx-auto space-y-6">
      {/* ── 1. Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2A180D] via-[#1E1109] to-[#2A180D] p-5 md:p-6 rounded-2xl border border-[#F2C14E]/30 shadow-2xl">
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
                Thiết lập khóa lễ truyền thống, cập nhật lịch cộng tu & đại lễ sự kiện theo ngày, tùy biến banner 12 tháng
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
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in duration-300 ${
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

      {/* ── 2. Tinh Gọn 2 Tabs Cấp Cao Nhất ── */}
      <div className="flex border-b border-[#F2C14E]/20 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-3 font-bold text-sm rounded-t-xl flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40 shadow-inner'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#F2C14E]" />
          <span>Lịch Tu Học & Sự Kiện Theo Tháng ({customEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('traditional')}
          className={`px-6 py-3 font-bold text-sm rounded-t-xl flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'traditional'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40 shadow-inner'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
          }`}
        >
          <Layers className="w-4 h-4 text-[#F2C14E]" />
          <span>Khóa Lễ Truyền Thống ({programs.length})</span>
        </button>
      </div>

      {/* ── TAB 1: KHÓA LỄ TRUYỀN THỐNG (Cố định hằng tháng) ── */}
      {activeTab === 'traditional' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2A180D]/50 p-4 rounded-xl border border-[#F2C14E]/20">
            <div>
              <h2 className="text-lg font-bold text-[#F2C14E]">
                Khóa Lễ Truyền Thống Định Kỳ Cố Định
              </h2>
              <p className="text-xs text-[#e3d2c1]/70 mt-0.5">
                Các khóa lễ sám hối, cầu an hàng tháng diễn ra cố định vào các ngày âm lịch (không đổi theo từng năm)
              </p>
            </div>
            <button
              type="button"
              onClick={addProgram}
              className="px-4 py-2 bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 text-[#F2C14E] border border-[#F2C14E]/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Khóa Lễ Mới</span>
            </button>
          </div>

          <div className="space-y-4">
            {paginatedPrograms.map((prog, paginatedIdx) => {
              const actualIdx = startIndex + paginatedIdx;
              const isDragSource = draggedId === prog.id;
              const isDropTarget = dragOverId === prog.id;

              return (
                <div
                  key={prog.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, prog.id)}
                  onDragOver={(e) => handleDragOver(e, prog.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, prog.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDropTarget
                      ? dropPosition === 'above'
                        ? 'border-t-4 border-t-[#F2C14E] bg-[#3A2213]'
                        : 'border-b-4 border-b-[#F2C14E] bg-[#3A2213]'
                      : isDragSource
                      ? 'opacity-40 border-dashed border-[#F2C14E]'
                      : 'bg-gradient-to-r from-[#201007] to-[#170C05] border-[#F2C14E]/25 hover:border-[#F2C14E]/50 shadow-md'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                    {/* Drag Handle */}
                    <div className="cursor-grab active:cursor-grabbing text-[#F2C14E]/50 hover:text-[#F2C14E] p-1 shrink-0">
                      <GripHandleIcon />
                    </div>

                    {/* Image with Direct S3 Picker Click */}
                    <div
                      onClick={() =>
                        handleOpenImagePicker((url) => updateProgram(actualIdx, 'imgUrl', url), '01-trang-chu')
                      }
                      className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-[#F2C14E]/40 shrink-0 cursor-pointer group bg-black"
                    >
                      <Image
                        src={prog.imgUrl || '/images/default.jpg'}
                        alt={prog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#F2C14E] gap-1 p-2 text-center">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Bấm để đổi ảnh S3</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Tên Khóa Lễ Truyền Thống
                        </label>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => updateProgram(actualIdx, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white font-bold text-sm focus:border-[#F2C14E] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Thời Khóa Định Kỳ (Âm Lịch)
                        </label>
                        <input
                          type="text"
                          value={prog.schedule}
                          onChange={(e) => updateProgram(actualIdx, 'schedule', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-amber-200 text-sm focus:border-[#F2C14E] outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Tóm Tắt Ý Nghĩa & Hướng Dẫn
                        </label>
                        <textarea
                          rows={2}
                          value={prog.summary}
                          onChange={(e) => updateProgram(actualIdx, 'summary', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white/90 text-xs focus:border-[#F2C14E] outline-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 shrink-0 self-end lg:self-center">
                      <button
                        type="button"
                        onClick={() => deleteProgram(actualIdx)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg border border-red-500/30 transition cursor-pointer"
                        title="Xóa khóa lễ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            endIndex={Math.min(currentPage * pageSize, totalItems)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* ── TAB 2: LỊCH TU HỌC & SỰ KIỆN THEO THÁNG (TO ĐẦY TRANG) ── */}
      {activeTab === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row items-stretch gap-5">
            {/* ── CỘT TRÁI: CHỦ ĐỀ THÁNG (Có thể thu gọn / mở rộng) ── */}
            <div
              className={`transition-all duration-300 shrink-0 ${
                isThemeCollapsed
                  ? 'w-full lg:w-14'
                  : 'w-full lg:w-[350px] xl:w-[380px]'
              }`}
            >
              {isThemeCollapsed ? (
                /* Collapsed Slim Bar */
                <div className="h-full min-h-[300px] bg-gradient-to-b from-[#2A170F] to-[#150A04] border border-[#F2C14E]/40 rounded-2xl p-2 flex flex-col items-center justify-between shadow-xl">
                  <button
                    type="button"
                    onClick={() => setIsThemeCollapsed(false)}
                    className="p-2.5 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 text-[#F2C14E] border border-[#F2C14E]/50 transition cursor-pointer"
                    title="Mở rộng chỉnh sửa Chủ Đề Tháng"
                  >
                    <PanelLeftOpen className="w-5 h-5" />
                  </button>

                  <div className="py-6 writing-vertical flex items-center justify-center text-center">
                    <span
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                      className="text-lg text-[#F2C14E] uppercase tracking-widest whitespace-nowrap"
                    >
                      CHỦ ĐỀ THÁNG {selectedMonthIdx + 1}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-300/80">T{selectedMonthIdx + 1}</span>
                </div>
              ) : (
                /* Expanded Card Chủ Đề Tháng (17x19cm) */
                <div className="rounded-2xl bg-gradient-to-b from-[#2A170F] via-[#201007] to-[#150A04] border border-[#F2C14E]/40 shadow-2xl p-4 md:p-5 space-y-4 h-full flex flex-col justify-between">
                  {/* Header Cột Trái với nút Thu gọn */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2C14E]/20">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#F2C14E]" />
                      <h3 className="text-xs md:text-sm font-bold text-[#F2C14E] uppercase tracking-wider">
                        Chủ Đề Tháng {selectedMonthIdx + 1}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsThemeCollapsed(true)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#3A2213] text-[#FFE5A3] hover:text-[#F2C14E] border border-[#F2C14E]/40 flex items-center gap-1 transition cursor-pointer"
                      title="Thu gọn để mở rộng tối đa bảng lịch"
                    >
                      <PanelLeftClose className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Thu gọn</span>
                    </button>
                  </div>

                  {/* Poster Image with S3 Picker Click */}
                  <div>
                    <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                      Ảnh Poster Chủ Đề (Bấm ảnh để đổi qua S3):
                    </label>
                    <div
                      onClick={() =>
                        handleOpenImagePicker(
                          (url) => updateCurrentMonthField('bannerImg', url),
                          'calendar_webp'
                        )
                      }
                      className="relative w-full aspect-[1200/1015] rounded-xl overflow-hidden border border-[#F2C14E]/40 cursor-pointer group bg-black"
                    >
                      <Image
                        src={currentMonthData.bannerImg || '/images/default.jpg'}
                        alt={currentMonthData.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#F2C14E] gap-1 p-2 text-center">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-xs font-bold">Bấm để đổi poster S3</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                        Tiêu Đề Chủ Đề Tháng
                      </label>
                      <input
                        type="text"
                        value={currentMonthData.title}
                        onChange={(e) => updateCurrentMonthField('title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-[#FFDE59] font-bold text-sm outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                        Câu Trích Dẫn (Thơ / Văn Xuôi)
                      </label>
                      <textarea
                        rows={4}
                        value={currentMonthData.quoteLines.join('\n')}
                        onChange={(e) => updateCurrentMonthField('quoteLines', e.target.value.split('\n'))}
                        className="w-full px-3 py-1.5 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white/90 text-xs outline-none focus:border-[#F2C14E] leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                        Tác Giả Câu Quote
                      </label>
                      <input
                        type="text"
                        value={currentMonthData.author}
                        onChange={(e) => updateCurrentMonthField('author', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-amber-200 text-xs outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                  </div>

                  {/* 12 Months Fast Selector */}
                  <div className="pt-2 border-t border-[#F2C14E]/20">
                    <span className="text-[10px] text-[#FFE5A3]/70 uppercase font-bold tracking-wider block mb-1.5">
                      Chọn nhanh tháng:
                    </span>
                    <div className="grid grid-cols-6 gap-1 text-center">
                      {Array.from({ length: 12 }).map((_, mIdx) => (
                        <button
                          key={mIdx}
                          type="button"
                          onClick={() => setSelectedMonthIdx(mIdx)}
                          className={`py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            selectedMonthIdx === mIdx
                              ? 'bg-[#F2C14E] text-black shadow-md'
                              : 'bg-black/40 text-[#FFE5A3]/70 hover:text-white hover:bg-black/80'
                          }`}
                        >
                          T{mIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── CỘT PHẢI: BẢNG LỊCH TO TOÀN MÀN HÌNH (42 Ô) ── */}
            <div className="flex-1 rounded-2xl bg-gradient-to-b from-[#2A170F]/95 via-[#1D0F08]/95 to-[#140A04]/98 border border-[#F2C14E]/40 p-4 md:p-6 shadow-2xl flex flex-col justify-between space-y-4">
              {/* Calendar Top Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-black/60 border border-[#F2C14E]/30">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#A3520A] via-[#C87515] to-[#A3520A] border border-[#F2C14E]">
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-sm font-black uppercase tracking-wider text-white"
                    >
                      THÁNG {String(selectedMonthIdx + 1).padStart(2, '0')} / {currentYear}
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-black/60 border border-[#F2C14E]/40 hidden sm:flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#FFDE59]">PL. {buddhistEra}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter and Collapsed Trigger button */}
                <div className="flex items-center gap-2">
                  {isThemeCollapsed && (
                    <button
                      type="button"
                      onClick={() => setIsThemeCollapsed(false)}
                      className="px-3 py-1 rounded-lg bg-[#3A2213] text-[#F2C14E] border border-[#F2C14E]/50 text-xs font-bold flex items-center gap-1.5 hover:bg-[#F2C14E] hover:text-black transition cursor-pointer"
                    >
                      <PanelLeftOpen className="w-3.5 h-3.5" />
                      <span>Mở Chủ Đề Tháng</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 bg-[#120803] p-1 rounded-lg border border-[#F2C14E]/20 text-xs">
                    {['Tất Cả', 'Cộng Tu', 'Đại Lễ Sự Kiện'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                          filterCategory === cat
                            ? 'bg-[#F2C14E] text-black font-bold'
                            : 'text-[#FFE5A3]/70 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs uppercase py-2 rounded-xl bg-black/60 border border-[#F2C14E]/25">
                <span className="text-[#FFE5A3]">T2</span>
                <span className="text-[#FFE5A3]">T3</span>
                <span className="text-[#FFE5A3]">T4</span>
                <span className="text-[#FFE5A3]">T5</span>
                <span className="text-[#FFE5A3]">T6</span>
                <span className="text-[#FFE5A3]">T7</span>
                <span className="text-black font-black bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] rounded-md mx-1 py-0.5">
                  CN
                </span>
              </div>

              {/* Grid 42 Cells */}
              <div className="grid grid-cols-7 gap-2 text-center flex-1">
                {(() => {
                  const cells: (number | null)[] = Array(42).fill(null);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const idx = startDayOffset + (d - 1);
                    if (idx < 42) cells[idx] = d;
                  }

                  return cells.map((dayNum, cellIdx) => {
                    if (!dayNum) {
                      return (
                        <div
                          key={`empty-${cellIdx}`}
                          className="min-h-[100px] sm:min-h-[115px] md:min-h-[125px] rounded-xl border border-transparent opacity-0 pointer-events-none"
                        />
                      );
                    }

                    const dateStr = `${String(dayNum).padStart(2, '0')}.${String(selectedMonthIdx + 1).padStart(2, '0')}.${currentYear}`;
                    const lunarCellStr = getLunarCellString(dayNum, selectedMonthIdx, currentYear);
                    const lunarObj = convertSolarToLunar(dayNum, selectedMonthIdx, currentYear);
                    const isFirstOrFullMoon = lunarObj.day === 1 || lunarObj.day === 15;
                    const isSunday = cellIdx % 7 === 6;

                    // Filter events for this day
                    const dayEvents = customEvents.filter((e) => {
                      if (e.solarDateStr !== dateStr) return false;
                      if (filterCategory === 'Tất Cả') return true;
                      return e.category === filterCategory;
                    });

                    return (
                      <div
                        key={`cell-${dayNum}`}
                        className="group min-h-[100px] sm:min-h-[115px] md:min-h-[125px] p-2 rounded-xl border border-[#F2C14E]/25 bg-black/45 hover:bg-black/65 hover:border-[#F2C14E]/70 transition-all flex flex-col justify-between relative shadow-sm"
                      >
                        {/* Top row: Solar day + Plus button + Lunar day */}
                        <div className="flex items-center justify-between">
                          <span
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className={`text-base sm:text-lg font-black leading-none ${
                              isSunday ? 'text-[#FFDE59]' : 'text-white'
                            }`}
                          >
                            {dayNum}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenAddEventForDay(dayNum)}
                            className="w-5 h-5 rounded-full bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#F2C14E] hover:text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                            title={`Thêm thời khóa ngày ${dateStr}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          <span
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className={`text-[10px] sm:text-[11px] font-bold rounded px-1 ${
                              isFirstOrFullMoon
                                ? 'bg-red-600 text-white font-black'
                                : 'text-amber-200/80'
                            }`}
                          >
                            {lunarCellStr}
                          </span>
                        </div>

                        {/* Event Badges List in Cell: Logo Biểu Tượng + Tooltip */}
                        <div className="my-1 flex items-center justify-center gap-1.5 flex-wrap flex-1 content-center">
                          {dayEvents.map((evt) => {
                            const iconUrl = getEventCategoryIcon(evt.category);
                            const isDaiLe = evt.category === 'Đại Lễ Sự Kiện';
                            return (
                              <div
                                key={evt.id}
                                onClick={() => handleOpenEditEvent(evt)}
                                className="relative group/admin-icon cursor-pointer transition-transform hover:scale-125 z-10 hover:z-50"
                              >
                                <div
                                  className={`w-7 h-7 rounded-full p-0.5 shadow-md flex items-center justify-center transition-all ${
                                    isDaiLe
                                      ? 'bg-red-950/90 border border-red-500 hover:border-[#FFDE59] shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                      : 'bg-black/70 border border-[#F2C14E]/70 hover:border-[#FFDE59]'
                                  }`}
                                >
                                  <img
                                    src={iconUrl}
                                    alt={evt.title}
                                    className="w-full h-full object-contain filter drop-shadow"
                                  />
                                </div>

                                {/* Rich Tooltip khi rê chuột vào logo */}
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-[#1C0F08]/98 border border-[#FFDE59] shadow-[0_10px_30px_rgba(0,0,0,0.95)] backdrop-blur-md opacity-0 group-hover/admin-icon:opacity-100 transition-all duration-200 z-50 text-left space-y-1 transform scale-95 group-hover/admin-icon:scale-100">
                                  <div className="flex items-center gap-1.5 pb-1 border-b border-[#F2C14E]/25">
                                    <img src={iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                                    <span className="text-[10px] font-bold uppercase text-[#FFDE59]">
                                      {evt.category}
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-white leading-tight line-clamp-2">
                                    {evt.title}
                                  </div>
                                  {evt.subtitle && (
                                    <div className="text-[11px] text-amber-200/90 italic leading-tight line-clamp-2">
                                      {evt.subtitle}
                                    </div>
                                  )}
                                  <div className="text-[10px] text-amber-300/80 pt-1 border-t border-[#F2C14E]/20 flex items-center justify-between">
                                    <span>{evt.timeSlot1Time || 'Thời khóa'}</span>
                                    <span className="text-[#FFDE59] font-semibold text-[9px]">Bấm để sửa ✎</span>
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#FFDE59]" />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Subtle bottom hint */}
                        <div className="text-[9px] text-[#FFE5A3]/50 text-center truncate">
                          {dayEvents.length > 0 ? `${dayEvents.length} sự kiện` : ''}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Thanh chú thích ý nghĩa logo ở góc dưới bên phải lịch admin */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 text-[11px] border-t border-[#F2C14E]/20">
                <span className="text-[#F2C14E] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                  ❖ Chú thích biểu tượng:
                </span>
                <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                  <img src="/images/icons/icon-cong-tu.png" alt="Cộng Tu" className="w-4 h-4 object-contain" />
                  <span className="font-semibold text-[#FFE5A3]">Cộng Tu</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                  <img src="/images/icons/icon-khoa-le-truyen-thong.png" alt="Khóa Lễ Truyền Thống" className="w-4 h-4 object-contain" />
                  <span className="font-semibold text-[#FFE5A3]">Khóa Lễ Truyền Thống</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                  <img src="/images/icons/icon-dai-le-su-kien.png" alt="Đại Lễ Sự Kiện" className="w-4 h-4 object-contain" />
                  <span className="font-semibold text-[#FFE5A3]">Đại Lễ Sự Kiện</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CẬP NHẬT THỜI KHÓA SỰ KIỆN CHI TIẾT ── */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C0F08] border border-[#F2C14E]/60 shadow-[0_20px_70px_rgba(0,0,0,0.95)] p-5 sm:p-7 space-y-5 text-white">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30">
              <div>
                <span className="text-xs text-[#F2C14E] font-bold uppercase tracking-widest block">
                  Cập Nhật Thời Khóa Ngày {editingEvent.solarDateStr}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {isNewEvent ? 'Thêm Khóa Lễ / Sự Kiện Mới' : 'Chỉnh Sửa Thời Khóa Khóa Lễ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/40 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Phân Loại (3 loại có icon chính thức) */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1.5">
                  Phân Loại Chương Trình (Biểu Tượng Hiển Thị Trên Lịch):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Loại 1: Cộng Tu */}
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      editingEvent.category === 'Cộng Tu'
                        ? 'bg-[#3D2210] border-[#F2C14E] text-[#FFDE59] shadow-md ring-1 ring-[#F2C14E]/60'
                        : 'bg-black/40 border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventCategory"
                      checked={editingEvent.category === 'Cộng Tu'}
                      onChange={() => setEditingEvent({ ...editingEvent, category: 'Cộng Tu' })}
                      className="accent-[#F2C14E]"
                    />
                    <img src="/images/icons/icon-cong-tu.png" alt="Cộng Tu" className="w-5 h-5 object-contain" />
                    <span className="font-bold text-xs">Cộng Tu</span>
                  </label>

                  {/* Loại 2: Khóa Lễ Truyền Thống */}
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      editingEvent.category === 'Khóa Lễ Truyền Thống'
                        ? 'bg-[#3D2210] border-[#F2C14E] text-[#FFDE59] shadow-md ring-1 ring-[#F2C14E]/60'
                        : 'bg-black/40 border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventCategory"
                      checked={editingEvent.category === 'Khóa Lễ Truyền Thống'}
                      onChange={() => setEditingEvent({ ...editingEvent, category: 'Khóa Lễ Truyền Thống' })}
                      className="accent-[#F2C14E]"
                    />
                    <img src="/images/icons/icon-khoa-le-truyen-thong.png" alt="Khóa Lễ" className="w-5 h-5 object-contain" />
                    <span className="font-bold text-xs">Khóa Lễ Truyền Thống</span>
                  </label>

                  {/* Loại 3: Đại Lễ Sự Kiện */}
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      editingEvent.category === 'Đại Lễ Sự Kiện'
                        ? 'bg-red-950/80 border-red-500 text-[#FFDE59] shadow-md ring-1 ring-red-500/60'
                        : 'bg-black/40 border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventCategory"
                      checked={editingEvent.category === 'Đại Lễ Sự Kiện'}
                      onChange={() => setEditingEvent({ ...editingEvent, category: 'Đại Lễ Sự Kiện' })}
                      className="accent-[#F2C14E]"
                    />
                    <img src="/images/icons/icon-dai-le-su-kien.png" alt="Đại Lễ" className="w-5 h-5 object-contain" />
                    <span className="font-bold text-xs">Đại Lễ Sự Kiện</span>
                  </label>
                </div>
              </div>

              {/* Tên Sự Kiện + Nút Tự Động Bóc Tách */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-[#F2C14E] font-bold">
                    Tên Khóa Lễ / Sự Kiện Chính:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const { title, subtitle } = splitEventTitle(editingEvent.title);
                      setEditingEvent({
                        ...editingEvent,
                        title,
                        subtitle: subtitle || editingEvent.subtitle || '',
                      });
                    }}
                    className="text-[11px] text-[#FFE5A3] bg-[#3A2213] hover:bg-[#F2C14E] hover:text-black px-2 py-0.5 rounded border border-[#F2C14E]/40 font-semibold transition cursor-pointer flex items-center gap-1"
                    title="Tự động bóc tách tiêu đề chính và tiêu đề phụ dựa trên dấu -, —, :"
                  >
                    <span>🪄 Tự Động Bóc Tách</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                      slug: isNewEvent ? slugify(e.target.value + '-' + editingEvent.solarDateStr) : editingEvent.slug,
                    })
                  }
                  placeholder="Ví dụ: PHÁP HỘI HUYẾT BỒN TRAI"
                  className="w-full px-3.5 py-2.5 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white font-bold focus:border-[#F2C14E] outline-none"
                />
              </div>

              {/* Sub Tiêu Đề Bóc Tách */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Sub Tiêu Đề (Thông tin chi tiết phụ, ngày âm, mục đích khóa lễ):
                </label>
                <input
                  type="text"
                  value={editingEvent.subtitle || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, subtitle: e.target.value })}
                  placeholder="Ví dụ: Cầu Siêu Thai Nhi Sản Nạn, Mẫu Nạn (Khai Đàn)"
                  className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-amber-200 text-xs focus:border-[#F2C14E] outline-none"
                />
              </div>

              {/* Ảnh Poster với S3 Picker Click */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Ảnh Poster / Banner (Bấm ảnh để chọn từ S3):
                </label>
                <div
                  onClick={() =>
                    handleOpenImagePicker(
                      (url) => setEditingEvent({ ...editingEvent, imgUrl: url }),
                      '01-trang-chu'
                    )
                  }
                  className="relative w-full h-36 rounded-xl overflow-hidden border border-[#F2C14E]/40 cursor-pointer group bg-black"
                >
                  <Image
                    src={editingEvent.imgUrl || '/images/default.jpg'}
                    alt={editingEvent.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#F2C14E] gap-1 p-2">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs font-bold">Bấm để đổi ảnh S3</span>
                  </div>
                </div>
              </div>

              {/* Khung Giờ & Địa Điểm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Khung Giờ / Thời Khóa:
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timeSlot1Time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeSlot1Time: e.target.value })}
                    placeholder="Ví dụ: 08h00 - 17h00"
                    className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-white focus:border-[#F2C14E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Địa Điểm Tổ Chức:
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Ví dụ: Đại Hùng Bảo Điện & Giảng Đường"
                    className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-white focus:border-[#F2C14E] outline-none"
                  />
                </div>
              </div>

              {/* Nội dung ý nghĩa */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Nội Dung & Ý Nghĩa Khóa Lễ:
                </label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Mô tả tóm tắt thời khóa tu học và mục đích hướng đạo..."
                  className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-white/90 text-xs focus:border-[#F2C14E] outline-none leading-relaxed"
                />
              </div>

              {/* Lưu ý cho Phật tử */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Lưu Ý Dành Cho Phật Tử Tham Dự:
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.notes || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
                  placeholder="Y phục trang nghiêm áo tràng lam, mang theo CCCD, đăng ký trước nếu ở lại qua đêm..."
                  className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-amber-200/90 text-xs focus:border-[#F2C14E] outline-none leading-relaxed"
                />
              </div>

              {/* Video URL & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Link Video / Pháp Thoại (YouTube nếu có):
                  </label>
                  <input
                    type="text"
                    value={editingEvent.videoUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-white text-xs focus:border-[#F2C14E] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Đường Dẫn Chi Tiết (Slug):
                  </label>
                  <input
                    type="text"
                    value={editingEvent.slug || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, slug: e.target.value })}
                    placeholder="phap-hoi-niem-phat-thang-8-2026"
                    className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-white text-xs focus:border-[#F2C14E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F2C14E]/20">
              {!isNewEvent ? (
                <button
                  type="button"
                  onClick={handleDeleteEditingEvent}
                  className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa Sự Kiện</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-black/60 hover:bg-black/90 text-white/80 rounded-xl text-xs font-medium border border-white/20 transition cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={handleSaveEditingEvent}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] text-black rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Thời Khóa Này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── S3 FILE EXPLORER MODAL ── */}
      <S3FileExplorerModal
        isOpen={s3ModalOpen}
        onClose={() => setS3ModalOpen(false)}
        onSelectImage={(url) => {
          if (s3TargetCallback) {
            s3TargetCallback(url);
          }
          setS3ModalOpen(false);
        }}
        initialPath={s3InitialPath}
      />
    </div>
  );
}
