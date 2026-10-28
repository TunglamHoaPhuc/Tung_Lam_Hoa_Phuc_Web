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
  Bold,
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
  parseSolarDateStr,
  formatSolarDateStr,
  calcDaysDifference,
} from '@/data/schedule-data';

interface FeaturedProgram {
  id: string;
  title: string;
  subtitle?: string;
  time?: string;
  duration?: string;
  location?: string;
  schedule: string;
  summary: string;
  imgUrl: string;
  imgPositionY?: number;
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
  quoteImg?: string;
  quoteTitle?: string;
}

export interface CustomScheduleEvent {
  id: string;
  slug?: string;
  solarDateStr: string; // "DD.MM.YYYY" (Ngày bắt đầu)
  endDateStr?: string;   // "DD.MM.YYYY" (Ngày kết thúc nếu kéo dài nhiều ngày)
  isMultiDay?: boolean;  // Cờ đánh dấu khóa tu nhiều ngày
  title: string;
  subtitle?: string; // Sub tiêu đề bóc tách (đỡ dài dòng trong ô lịch)
  category: 'Cộng Tu' | 'Đại Lễ Sự Kiện' | 'Khóa Lễ Truyền Thống' | string;
  timeSlot1Label?: string;
  timeSlot1Time?: string;
  timeSlot2Label?: string;
  timeSlot2Time?: string;
  location: string;
  description: string;
  notes?: string;
  imgUrl?: string;
  imgPositionY?: number; // Tọa độ căn dọc 0% (Top) - 100% (Bottom)
  videoUrl?: string;
  gallery?: string[];
  contentHtml?: string;
  endDayType?: string;
  endDayLabel?: string;
  endDayTime?: string;
  continueChanting?: boolean;
  continueChantingUntil?: string;
  continueChantingName?: string;
}

/**
 * Trình soạn thảo Câu Trích Dẫn trực quan WYSIWYG:
 * - Hỗ trợ bôi đen chữ và nhấn Ctrl+B hoặc click nút [ B ] để in đậm
 * - KHÔNG hiển thị ký tự thô như ** hay <b> ra màn hình soạn thảo
 * - Tự động đồng bộ chuẩn hóa mảng quoteLines
 */
/**
 * Trình soạn thảo Câu Trích Dẫn trực quan WYSIWYG:
 * - Hỗ trợ bôi đen chữ và nhấn Ctrl+B hoặc click nút [ B ] để in đậm
 * - Chuẩn hóa từng dòng độc lập (<div>), Enter xuống đúng 1 dòng không bao giờ nhảy 2 dòng
 * - Chống nhảy con trỏ khi tương tác, giữ nguyên khoảng trắng đầu/cuối dòng khi soạn thảo
 */
function VisualQuoteEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (lines: string[]) => void;
}) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const isInternalChangeRef = React.useRef(false);

  // Hàm trích xuất chính xác các dòng văn bản từ cấu trúc DOM của contentEditable
  const extractLines = React.useCallback((): string[] => {
    if (!editorRef.current) return [];
    const el = editorRef.current;
    if (!el.hasChildNodes()) {
      const text = el.textContent || '';
      return text ? [text] : [];
    }

    const lines: string[] = [];
    let currentLine = '';

    function traverse(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        currentLine += node.textContent || '';
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        const tag = elem.tagName.toUpperCase();

        if (tag === 'BR') {
          lines.push(currentLine);
          currentLine = '';
          return;
        }

        if (tag === 'B' || tag === 'STRONG') {
          // Bọc nội dung in đậm để CalendarSection nhận diện font UTM Niagara
          const boldText = Array.from(elem.childNodes)
            .map((c) => c.textContent || '')
            .join('');
          currentLine += `<b>${boldText}</b>`;
          return;
        }

        if (tag === 'DIV' || tag === 'P') {
          if (currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = '';
          }

          // Dòng rỗng dạng <div><br></div> hoặc <div></div>
          const isBrOnly =
            elem.childNodes.length === 1 &&
            (elem.childNodes[0] as HTMLElement).tagName?.toUpperCase() === 'BR';
          if (elem.childNodes.length === 0 || isBrOnly) {
            lines.push('');
            return;
          }

          // Bỏ qua thẻ <br> giả lập ở cuối khối do trình duyệt tự động chèn
          const hasTrailingDummyBr =
            elem.childNodes.length > 1 &&
            (elem.childNodes[elem.childNodes.length - 1] as HTMLElement).tagName?.toUpperCase() === 'BR';
          const children = hasTrailingDummyBr
            ? Array.from(elem.childNodes).slice(0, -1)
            : Array.from(elem.childNodes);

          for (const child of children) {
            traverse(child);
          }
          lines.push(currentLine);
          currentLine = '';
          return;
        }

        for (const child of Array.from(elem.childNodes)) {
          traverse(child);
        }
      }
    }

    for (const child of Array.from(el.childNodes)) {
      traverse(child);
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }, []);

  // Chỉ đồng bộ DOM từ value bên ngoài (khi đổi tháng hoặc tải dữ liệu), không ghi đè khi đang gõ phím
  React.useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    if (!editorRef.current) return;

    // Chuẩn hóa HTML: mỗi dòng là một <div>...</div> độc lập
    const lines = value && value.length > 0 ? value : [''];
    const targetHtml = lines
      .map((line) => `<div>${line ? line : '<br>'}</div>`)
      .join('');

    if (editorRef.current.innerHTML !== targetHtml) {
      editorRef.current.innerHTML = targetHtml;
    }
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) return;
    isInternalChangeRef.current = true;
    const lines = extractLines();
    onChange(lines);
  };

  const handleBoldClick = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('bold', false);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      document.execCommand('bold', false);
      handleInput();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;
    document.execCommand('insertText', false, text);
    handleInput();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block">
          Câu Trích Dẫn (Thơ / Văn Xuôi)
        </label>
        <button
          type="button"
          onClick={handleBoldClick}
          className="px-2.5 py-1 rounded bg-[#2A180E] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#1A120B] border border-[#F2C14E]/50 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 group"
          title="Bôi đen chữ rồi bấm hoặc nhấn Ctrl+B để in đậm chữ Niagara phát sáng"
        >
          <Bold className="w-3.5 h-3.5 text-[#F2C14E] group-hover:text-[#1A120B]" />
          <span className="text-[10px] font-mono tracking-wider">Ctrl + B</span>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full min-h-[95px] px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white/90 text-xs outline-none focus:border-[#F2C14E] leading-relaxed whitespace-pre-wrap select-text [&_b]:text-[#FFDE59] [&_b]:font-bold [&_b]:underline [&_b]:decoration-[#FFDE59]/50 [&_strong]:text-[#FFDE59] [&_strong]:font-bold"
      />
      <span className="text-[10px] text-[#FFE5A3]/60 italic block">
        💡 Mẹo: Bôi đen chữ rồi nhấn <kbd className="px-1 py-0.5 rounded bg-black/60 border border-[#F2C14E]/30 font-bold text-[#FFDE59]">Ctrl + B</kbd> hoặc nút <kbd className="px-1 py-0.5 rounded bg-black/60 border border-[#F2C14E]/30 font-bold text-[#FFDE59]">B</kbd> để in đậm. Phần in đậm sẽ tự động hiển thị font UTM Niagara vàng to phát sáng trên trang chủ.
      </span>
    </div>
  );
}

export function isEventOnDate(evt: CustomScheduleEvent, targetDateStr: string): boolean {
  if (evt.solarDateStr === targetDateStr) return true;
  const effectiveEndStr = (evt.continueChanting && evt.continueChantingUntil)
    ? evt.continueChantingUntil
    : evt.endDateStr;
  if (!effectiveEndStr || effectiveEndStr === evt.solarDateStr) return false;

  const target = parseSolarDateStr(targetDateStr);
  const start = parseSolarDateStr(evt.solarDateStr);
  const end = parseSolarDateStr(effectiveEndStr);
  if (!target || !start || !end) return false;

  return target.getTime() >= start.getTime() && target.getTime() <= end.getTime();
}

export function getEventDayStatus(evt: CustomScheduleEvent, targetDateStr: string): { isFirst: boolean; isLast: boolean; dayIndex: number; totalDays: number; isChantingExt?: boolean; isChantingFinal?: boolean } {
  const target = parseSolarDateStr(targetDateStr);
  const start = parseSolarDateStr(evt.solarDateStr);
  const coreEnd = evt.endDateStr ? parseSolarDateStr(evt.endDateStr) : start;
  const finalEnd = (evt.continueChanting && evt.continueChantingUntil)
    ? parseSolarDateStr(evt.continueChantingUntil) || coreEnd
    : coreEnd;

  if (!target || !start || !coreEnd || !finalEnd) {
    return { isFirst: true, isLast: true, dayIndex: 1, totalDays: 1 };
  }
  const totalDays = Math.max(1, Math.round((coreEnd.getTime() - start.getTime()) / 86400000) + 1);
  const dayIndex = Math.max(1, Math.round((target.getTime() - start.getTime()) / 86400000) + 1);

  const isChantingExt = target.getTime() > coreEnd.getTime() && target.getTime() < finalEnd.getTime();
  const isChantingFinal = target.getTime() === finalEnd.getTime() && target.getTime() > coreEnd.getTime();

  return {
    isFirst: dayIndex === 1,
    isLast: target.getTime() === coreEnd.getTime(),
    dayIndex,
    totalDays,
    isChantingExt,
    isChantingFinal,
  };
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
  const [activeTab, setActiveTab] = useState<'traditional' | 'calendar' | 'quotes'>('calendar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [monthThemes, setMonthThemes] = useState<Record<string, MonthTheme>>({});
  const [customEvents, setCustomEvents] = useState<CustomScheduleEvent[]>([]);
  const [quoteGallery, setQuoteGallery] = useState<Array<{ id: string; url: string; title?: string }>>([]);

  // Calendar view states
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(() => new Date().getMonth());
  const [isThemeCollapsed, setIsThemeCollapsed] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('Tất Cả');

  // Modal S3 Explorer
  const [s3ModalOpen, setS3ModalOpen] = useState(false);
  const [s3TargetCallback, setS3TargetCallback] = useState<((url: string) => void) | null>(null);
  const [s3InitialPath, setS3InitialPath] = useState<string>('01-trang-chu');

  // Event Edit Modal
  const [editingEvent, setEditingEvent] = useState<CustomScheduleEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);

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
        setQuoteGallery(data.data.quoteGallery || []);
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
          quoteGallery,
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
      subtitle: '',
      time: '19h15',
      duration: '120 phút',
      location: 'Chánh Điện Tam Bảo',
      schedule: '19h15',
      summary: 'Mô tả tóm tắt thời khóa tu học và ý nghĩa sự kiện...',
      imgUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
    };
    setPrograms((prev) => [newProg, ...prev]);
  };

  const updateProgram = (id: string, field: keyof FeaturedProgram, value: string) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const deleteProgram = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa lễ truyền thống này?')) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
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
    quoteImg: '/images/lich-tu-hoc/quotes/thang-08-ve-ben-thay.jpg',
    quoteTitle: 'Về bên Thầy tìm thấy bình an',
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

  // Quote Gallery Handlers (Kho ảnh Quote / Pháp ngữ dùng chung)
  const addQuote = () => {
    const newQuote = {
      id: 'quote-' + Date.now(),
      url: '/images/lich-tu-hoc/quotes/thang-01-quy-y-tam-bao.png',
      title: 'Câu Pháp Ngữ Mới',
    };
    setQuoteGallery((prev) => [newQuote, ...prev]);
    handleOpenImagePicker((url) => {
      setQuoteGallery((prev) =>
        prev.map((q) => (q.id === newQuote.id ? { ...q, url } : q))
      );
    }, 'lich-tu-hoc/quotes');
  };

  const updateQuote = (id: string, field: 'url' | 'title', value: string) => {
    setQuoteGallery((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuote = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa ảnh quote này khỏi kho dùng chung?')) {
      setQuoteGallery((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const moveQuote = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= quoteGallery.length) return;
    const next = [...quoteGallery];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setQuoteGallery(next);
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
      endDateStr: undefined,
      isMultiDay: false,
      title: 'PHÁP HỘI CỘNG TU NIỆM PHẬT',
      subtitle: '',
      category: 'Cộng Tu',
      timeSlot1Label: '',
      timeSlot1Time: '08h00',
      timeSlot2Time: '',
      location: 'Tùng lâm Hòa Phúc',
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
    const isMulti = !!(
      editingEvent.endDateStr &&
      editingEvent.endDateStr.trim() !== '' &&
      editingEvent.endDateStr.trim() !== editingEvent.solarDateStr.trim()
    );

    const eventWithSlug: CustomScheduleEvent = {
      ...editingEvent,
      slug: finalSlug,
      isMultiDay: isMulti,
      endDateStr: isMulti ? editingEvent.endDateStr?.trim() : undefined,
    };

    if (isNewEvent) {
      setCustomEvents([eventWithSlug, ...customEvents]);
    } else {
      setCustomEvents(customEvents.map((e) => (e.id === eventWithSlug.id ? eventWithSlug : e)));
    }
    setEditingEvent(null);
    setMessage({
      text: isMulti
        ? `Đã lưu khóa tu chuỗi ${calcDaysDifference(eventWithSlug.solarDateStr, eventWithSlug.endDateStr || '')} ngày thành công! Hệ thống đã tự động phủ kín lịch cho các ngày này. Hãy bấm "Lưu Thay Đổi (Cloud S3)" để đồng bộ vĩnh viễn.`
        : 'Đã cập nhật thời khóa sự kiện thành công! Hãy bấm "Lưu Thay Đổi (Cloud S3)" để đồng bộ vĩnh viễn.',
      type: 'success',
    });
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
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in duration-300 ${message.type === 'success'
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

      {/* ── 2. Tinh Gọn 3 Tabs Cấp Cao Nhất ── */}
      <div className="flex border-b border-[#F2C14E]/20 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-3 font-bold text-sm rounded-t-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${activeTab === 'calendar'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40 shadow-inner'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
            }`}
        >
          <Calendar className="w-4 h-4 text-[#F2C14E]" />
          <span>Lịch Tu Học & Sự Kiện ({customEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-3 font-bold text-sm rounded-t-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${activeTab === 'quotes'
              ? 'bg-[#2A180D] text-[#F2C14E] border-t border-x border-[#F2C14E]/40 shadow-inner'
              : 'text-[#e3d2c1]/70 hover:text-[#e3d2c1] hover:bg-[#2A180D]/40'
            }`}
        >
          <Sparkles className="w-4 h-4 text-[#FFDE59]" />
          <span>Kho Ảnh Quote / Pháp Ngữ ({quoteGallery.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('traditional')}
          className={`px-6 py-3 font-bold text-sm rounded-t-xl flex items-center gap-2 transition cursor-pointer shrink-0 ${activeTab === 'traditional'
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
                  draggable={dragActiveId === prog.id}
                  onDragStart={(e) => handleDragStart(e, prog.id)}
                  onDragOver={(e) => handleDragOver(e, prog.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    handleDrop(e, prog.id);
                    setDragActiveId(null);
                  }}
                  onDragEnd={() => {
                    handleDragEnd();
                    setDragActiveId(null);
                  }}
                  className={`p-5 rounded-2xl border transition-all ${isDropTarget
                      ? dropPosition === 'above'
                        ? 'border-t-4 border-t-[#F2C14E] bg-[#3A2213]'
                        : 'border-b-4 border-b-[#F2C14E] bg-[#3A2213]'
                      : isDragSource
                        ? 'opacity-40 border-dashed border-[#F2C14E]'
                        : 'bg-gradient-to-r from-[#201007] to-[#170C05] border-[#F2C14E]/25 hover:border-[#F2C14E]/50 shadow-md'
                    }`}
                >
                  <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                    {/* Drag Handle - Chỉ khi giữ chuột tại đây mới kích hoạt kéo thả */}
                    <div
                      onMouseDown={() => setDragActiveId(prog.id)}
                      onMouseUp={() => setDragActiveId(null)}
                      className="cursor-grab active:cursor-grabbing text-[#F2C14E]/50 hover:text-[#F2C14E] p-1.5 shrink-0 select-none rounded hover:bg-[#F2C14E]/10 transition"
                      title="Kéo thả để đổi thứ tự khóa lễ"
                    >
                      <GripHandleIcon />
                    </div>

                    {/* Image with Direct S3 Picker Click & Position Control */}
                    <div className="flex flex-col gap-1.5 w-full sm:w-48 shrink-0">
                      <div
                        onClick={() =>
                          handleOpenImagePicker((url) => updateProgram(prog.id, 'imgUrl', url), '01-trang-chu')
                        }
                        className="relative w-full h-28 rounded-xl overflow-hidden border border-[#F2C14E]/40 cursor-pointer group bg-black"
                      >
                        <Image
                          src={prog.imgUrl || '/images/default.jpg'}
                          alt={prog.title}
                          fill
                          style={{
                            objectPosition: `center ${prog.imgPositionY ?? 50}%`,
                          }}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#F2C14E] gap-1 p-2 text-center">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-[11px] font-bold">Bấm để đổi ảnh S3</span>
                        </div>
                      </div>

                      {/* Slider căn dọc cho khóa lễ truyền thống */}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-black/45 rounded-lg border border-[#F2C14E]/25 text-[10px] text-[#FFE5A3]">
                        <span title="Căn Lên / Xuống">↕</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={prog.imgPositionY ?? 50}
                          onChange={(e) => updateProgram(prog.id, 'imgPositionY' as any, parseInt(e.target.value, 10) as any)}
                          className="w-full accent-[#F2C14E] h-1.5 bg-[#2A180D] rounded cursor-pointer"
                          title="Căn chỉnh vị trí ảnh Lên / Xuống"
                        />
                        <span className="w-6 text-right font-medium">{prog.imgPositionY ?? 50}%</span>
                      </div>
                    </div>

                    {/* Form Fields - 5 ô tiện ích: Tên, Tiêu đề phụ, Thời gian (Giờ bắt đầu), Thời lượng, Địa điểm */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Tên Khóa Lễ Truyền Thống
                        </label>
                        <input
                          type="text"
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.title || ''}
                          onChange={(e) => updateProgram(prog.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white font-bold text-sm focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none select-text cursor-text"
                          placeholder="Nhập tên khóa lễ..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Tiêu Đề Phụ (Sub-title)
                        </label>
                        <input
                          type="text"
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.subtitle || ''}
                          onChange={(e) => updateProgram(prog.id, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-[#FFDE59] text-sm focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none select-text cursor-text"
                          placeholder="Ví dụ: Sám Hối Định Kỳ, Đại Lễ..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Thời Gian (Giờ Bắt Đầu)
                        </label>
                        <input
                          type="text"
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.time || prog.schedule || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrograms((prev) =>
                              prev.map((p) =>
                                p.id === prog.id ? { ...p, time: val, schedule: val } : p
                              )
                            );
                          }}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-amber-200 text-sm focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none select-text cursor-text"
                          placeholder="Ví dụ: 08h00, 19h15..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Thời Lượng (Nếu Có)
                        </label>
                        <input
                          type="text"
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.duration || ''}
                          onChange={(e) => updateProgram(prog.id, 'duration', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-amber-200 text-sm focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none select-text cursor-text"
                          placeholder="Ví dụ: 120 phút, 2 ngày..."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Địa Điểm Tổ Chức
                        </label>
                        <input
                          type="text"
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.location || ''}
                          onChange={(e) => updateProgram(prog.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-[#FFE5A3] text-sm focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none select-text cursor-text"
                          placeholder="Ví dụ: Chánh Điện Tam Bảo..."
                        />
                      </div>

                      <div className="sm:col-span-2 md:col-span-3 xl:col-span-5">
                        <label className="text-xs text-[#F2C14E] font-semibold block mb-1">
                          Tóm Tắt Ý Nghĩa & Hướng Dẫn
                        </label>
                        <textarea
                          rows={2}
                          draggable={false}
                          onFocus={() => setDragActiveId(null)}
                          onMouseDown={(e) => e.stopPropagation()}
                          value={prog.summary || ''}
                          onChange={(e) => updateProgram(prog.id, 'summary', e.target.value)}
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white/90 text-xs focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 outline-none leading-relaxed select-text cursor-text"
                          placeholder="Nhập mô tả tóm tắt ý nghĩa thời khóa..."
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 shrink-0 self-end lg:self-center">
                      <button
                        type="button"
                        onClick={() => deleteProgram(prog.id)}
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
              className={`transition-all duration-300 shrink-0 ${isThemeCollapsed
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

                  {/* Quote & Author */}
                  <div className="space-y-3">
                    <VisualQuoteEditor
                      key={selectedMonthIdx}
                      value={currentMonthData.quoteLines}
                      onChange={(lines) => updateCurrentMonthField('quoteLines', lines)}
                    />

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
                          className={`py-1 rounded-md text-xs font-bold transition cursor-pointer ${selectedMonthIdx === mIdx
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
                        className={`px-2.5 py-0.5 rounded font-semibold transition cursor-pointer ${filterCategory === cat
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

                    // Filter events for this day (Bao gồm cả sự kiện đơn ngày và chuỗi khóa tu nhiều ngày)
                    const dayEvents = customEvents.filter((e) => {
                      const isOnDate = isEventOnDate(e, dateStr);
                      if (!isOnDate) return false;
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
                            className={`text-base sm:text-lg font-black leading-none ${isSunday ? 'text-[#FFDE59]' : 'text-white'
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
                            className={`text-[10px] sm:text-[11px] font-bold rounded px-1 ${isFirstOrFullMoon
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
                            const isMulti = evt.isMultiDay || (evt.endDateStr && evt.endDateStr !== evt.solarDateStr);
                            const status = isMulti ? getEventDayStatus(evt, dateStr) : null;

                            return (
                              <div
                                key={`${evt.id}-${dayNum}`}
                                onClick={() => handleOpenEditEvent(evt)}
                                className="relative group/admin-icon cursor-pointer transition-transform hover:scale-125 z-10 hover:z-50"
                              >
                                <div
                                  className={`w-7 h-7 rounded-full p-0.5 shadow-md flex items-center justify-center transition-all ${isDaiLe
                                      ? 'bg-red-950/90 border border-red-500 hover:border-[#FFDE59] shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                      : isMulti
                                        ? 'bg-[#3A2010] border-2 border-[#FFDE59] hover:border-white shadow-[0_0_8px_rgba(255,222,89,0.6)]'
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
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-xl bg-[#1C0F08]/98 border border-[#FFDE59] shadow-[0_10px_30px_rgba(0,0,0,0.95)] backdrop-blur-md opacity-0 group-hover/admin-icon:opacity-100 transition-all duration-200 z-50 text-left space-y-1 transform scale-95 group-hover/admin-icon:scale-100">
                                  <div className="flex items-center justify-between pb-1 border-b border-[#F2C14E]/25">
                                    <div className="flex items-center gap-1.5">
                                      <img src={iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                                      <span className="text-[10px] font-bold uppercase text-[#FFDE59]">
                                        {evt.category}
                                      </span>
                                    </div>
                                    {status && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#F2C14E] text-black">
                                        {status.isFirst ? 'Khai Đàn' : status.isLast ? 'Hoàn Mãn' : `Ngày ${status.dayIndex}/${status.totalDays}`}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-bold text-white leading-tight line-clamp-2">
                                    {evt.title}
                                  </div>
                                  {status && (
                                    <div className="text-[10px] text-[#FFE5A3] font-medium">
                                      ⏱ Khóa tu {status.totalDays} ngày ({evt.solarDateStr} ➔ {evt.endDateStr})
                                    </div>
                                  )}
                                  {evt.subtitle && (
                                    <div className="text-[11px] text-amber-200/90 italic leading-tight line-clamp-2">
                                      {evt.subtitle}
                                    </div>
                                  )}
                                  <div className="text-[10px] text-amber-300/80 pt-1 border-t border-[#F2C14E]/20 flex items-center justify-between">
                                    <span>{evt.timeSlot1Time || 'Thời khóa'}</span>
                                    <span className="text-[#FFDE59] font-semibold text-[9px]">Bấm để sửa toàn chuỗi ✎</span>
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

      {/* ── TAB 3: KHO ẢNH QUOTE / PHÁP NGỮ DÙNG CHUNG ── */}
      {activeTab === 'quotes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2A180D]/50 p-4 rounded-xl border border-[#F2C14E]/20">
            <div>
              <h2 className="text-lg font-bold text-[#F2C14E] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFDE59]" />
                <span>Kho Ảnh Quote / Pháp Ngữ Dùng Chung ({quoteGallery.length})</span>
              </h2>
              <p className="text-xs text-[#e3d2c1]/70 mt-0.5">
                Các ảnh trong kho này sẽ tự động chạy luân phiên trên slide trang chủ ở tất cả các tháng (không cần chọn quote nào cho tháng nào)
              </p>
            </div>
            <button
              type="button"
              onClick={addQuote}
              className="px-4 py-2 bg-gradient-to-r from-[#F2C14E] to-[#D4A338] hover:from-[#f5cb68] hover:to-[#dfaf44] text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Ảnh Quote Mới</span>
            </button>
          </div>

          {/* Grid of Quote Cards */}
          {quoteGallery.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#201007] border border-[#F2C14E]/20 text-[#FFE5A3]/60">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#F2C14E]" />
              <p className="text-sm font-medium">Chưa có ảnh quote nào trong kho dùng chung.</p>
              <button
                type="button"
                onClick={addQuote}
                className="mt-4 px-4 py-2 bg-[#3A2213] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/40 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ảnh đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {quoteGallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-[#24130A] to-[#180A04] border border-[#F2C14E]/30 hover:border-[#F2C14E]/60 shadow-lg flex flex-col justify-between transition group"
                >
                  <div className="space-y-3">
                    {/* Badge thứ tự */}
                    <div className="flex items-center justify-between text-xs text-[#F2C14E]">
                      <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 border border-[#F2C14E]/30">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] text-[#FFE5A3]/60">Slide {idx + 2}</span>
                    </div>

                    {/* Preview 3:4 */}
                    <div
                      onClick={() =>
                        handleOpenImagePicker(
                          (url) => updateQuote(item.id, 'url', url),
                          'lich-tu-hoc/quotes'
                        )
                      }
                      className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#F2C14E]/40 cursor-pointer group/img bg-black shadow-inner"
                      title="Bấm để chọn ảnh từ Cloud S3"
                    >
                      <Image
                        src={item.url || '/images/default.jpg'}
                        alt={item.title || 'Quote poster'}
                        fill
                        className="object-contain p-1 transition-transform duration-300 group-hover/img:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#FFDE59] gap-1 p-2 text-center">
                        <ImageIcon className="w-6 h-6 text-[#F2C14E]" />
                        <span className="text-xs font-bold">Đổi ảnh S3</span>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className="text-[10px] text-[#F2C14E]/80 font-semibold block mb-0.5">
                        Link Ảnh (S3 / URL):
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateQuote(item.id, 'url', e.target.value)}
                        placeholder="Đường dẫn ảnh..."
                        className="w-full px-2.5 py-1.5 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-white/90 text-xs focus:border-[#F2C14E] outline-none"
                      />
                    </div>

                    {/* Title Input */}
                    <div>
                      <label className="text-[10px] text-[#F2C14E]/80 font-semibold block mb-0.5">
                        Tiêu Đề / Ý Nghĩa:
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateQuote(item.id, 'title', e.target.value)}
                        placeholder="Tiêu đề / Ý nghĩa câu quote..."
                        className="w-full px-2.5 py-1.5 bg-[#120803] border border-[#F2C14E]/30 rounded-lg text-[#FFDE59] font-medium text-xs focus:border-[#F2C14E] outline-none"
                      />
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F2C14E]/20">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuote(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Di chuyển lên trước"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuote(idx, 'down')}
                        disabled={idx === quoteGallery.length - 1}
                        className="p-1.5 rounded-lg bg-black/50 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        title="Di chuyển xuống sau"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteQuote(item.id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 transition cursor-pointer"
                      title="Xóa ảnh này khỏi kho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL CẬP NHẬT THỜI KHÓA SỰ KIỆN CHI TIẾT ── */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1C0F08] border border-[#F2C14E]/60 shadow-[0_20px_70px_rgba(0,0,0,0.95)] p-5 sm:p-7 space-y-5 text-white">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30">
              <div>
                <span className="text-[11px] text-[#F2C14E] font-bold uppercase tracking-widest block">
                  {isNewEvent ? 'Thêm Thời Khóa Mới' : 'Thông Tin Thời Khóa Tu Học'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#FFDE59] mt-0.5 tracking-wide">
                  {editingEvent.isMultiDay || (editingEvent.endDateStr && editingEvent.endDateStr !== editingEvent.solarDateStr) ? (
                    `Khóa Tu Chuỗi Ngày: ${editingEvent.solarDateStr} ➔ ${editingEvent.endDateStr || editingEvent.solarDateStr}`
                  ) : (
                    `Thời Khóa Ngày ${editingEvent.solarDateStr}`
                  )}
                  {(() => {
                    if (!editingEvent.solarDateStr) return '';
                    const parts = editingEvent.solarDateStr.split('.');
                    if (parts.length === 3) {
                      const d = parseInt(parts[0], 10);
                      const m = parseInt(parts[1], 10) - 1;
                      const y = parseInt(parts[2], 10);
                      const l = convertSolarToLunar(d, m, y);
                      return ` (${String(l.day).padStart(2, '0')}.${String(l.month).padStart(2, '0')} ÂL)`;
                    }
                    return '';
                  })()}
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
              {/* Lựa Chọn Hình Thức Thời Gian: Kỳ hạn Khóa Tu Trong 1 ngày vs Khóa tu nhiều ngày (Chuẩn SEO) */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-[#F2C14E]/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs text-[#F2C14E] font-bold block">
                    Kỳ hạn Khóa Tu:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvent({
                          ...editingEvent,
                          isMultiDay: false,
                          endDateStr: undefined,
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${!editingEvent.isMultiDay && (!editingEvent.endDateStr || editingEvent.endDateStr === editingEvent.solarDateStr)
                          ? 'bg-[#F2C14E] text-black shadow-md ring-1 ring-[#FFDE59]'
                          : 'bg-[#2A180D] text-[#FFE5A3]/70 hover:text-white border border-[#F2C14E]/20'
                        }`}
                    >
                      <span>Trong 1 ngày</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const curStart = parseSolarDateStr(editingEvent.solarDateStr) || new Date();
                        const nextDays = new Date(curStart);
                        nextDays.setDate(curStart.getDate() + 9); // Gợi ý mặc định 10 ngày
                        setEditingEvent({
                          ...editingEvent,
                          isMultiDay: true,
                          endDateStr: editingEvent.endDateStr || formatSolarDateStr(nextDays),
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${editingEvent.isMultiDay || (editingEvent.endDateStr && editingEvent.endDateStr !== editingEvent.solarDateStr)
                          ? 'bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] text-black shadow-md ring-1 ring-[#FFDE59]'
                          : 'bg-[#2A180D] text-[#FFE5A3]/70 hover:text-white border border-[#F2C14E]/20'
                        }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Khóa tu nhiều ngày</span>
                    </button>
                  </div>
                </div>

                {/* Chi Tiết Từ Ngày & Đến Ngày nếu chọn Khóa tu nhiều ngày */}
                {editingEvent.isMultiDay || (editingEvent.endDateStr && editingEvent.endDateStr !== editingEvent.solarDateStr) ? (
                  <div className="pt-2 border-t border-[#F2C14E]/20 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        {(() => {
                          const isPhapHoi =
                            editingEvent.category === 'Đại Lễ Sự Kiện' ||
                            (editingEvent.title || '').toLowerCase().includes('pháp hội') ||
                            (editingEvent.title || '').toLowerCase().includes('sám');
                          const startLabel = isPhapHoi ? 'Khai Đàn' : 'Khai Khóa';
                          return (
                            <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                              Từ Ngày ({startLabel}) [DD.MM.YYYY]:
                            </label>
                          );
                        })()}
                        <input
                          type="text"
                          value={editingEvent.solarDateStr}
                          onChange={(e) => setEditingEvent({ ...editingEvent, solarDateStr: e.target.value })}
                          placeholder="09.11.2026"
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white font-bold text-xs focus:border-[#F2C14E] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                          Đến Ngày (Kết Khóa) [DD.MM.YYYY]:
                        </label>
                        <input
                          type="text"
                          value={editingEvent.endDateStr || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, endDateStr: e.target.value, isMultiDay: true })}
                          placeholder="18.11.2026"
                          className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-[#FFDE59] font-bold text-xs focus:border-[#F2C14E] outline-none"
                        />
                      </div>
                    </div>

                    {/* Ô Nhập Riêng: Giờ Ngày Kết Khóa */}
                    <div>
                      <label className="text-[11px] text-[#FFE5A3]/90 font-semibold block mb-1">
                        Giờ Ngày Kết Khóa (Nhập riêng nếu khác ngày thường):
                      </label>
                      <input
                        type="text"
                        value={editingEvent.endDayTime || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, endDayTime: e.target.value })}
                        placeholder="Ví dụ: 14h00 - 16h00 hoặc Đến 16h00 chiều..."
                        className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white font-medium text-xs focus:border-[#F2C14E] outline-none"
                      />
                    </div>

                    {/* Checkbox: Sau khi kết khóa, thời khóa tụng kinh vẫn tiếp tục được duy trì */}
                    <div className="p-3 rounded-xl bg-[#201109] border border-[#F2C14E]/25 space-y-2.5">
                      <label className="flex items-start gap-2.5 text-xs text-[#FFE5A3] font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!editingEvent.continueChanting}
                          onChange={(e) =>
                            setEditingEvent({
                              ...editingEvent,
                              continueChanting: e.target.checked,
                              continueChantingUntil: e.target.checked ? (editingEvent.continueChantingUntil || '') : undefined,
                            })
                          }
                          className="accent-[#F2C14E] w-4 h-4 cursor-pointer rounded mt-0.5"
                        />
                        <div>
                          <span className="font-semibold text-white">Sau khi kết khóa, thời khóa tụng kinh vẫn tiếp tục được duy trì</span>
                          <p className="text-[11px] text-[#FFE5A3]/70 font-normal mt-0.5">
                            Ngày kết thúc khóa tu sẽ hiển thị &quot;Kết khóa&quot;. Hệ thống sẽ phủ tiếp lịch tụng kinh và tự động hiển thị &quot;Tạ đàn&quot; vào ngày kết thúc tụng.
                          </p>
                        </div>
                      </label>

                      {editingEvent.continueChanting && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F2C14E]/15">
                          <div>
                            <label className="text-[11px] text-[#F2C14E] font-semibold block mb-1">
                              Tụng kinh tiếp đến ngày (Tạ đàn) [DD.MM.YYYY]:
                            </label>
                            <input
                              type="text"
                              value={editingEvent.continueChantingUntil || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, continueChantingUntil: e.target.value })}
                              placeholder="Ví dụ: 20.11.2026"
                              className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-[#FFDE59] font-bold text-xs focus:border-[#F2C14E] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-[#FFE5A3]/80 font-semibold block mb-1">
                              Tên kinh tụng tiếp (Tùy chọn):
                            </label>
                            <input
                              type="text"
                              value={editingEvent.continueChantingName || ''}
                              onChange={(e) => setEditingEvent({ ...editingEvent, continueChantingName: e.target.value })}
                              placeholder="Để trống sẽ lấy theo tên khóa tu (VD: Lương Hoàng Sám)"
                              className="w-full px-3 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white text-xs focus:border-[#F2C14E] outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tóm tắt thời lượng */}
                    {(() => {
                      const total = calcDaysDifference(editingEvent.solarDateStr, editingEvent.endDateStr || editingEvent.solarDateStr);
                      return (
                        <div className="p-2.5 rounded-xl bg-[#2A180D] border border-[#F2C14E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#FFE5A3]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                            <span>Tổng thời gian: <b className="text-[#FFDE59]">{total} ngày liên tục</b> ({editingEvent.solarDateStr} ➔ {editingEvent.endDateStr || editingEvent.solarDateStr})</span>
                          </span>
                          <span className="text-[11px] text-[#F2C14E]/90 italic">
                            ★ Bạn chỉ cần lưu 1 lần, hệ thống tự động phủ kín cả {total} ngày
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#FFE5A3]/70 italic">
                    Sự kiện diễn ra trong 1 ngày duy nhất: <b className="text-white">{editingEvent.solarDateStr}</b>
                  </div>
                )}
              </div>
              {/* Phân Loại (3 loại có icon chính thức) */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1.5">
                  Phân Loại Chương Trình (Biểu Tượng Hiển Thị Trên Lịch):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Loại 1: Cộng Tu */}
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${editingEvent.category === 'Cộng Tu'
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
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${editingEvent.category === 'Khóa Lễ Truyền Thống'
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
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${editingEvent.category === 'Đại Lễ Sự Kiện'
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

              {/* Tên Sự Kiện */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Tên Khóa Lễ / Sự Kiện Chính:
                </label>
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

              {/* Sub Tiêu Đề */}
              <div>
                <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                  Sub Tiêu Đề (Thông tin chi tiết phụ, mục đích khóa lễ):
                </label>
                <input
                  type="text"
                  value={editingEvent.subtitle || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, subtitle: e.target.value })}
                  placeholder="Ví dụ: Cầu Siêu Thai Nhi Sản Nạn, Mẫu Nạn (Khai Đàn)"
                  className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/30 rounded-xl text-amber-200 text-xs focus:border-[#F2C14E] outline-none"
                />
              </div>

              {/* Ảnh Poster với S3 Picker Click & Căn Chỉnh Vị Trí Lên / Xuống */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#F2C14E] font-bold block">
                    Ảnh Poster / Banner (Bấm ảnh để chọn từ S3):
                  </label>
                  <span className="text-[11px] text-[#FFE5A3]/80 font-medium">
                    Điểm hiển thị dọc: <b className="text-[#F2C14E]">{editingEvent.imgPositionY ?? 50}%</b>
                  </span>
                </div>

                <div
                  onClick={() =>
                    handleOpenImagePicker(
                      (url) => setEditingEvent({ ...editingEvent, imgUrl: url }),
                      '01-trang-chu'
                    )
                  }
                  className="relative w-full h-40 rounded-xl overflow-hidden border border-[#F2C14E]/40 cursor-pointer group bg-black shadow-inner"
                >
                  <Image
                    src={editingEvent.imgUrl || '/images/default.jpg'}
                    alt={editingEvent.title}
                    fill
                    style={{
                      objectPosition: `center ${editingEvent.imgPositionY ?? 50}%`,
                    }}
                    className="object-cover transition-all duration-200 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#F2C14E] gap-1 p-2">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs font-bold">Bấm để đổi ảnh S3</span>
                  </div>
                </div>

                {/* Thanh điều khiển căn chỉnh Lên / Xuống (Trục Y) - Kéo trượt thời gian thực */}
                <div className="p-2.5 rounded-xl bg-black/45 border border-[#F2C14E]/30 flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#FFE5A3] shrink-0 font-medium">
                    <span>↕ Căn Lên / Xuống:</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={editingEvent.imgPositionY ?? 50}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        imgPositionY: parseInt(e.target.value, 10),
                      })
                    }
                    className="flex-1 w-full accent-[#F2C14E] h-2 bg-[#2A180D] rounded-lg cursor-pointer"
                  />

                  {/* 3 Nút chọn nhanh */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, imgPositionY: 15 })}
                      className="px-2 py-0.5 rounded text-[10.5px] bg-[#2A180D] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 transition cursor-pointer"
                    >
                      Đỉnh (Top)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, imgPositionY: 50 })}
                      className="px-2 py-0.5 rounded text-[10.5px] bg-[#2A180D] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 transition cursor-pointer"
                    >
                      Giữa (50%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, imgPositionY: 85 })}
                      className="px-2 py-0.5 rounded text-[10.5px] bg-[#2A180D] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 transition cursor-pointer"
                    >
                      Đáy (Bottom)
                    </button>
                  </div>
                </div>
              </div>

              {/* Khung 4 Ô: Tên Thời Khóa, Thời Gian, Thời Lượng, Địa Điểm (Sắp xếp theo thứ tự yêu cầu, lưới 2 cột gọn gàng) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-black/40 border border-[#F2C14E]/30 shadow-inner">
                {/* 1. Tên Thời Khóa (Đưa lên trước theo yêu cầu) */}
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Tên Thời Khóa (Tùy Chọn):
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timeSlot1Label || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeSlot1Label: e.target.value })}
                    placeholder="Ví dụ: Cả ngày, Khai Đàn, Lễ Quy Y..."
                    className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-[#FFDE59] text-xs focus:border-[#F2C14E] outline-none"
                  />
                </div>

                {/* 2. Thời Gian (Giờ Bắt Đầu) */}
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Thời Gian (Giờ Bắt Đầu):
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timeSlot1Time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeSlot1Time: e.target.value })}
                    placeholder="Ví dụ: 08h00, 19h00, 08h00 - 17h00..."
                    className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white font-medium text-xs focus:border-[#F2C14E] outline-none"
                  />
                </div>

                {/* 3. Thời Lượng (Nếu Có) */}
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Thời Lượng (Nếu Có):
                  </label>
                  <input
                    type="text"
                    value={editingEvent.timeSlot2Time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeSlot2Time: e.target.value })}
                    placeholder="Ví dụ: 90 phút, 120 phút, Cả ngày..."
                    className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-amber-200 text-xs focus:border-[#F2C14E] outline-none"
                  />
                </div>

                {/* 4. Địa Điểm Tổ Chức */}
                <div>
                  <label className="text-xs text-[#F2C14E] font-bold block mb-1">
                    Địa Điểm Tổ Chức:
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="Ví dụ: Tùng Lâm Hòa Phúc..."
                    className="w-full px-3.5 py-2 bg-[#120803] border border-[#F2C14E]/40 rounded-xl text-white text-xs focus:border-[#F2C14E] outline-none"
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
