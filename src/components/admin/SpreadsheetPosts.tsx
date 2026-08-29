'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Save,
  Trash2,
  Eye,
  Edit3,
  Search,
  Filter,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Video,
  Layers,
  Images,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Quote,
  Heading1,
  Heading2,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
  Loader2,
  Zap,
  Info,
  Waves,
  Landmark,
  Compass,
  Flame,
  ArrowLeft,
  ChevronRight,
  Bell
} from 'lucide-react';

import ZenTipTapEditor from './ZenTipTapEditor';
import { S3FileExplorerModal } from './S3FileExplorerModal';
import { PostRecord, KeywordItem, SourceBook, VideoBlock, FeaturedArticle, PhotoItem, RelatedEdition, UpcomingEvent } from '@/app/api/admin/posts/route';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';

// 🪷 KHỐI KÉO THẢ CHỈNH TIÊU ĐIỂM HÌNH ẢNH TRỰC QUAN
function InteractiveImageDrag({
  imageUrl,
  position,
  onPositionChange,
  className = 'w-full h-48',
  children,
}: {
  imageUrl: string;
  position: string;
  onPositionChange: (newPos: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointer = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));

    onPositionChange(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handlePointer(e);
      }}
      onMouseMove={(e) => {
        if (isDragging) handlePointer(e);
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => {
        setIsDragging(true);
        handlePointer(e);
      }}
      onTouchMove={(e) => {
        if (isDragging) handlePointer(e);
      }}
      onTouchEnd={() => setIsDragging(false)}
      className={`relative overflow-hidden select-none cursor-crosshair rounded-2xl border border-[#F2C14E]/60 shadow-lg group bg-black ${className}`}
    >
      <img
        src={imageUrl}
        alt="Căn chỉnh khung nhìn"
        style={{ objectPosition: position || 'center 50%' }}
        className="w-full h-full object-cover pointer-events-none transition-none"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.4';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Grid 3x3 mờ hướng dẫn bố cục */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-white/60" />
        <div className="border-r border-white/60" />
        <div />
      </div>

      {/* Điểm tiêu điểm vàng */}
      <div
        style={{
          left: position.split(' ')[0] || '50%',
          top: position.split(' ')[1] || '50%',
        }}
        className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#F2C14E] shadow-[0_0_12px_#F2C14E] pointer-events-none flex items-center justify-center"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-black" />
      </div>

      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-[#FFE5A3] font-mono pointer-events-none border border-[#F2C14E]/30">
        Tiêu điểm: {position}
      </div>

      {children}
    </div>
  );
}

// 🪷 Converter Markdown -> WYSIWYG Google Docs HTML
function markdownToWysiwygHtml(raw: string): string {
  if (!raw) return '<p class="mb-5"><br></p>';
  let html = raw.replace(/&gt;/g, '>').replace(/&lt;/g, '<');

  // Images: ![caption](url) -> Khối ảnh tương tác
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, caption, url) => {
    const cleanCap = caption || 'Chú thích hình ảnh...';
    return `\n\n<div class="my-6 text-center select-none visual-img-block relative group/img inline-block w-full max-w-2xl mx-auto" data-img-url="${url}">
      <div class="relative inline-block max-w-full group">
        <img src="${url}" class="max-h-80 mx-auto rounded-2xl border-2 border-[#F2C14E]/60 shadow-xl object-contain hover:border-[#F2C14E] cursor-pointer" />
      </div>
      <div class="mt-2 text-center">
        <p class="img-caption-text text-xs italic text-[#FFE5A3] font-medium focus:outline-none hover:bg-[#3A2718]/60 px-3 py-1 rounded-lg border border-transparent focus:border-[#F2C14E]/60 cursor-text inline-block min-w-[140px]" contenteditable="true">(${cleanCap})</p>
      </div>
    </div>\n\n`;
  });

  // Headings
  html = html.replace(/^### (.*?)$/gm, '\n\n<h3 class="text-2xl font-bold uppercase text-[#FFDE59] my-4 tracking-wide">$1</h3>\n\n');
  html = html.replace(/^#### (.*?)$/gm, '\n\n<h4 class="text-lg font-semibold italic text-[#FFE5A3] my-3">$1</h4>\n\n');

  // Quotes: Gom nhóm tất cả các dòng bắt đầu bằng > liên tiếp thành 1 khối blockquote duy nhất với <br>
  html = html.replace(/(?:^>\s*(?:.*?)$(?:\r?\n|$))+/gm, (match) => {
    const lines = match
      .split(/\r?\n/)
      .map((l) => l.replace(/^>\s*/, '').trim())
      .filter(Boolean);
    const inner = lines.join('<br>');
    const cleaned = inner.replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    return `\n\n<blockquote class="border-l-3 border-[#F2C14E] pl-4 my-4 italic text-[#FFE5A3] font-semibold quote-zen-block">“${cleaned}”</blockquote>\n\n`;
  });

  // Tách dòng tác giả (*Vô Trí - Tâm Hòa*) thành 1 khối đoạn văn riêng biệt không bao giờ dính vào văn bản trước hay sau
  html = html.replace(/(?:\r?\n)*(\*?(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)[^\n]*\*?)(?:\r?\n)*/gi, '\n\n$1\n\n');

  // Horizontal Rules
  html = html.replace(/^---$/gm, '\n\n<hr class="my-6 border-[#F2C14E]/30" />\n\n');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<i>$1</i>');

  // Paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h3') ||
        trimmed.startsWith('<h4') ||
        trimmed.startsWith('<div class="my-6') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr')
      ) {
        return trimmed;
      }
      return `<p class="mb-5">${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('');

  return html || '<p class="mb-5"><br></p>';
}

// 🪷 Converter WYSIWYG Google Docs HTML -> Markdown
function wysiwygHtmlToMarkdown(html: string): string {
  if (!html || typeof window === 'undefined') return html || '';
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const imgBlocks = temp.querySelectorAll('.visual-img-block');
  imgBlocks.forEach((b) => {
    const url = b.getAttribute('data-img-url') || b.querySelector('img')?.getAttribute('src') || '';
    const capEl = b.querySelector('.img-caption-text') || b.querySelector('p');
    let caption = capEl?.textContent?.replace(/^\(|\)$/g, '').trim() || '';
    if (caption === 'Chú thích hình ảnh...' || caption === 'Nhập chú thích ảnh...') caption = '';
    const textNode = document.createTextNode(`\n\n![${caption}](${url})\n\n`);
    b.replaceWith(textNode);
  });

  const rawImgs = temp.querySelectorAll('img');
  rawImgs.forEach((img) => {
    const url = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const textNode = document.createTextNode(`\n\n![${alt}](${url})\n\n`);
    img.replaceWith(textNode);
  });

  const h3s = temp.querySelectorAll('h3');
  h3s.forEach((h) => {
    const cleanTitle = h.textContent?.replace(/^#{1,4}\s*/, '').trim() || '';
    const textNode = document.createTextNode(`\n\n### ${cleanTitle}\n\n`);
    h.replaceWith(textNode);
  });

  const h4s = temp.querySelectorAll('h4');
  h4s.forEach((h) => {
    const cleanTitle = h.textContent?.replace(/^#{1,4}\s*/, '').trim() || '';
    const textNode = document.createTextNode(`\n\n#### ${cleanTitle}\n\n`);
    h.replaceWith(textNode);
  });

  // Blockquotes (Chuẩn Markdown > Text mà không làm mất cấu trúc, giữ trọn vẹn từng dòng không bao giờ dính chữ)
  const bqs = temp.querySelectorAll('blockquote');
  bqs.forEach((b) => {
    b.querySelectorAll('br').forEach((br) => br.replaceWith(document.createTextNode('\n')));
    b.querySelectorAll('p, div, h1, h2, h3, h4, li').forEach((el) => {
      el.insertAdjacentText('beforebegin', '\n');
      el.insertAdjacentText('afterend', '\n');
    });
    const rawText = b.textContent || '';
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l) => `> ${l.replace(/^[“"”]+|[“"”]+$/g, '').trim()}`).filter((l) => l !== '>');
    const textNode = document.createTextNode(`\n\n${quoteLines.join('\n')}\n\n`);
    b.replaceWith(textNode);
  });

  const hrs = temp.querySelectorAll('hr');
  hrs.forEach((hr) => {
    const textNode = document.createTextNode(`\n\n---\n\n`);
    hr.replaceWith(textNode);
  });

  // Convert remaining <br> tags
  const brs = temp.querySelectorAll('br');
  brs.forEach((br) => {
    br.replaceWith(document.createTextNode('\n'));
  });

  // Convert paragraphs and divs
  const paragraphs = temp.querySelectorAll('p, div');
  paragraphs.forEach((p) => {
    p.insertAdjacentText('beforebegin', '\n\n');
    p.insertAdjacentText('afterend', '\n\n');
  });

  let md = temp.innerHTML
    .replace(/(?:<strong[^>]*>|<b[^>]*>)+/gi, '<b>')
    .replace(/(?:<\/strong>|<\/b>)+/gi, '</b>')
    .replace(/(?:<em[^>]*>|<i[^>]*>)+/gi, '<i>')
    .replace(/(?:<\/em>|<\/i>)+/gi, '</i>')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '$1')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n\n$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  // Đảm bảo tác giả trong markdown luôn có 2 dòng trống cách biệt
  md = md.replace(/(?:\r?\n)*(\*?(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)[^\n]*\*?)(?:\r?\n)*/gi, '\n\n$1\n\n');

  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

// 🪷 TỰ ĐỘNG LÀM SẠCH VĂN BẢN VÀ TRÍCH XUẤT TÁC GIẢ TỰ ĐỘNG
function cleanAndExtractContent(raw: string, currentArticle?: Partial<PostRecord>): {
  cleanedContent: string;
  author?: string;
} {
  if (!raw) return { cleanedContent: '' };
  let text = raw.replace(/\r\n/g, '\n');

  // Gọt bỏ tiêu đề trùng lặp ở đầu bài nếu có
  if (currentArticle?.title) {
    const titleRegex = new RegExp(`^#*\\s*${currentArticle.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+`, 'i');
    text = text.replace(titleRegex, '');
  }

  // Quét dòng tác giả ở cuối bài
  let detectedAuthor: string | undefined = undefined;
  const authorMatch = text.match(/\n+(?:Tác giả|Biên soạn|Chấp bút|Kính ghi|Sa Môn|Thích|Vô Trí)[\s:]*([^\n]+)$/i);
  if (authorMatch && authorMatch[1]) {
    detectedAuthor = authorMatch[1].trim();
  }

  return {
    cleanedContent: text.trim(),
    author: detectedAuthor,
  };
}

// DANH MỤC LỚN PHÂN HỆ
const MAIN_CATEGORIES = [
  { id: 'all', label: 'Tất Cả Phân Hệ', icon: BookOpen },
  { id: 'dong-chay-hoang-phap', label: 'Dòng Chảy Hoằng Pháp', icon: Waves },
  { id: 'tri-tue-phat-phap', label: 'Trí Tuệ Phật Pháp', icon: Sparkles },
  { id: 'gioi-thieu', label: 'Giới Thiệu Tông Phong', icon: Landmark },
];

const SUB_CATEGORIES_HOANG_PHAP = [
  { id: 'all', label: 'Tất cả 4 mục' },
  { id: 'cong-tu', label: '1. Cộng Tu' },
  { id: 'khoa-le-truyen-thong', label: '2. Khóa Lễ Truyền Thống' },
  { id: 'dai-le-su-kien', label: '3. Đại Lễ Sự Kiện' },
  { id: 'tinh-do-nhan-gian', label: '4. Tịnh Độ Nhân Gian' },
];

const SUB_CATEGORIES_TRI_TUE = [
  { id: 'all', label: 'Tất cả danh mục' },
  { id: 'giao-ly-kinh-dien', label: 'Giáo Lý & Kinh Điển' },
  { id: 'phap-thoai', label: 'Pháp Thoại & Bài Giảng' },
  { id: 'cau-chuyen-dao', label: 'Câu Chuyện Đạo & Nhân Quả' },
  { id: 'phap-nhac', label: 'Pháp Nhạc & Thi Ca' },
  { id: 'an-pham-sach', label: 'Ấn Phẩm & Sách' },
];

export function SpreadsheetPosts() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [mainTab, setMainTab] = useState('all');
  const [subTab, setSubTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 🌟 S3 File Explorer Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);

  // 🌟 Big WYSIWYG Editor Modal State
  const [bigEditor, setBigEditor] = useState<{
    rowIndex: number;
    value: string;
  } | null>(null);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    quote: false,
  });
  const [floatingMenu, setFloatingMenu] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const wysiwygEditorRef = useRef<HTMLDivElement>(null);

  // 🌟 Media Modal State
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    tab: 'banner' | 'video' | 'featured' | 'gallery' | 'editions' | 'events';
  } | null>(null);

  // 🌟 Annotation Modal State
  const [annotationModal, setAnnotationModal] = useState<{
    isOpen: boolean;
    tab: 'keyword' | 'book' | 'author';
    selectedText: string;
    editingIndex?: number | null;
    originalKey?: string;
    rowIndex?: number;
  } | null>(null);

  const [annoKw, setAnnoKw] = useState<KeywordItem>({ keyword: '', title: '', description: '', imageUrl: '', linkUrl: '' });
  const [annoBook, setAnnoBook] = useState<SourceBook>({ bookTitle: '', author: '', coverImage: '', description: '', linkUrl: '' });
  const [annoAuthor, setAnnoAuthor] = useState<{ name: string; link: string }>({ name: '', link: '' });

  // 🌟 Live Preview Modal
  const [previewModal, setPreviewModal] = useState<PostRecord | null>(null);
  const [activePreviewKeyword, setActivePreviewKeyword] = useState<(KeywordItem & { _articleIndex?: number }) | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err: any) {
      showToast(`Lỗi khi tải dữ liệu bài viết: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Open S3 Library Helper
  const openS3Library = (callback: (url: string, caption?: string) => void) => {
    setTargetImageCallback(() => callback);
    setImageLibraryOpen(true);
  };

  // Upload file trực tiếp lên S3
  const uploadImageFileDirectly = async (file: File, folderPath: string = 'dong-chay-hoang-phap'): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', folderPath);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        showToast('✨ Đã tải ảnh lên S3 thành công!');
        return data.url;
      } else {
        showToast(data.error || 'Lỗi khi tải ảnh lên S3');
        return null;
      }
    } catch (err: any) {
      showToast(`Lỗi tải ảnh: ${err.message}`);
      return null;
    }
  };

  // Format tracking trong WYSIWYG
  const updateEditorSelectionAndFormat = () => {
    if (typeof window === 'undefined' || !wysiwygEditorRef.current) return;
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');
    const isUnderline = document.queryCommandState('underline');

    const sel = window.getSelection();
    let isH1 = false;
    let isH2 = false;
    let isQuote = false;

    if (sel && sel.rangeCount > 0) {
      let node = sel.anchorNode as HTMLElement | null;
      while (node && node !== wysiwygEditorRef.current) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'h3') isH1 = true;
        if (tag === 'h4') isH2 = true;
        if (tag === 'blockquote') isQuote = true;
        node = node.parentElement;
      }

      // Check text selection for floating menu
      const selectedText = sel.toString().trim();
      if (selectedText.length > 0 && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.top > 0) {
          setFloatingMenu({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            text: selectedText,
          });
        }
      } else {
        setFloatingMenu(null);
      }
    }

    setCurrentFormat({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      h1: isH1,
      h2: isH2,
      quote: isQuote,
    });
  };

  const handleExecCommand = (command: string, value: string = '') => {
    if (typeof window === 'undefined' || !wysiwygEditorRef.current) return;
    wysiwygEditorRef.current.focus();
    document.execCommand(command, false, value);
    updateEditorSelectionAndFormat();
    setIsDirty(true);
  };

  const toggleFormatBlock = (tag: 'h3' | 'h4' | 'blockquote') => {
    if (typeof window === 'undefined' || !wysiwygEditorRef.current) return;
    wysiwygEditorRef.current.focus();

    if (tag === 'blockquote') {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      let parentNode: Node | null = range.commonAncestorContainer;
      if (parentNode.nodeType === Node.TEXT_NODE) {
        parentNode = parentNode.parentNode;
      }
      const existingBq = (parentNode as HTMLElement)?.closest?.('blockquote');

      if (existingBq || currentFormat.quote) {
        const targetBq = existingBq || (wysiwygEditorRef.current.querySelector('blockquote') as HTMLElement | null);
        if (targetBq) {
          const innerText = targetBq.textContent?.replace(/^[“"”\s]+|[“"”\s]+$/g, '') || '';
          const lines = innerText.split('\n').map((l) => l.trim()).filter(Boolean);
          const frag = document.createDocumentFragment();
          if (lines.length > 0) {
            lines.forEach((l) => {
              const p = document.createElement('p');
              p.className = 'mb-5';
              p.textContent = l.replace(/^(?:>|&gt;|Quote:)\s*/i, '');
              frag.appendChild(p);
            });
          } else {
            const p = document.createElement('p');
            p.className = 'mb-5';
            p.innerHTML = '<br>';
            frag.appendChild(p);
          }
          targetBq.replaceWith(frag);
        } else {
          document.execCommand('formatBlock', false, '<p>');
        }
      } else {
        if (!sel.isCollapsed) {
          const selectedText = sel.toString();
          const rawLines = selectedText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          const cleanLines = rawLines
            .map((l) => l.replace(/^(?:>|&gt;|Quote:)\s*/i, '').replace(/^[“"”\s]+|[“"”\s]+$/g, '').trim())
            .filter(Boolean);

          const bq = document.createElement('blockquote');
          bq.className = 'border-l-3 border-[#F2C14E] pl-4 my-4 italic text-[#FFE5A3] font-semibold quote-zen-block';

          if (cleanLines.length > 0) {
            bq.innerHTML = `“${cleanLines.join('<br>')}”`;
          } else {
            bq.innerHTML = '“Trích dẫn lời dạy thiền môn...”';
          }

          range.deleteContents();
          range.insertNode(bq);

          const afterP = document.createElement('p');
          afterP.className = 'mb-5';
          afterP.innerHTML = '<br>';
          bq.after(afterP);

          const newRange = document.createRange();
          newRange.selectNodeContents(bq);
          sel.removeAllRanges();
          sel.addRange(newRange);
        } else {
          const bq = document.createElement('blockquote');
          bq.className = 'border-l-3 border-[#F2C14E] pl-4 my-4 italic text-[#FFE5A3] font-semibold quote-zen-block';
          bq.innerHTML = '“Trích dẫn lời dạy thiền môn...”';
          range.insertNode(bq);

          const afterP = document.createElement('p');
          afterP.className = 'mb-5';
          afterP.innerHTML = '<br>';
          bq.after(afterP);

          const newRange = document.createRange();
          newRange.selectNodeContents(bq);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
      setIsDirty(true);
      updateEditorSelectionAndFormat();
      return;
    }

    const isCurrentlyActive = tag === 'h3' ? currentFormat.h1 : currentFormat.h2;
    if (isCurrentlyActive) {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    updateEditorSelectionAndFormat();
  };

  // Kéo thả ném file ảnh trực tiếp vào khung soạn thảo WYSIWYG
  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          showToast('⏳ Đang tải ảnh lên S3...');
          const url = await uploadImageFileDirectly(file, 'dong-chay-hoang-phap');
          if (url) {
            insertImageToEditor(url);
          }
        }
      }
    }
  };

  const handleEditorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 🪷 Xử lý dán văn bản từ ngoài (Word, Docs, Notepad): Tự động chuyển đổi định dạng chuẩn
  const handleEditorPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    let pastedText = clipboardData.getData('text/plain') || '';
    if (!pastedText.trim()) return;

    const convertedHtml = markdownToWysiwygHtml(pastedText);
    document.execCommand('insertHTML', false, convertedHtml);
    setIsDirty(true);
    updateEditorSelectionAndFormat();
    showToast('✨ Đã tự động chuẩn hóa định dạng văn bản sao chép!');
  };

  // Xử lý phím Enter: Dòng mới luôn tự động là normal text (Paragraph)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !wysiwygEditorRef.current) return;

      let node = sel.anchorNode as HTMLElement | null;
      let headingOrQuote = false;
      let blockElement: HTMLElement | null = null;

      while (node && node !== wysiwygEditorRef.current) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'h3' || tag === 'h4' || tag === 'blockquote') {
          headingOrQuote = true;
          blockElement = node;
          break;
        }
        node = node.parentElement;
      }

      if (headingOrQuote && blockElement) {
        e.preventDefault();
        const p = document.createElement('p');
        p.className = 'mb-5';
        p.innerHTML = '<br>';

        if (blockElement.nextSibling) {
          blockElement.parentNode?.insertBefore(p, blockElement.nextSibling);
        } else {
          blockElement.parentNode?.appendChild(p);
        }

        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        updateEditorSelectionAndFormat();
      }
    }
  };

  // Insert image HTML into WYSIWYG editor
  const insertImageToEditor = (url: string, caption: string = '') => {
    if (wysiwygEditorRef.current) {
      wysiwygEditorRef.current.focus();
      const cleanCap = caption || 'Chú thích hình ảnh...';
      const imgHtml = `<div class="my-6 text-center select-none visual-img-block relative group/img inline-block w-full max-w-2xl mx-auto" data-img-url="${url}">
        <div class="relative inline-block max-w-full group">
          <img src="${url}" class="max-h-80 mx-auto rounded-2xl border-2 border-[#F2C14E]/60 shadow-xl object-contain hover:border-[#F2C14E] cursor-pointer" />
        </div>
        <div class="mt-2 text-center">
          <p class="img-caption-text text-xs italic text-[#FFE5A3] font-medium focus:outline-none hover:bg-[#3A2718]/60 px-3 py-1 rounded-lg border border-transparent focus:border-[#F2C14E]/60 cursor-text inline-block min-w-[140px]" contenteditable="true">(${cleanCap})</p>
        </div>
      </div><p class="mb-5"><br></p>`;
      document.execCommand('insertHTML', false, imgHtml);
      showToast('✅ Đã chèn ảnh vào bài viết thành công!');
    }
  };

  // Lấy nội dung hiện tại từ Editor DOM
  const getCurrentEditorMarkdown = () => {
    if (wysiwygEditorRef.current) {
      return wysiwygHtmlToMarkdown(wysiwygEditorRef.current.innerHTML);
    }
    return bigEditor?.value || '';
  };

  // 💾 Core function lưu toàn bộ dữ liệu vào Backend
  const savePostsToBackend = async (postsToSave: PostRecord[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postsToSave),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(postsToSave);
        setIsDirty(false);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        if (!silent) showToast(`✅ Đã lưu thành công ${postsToSave.length} bài viết!`);
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi lưu bài viết');
      }
    } catch (err: any) {
      showToast(`Không thể kết nối đến máy chủ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Global Ctrl+S Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (bigEditor && wysiwygEditorRef.current) {
          const md = getCurrentEditorMarkdown();
          const updated = [...posts];
          const extracted = cleanAndExtractContent(md, updated[bigEditor.rowIndex]);
          updated[bigEditor.rowIndex].content = extracted.cleanedContent;
          if (extracted.author) updated[bigEditor.rowIndex].author = extracted.author;
          setPosts(updated);
          savePostsToBackend(updated, false);
        } else {
          savePostsToBackend(posts, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts, bigEditor]);

  // Open Big Editor for a row
  const openBigEditor = (index: number) => {
    const post = posts[index];
    if (!post) return;
    setBigEditor({
      rowIndex: index,
      value: post.content || post.summary || '',
    });
    setEditorPreviewMode(false);

    setTimeout(() => {
      if (wysiwygEditorRef.current) {
        wysiwygEditorRef.current.innerHTML = markdownToWysiwygHtml(post.content || post.summary || '');
        updateEditorSelectionAndFormat();
      }
    }, 50);
  };

  // Thêm bài viết mới
  const handleAddNewPost = () => {
    const newPost: PostRecord = {
      id: `post-${Date.now()}`,
      slug: `bai-viet-moi-${Date.now().toString().slice(-4)}`,
      title: 'Bài viết mới chưa đặt tên',
      subtitle: 'Tùng Lâm Hòa Phúc',
      mainCategory: mainTab !== 'all' ? (mainTab as any) : 'dong-chay-hoang-phap',
      subCategory: subTab !== 'all' ? subTab : 'cong-tu',
      categoryName: 'Cộng Tu',
      author: 'Ban Văn Hóa Tùng Lâm',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      viewsCount: 0,
      thumbnailUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: 'center 50%',
      bannerUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      bannerPosition: 'center 50%',
      summary: 'Tóm tắt nội dung bài viết...',
      content: 'Nội dung bài viết bắt đầu tại đây...',
      keywords: [],
      photoGallery: [],
      previousEditions: [],
      upcomingEvents: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    setIsDirty(true);
    showToast('✨ Đã thêm dòng bài viết mới vào đầu bảng tính!');
    openBigEditor(0);
  };

  // Xóa bài viết
  const handleDeletePost = (index: number) => {
    const target = posts[index];
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${target.title}"?`)) return;

    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    setIsDirty(true);
    savePostsToBackend(updated, false);
    showToast(`🗑️ Đã xóa bài viết "${target.title}"`);
  };

  // Filtered Posts for Spreadsheet Display
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (mainTab !== 'all') {
        if (p.mainCategory !== mainTab && p.subCategory !== mainTab) return false;
      }
      if (subTab !== 'all') {
        if (p.subCategory !== subTab && p.mainCategory !== subTab) return false;
      }
      if (statusFilter !== 'all') {
        if (p.status !== statusFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = p.title?.toLowerCase().includes(q);
        const mSummary = p.summary?.toLowerCase().includes(q);
        const mAuthor = p.author?.toLowerCase().includes(q);
        const mContent = p.content?.toLowerCase().includes(q);
        if (!mTitle && !mSummary && !mAuthor && !mContent) return false;
      }
      return true;
    });
  }, [posts, mainTab, subTab, statusFilter, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#140D07] text-[#FFE5A3] p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#F2C14E] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-2xl bg-[#2A1D14] border-2 border-[#F2C14E] text-[#ffde59] text-xs sm:text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      {/* 🌟 1. BANNER TIÊU ĐỀ & THỐNG KÊ (ZEN MINIMALIST) */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-3xl p-6 sm:p-8 mb-6 shadow-[0_0_40px_rgba(242,193,78,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C14E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2D1B10] border border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E] shadow-inner">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h1
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal drop-shadow-md"
              >
                QUẢN LÝ BÀI VIẾT & SỰ KIỆN TOÀN NĂNG
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#c9b896] max-w-2xl">
              Hệ thống Bảng Tính Sheet đồng bộ 100% đa phương tiện, video pháp thoại, album ảnh tư liệu, trích nguồn sách, chú thích từ khóa và sự kiện sắp tới.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddNewPost}
              className="px-4 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#140D07] text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(242,193,78,0.4)] transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Thêm Bài Viết Mới</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => savePostsToBackend(posts, false)}
              className="px-4 py-2.5 rounded-xl bg-[#2D1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#140D07] border border-[#F2C14E]/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
              title="Lưu toàn bộ thay đổi (Ctrl+S)"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi (Ctrl+S)'}</span>
            </button>

            <button
              type="button"
              onClick={fetchPosts}
              className="w-10 h-10 rounded-xl bg-[#2D1B10] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer"
              title="Tải lại dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F2C14E]/20 text-xs">
          <div className="p-3 rounded-2xl bg-[#25170E]/80 border border-[#F2C14E]/20 flex items-center justify-between">
            <span className="text-[#c9b896]">Tổng bài viết:</span>
            <span className="font-bold text-[#ffde59] text-base">{posts.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#25170E]/80 border border-[#F2C14E]/20 flex items-center justify-between">
            <span className="text-[#c9b896]">Hoằng Pháp:</span>
            <span className="font-bold text-[#ffde59] text-base">
              {posts.filter((p) => p.mainCategory === 'dong-chay-hoang-phap').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#25170E]/80 border border-[#F2C14E]/20 flex items-center justify-between">
            <span className="text-[#c9b896]">Trí Tuệ Phật Pháp:</span>
            <span className="font-bold text-[#ffde59] text-base">
              {posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap').length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#25170E]/80 border border-[#F2C14E]/20 flex items-center justify-between">
            <span className="text-[#c9b896]">Đã xuất bản:</span>
            <span className="font-bold text-emerald-400 text-base">
              {posts.filter((p) => p.status === 'published').length}
            </span>
          </div>
        </div>
      </div>

      {/* 🌟 2. BỘ LỌC PHÂN HỆ VÀ TÌM KIẾM ĐA CẤP */}
      <div className="space-y-4 mb-6">
        {/* Phân hệ chính (Dòng Chảy Hoằng Pháp / Trí Tuệ Phật Pháp / Giới Thiệu) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#1C120A] rounded-2xl border border-[#F2C14E]/30 overflow-x-auto custom-scrollbar">
          {MAIN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = mainTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setMainTab(cat.id);
                  setSubTab('all');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#F2C14E] text-[#140D07] shadow-md'
                    : 'text-[#c9b896] hover:text-white hover:bg-[#25170E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Danh mục con (4 Mục Lớn Hoằng Pháp hoặc Trí Tuệ Phật Pháp) */}
        {(mainTab === 'dong-chay-hoang-phap' || mainTab === 'all') && (
          <div className="flex items-center gap-2 p-1.5 bg-[#25170E]/60 rounded-xl border border-[#F2C14E]/20 overflow-x-auto custom-scrollbar text-xs">
            <span className="text-[11px] font-bold text-[#F2C14E] uppercase px-2 shrink-0 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5" />
              <span>Hoằng Pháp:</span>
            </span>
            {SUB_CATEGORIES_HOANG_PHAP.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  if (mainTab === 'all') setMainTab('dong-chay-hoang-phap');
                  setSubTab(sub.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  subTab === sub.id && mainTab === 'dong-chay-hoang-phap'
                    ? 'bg-[#F2C14E] text-[#140D07] shadow-sm'
                    : 'text-[#FFE5A3]/80 hover:text-white hover:bg-[#352012]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {mainTab === 'tri-tue-phat-phap' && (
          <div className="flex items-center gap-2 p-1.5 bg-[#25170E]/60 rounded-xl border border-[#F2C14E]/20 overflow-x-auto custom-scrollbar text-xs">
            <span className="text-[11px] font-bold text-[#F2C14E] uppercase px-2 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trí Tuệ:</span>
            </span>
            {SUB_CATEGORIES_TRI_TUE.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubTab(sub.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  subTab === sub.id
                    ? 'bg-[#F2C14E] text-[#140D07] shadow-sm'
                    : 'text-[#FFE5A3]/80 hover:text-white hover:bg-[#352012]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Thanh tìm kiếm & Trạng thái */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#c9b896] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, tác giả, nội dung..."
              className="w-full pl-9 pr-4 py-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-white placeholder-[#c9b896]/60 focus:outline-none focus:border-[#F2C14E]"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-[#c9b896]">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#ffde59] font-bold focus:outline-none focus:border-[#F2C14E]"
            >
              <option value="all">Tất cả ({posts.length})</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🌟 3. BẢNG TÍNH SHEET TOÀN NĂNG (SPREADSHEET POSTS TABLE) */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#24160C] text-[#ffde59] border-b border-[#F2C14E]/30 font-bold uppercase tracking-wider select-none">
                <th className="p-3 text-center w-12 border-r border-[#F2C14E]/20">STT</th>
                <th className="p-3 text-center w-24 border-r border-[#F2C14E]/20">Trạng thái</th>
                <th className="p-3 text-center w-20 border-r border-[#F2C14E]/20">Ảnh bìa</th>
                <th className="p-3 min-w-[280px] border-r border-[#F2C14E]/20">Tiêu đề & Đường dẫn (Slug)</th>
                <th className="p-3 min-w-[160px] border-r border-[#F2C14E]/20">Phân loại & Danh mục</th>
                <th className="p-3 min-w-[140px] border-r border-[#F2C14E]/20">Tác giả</th>
                <th className="p-3 min-w-[110px] border-r border-[#F2C14E]/20">Ngày đăng</th>
                <th className="p-3 min-w-[140px] text-center border-r border-[#F2C14E]/20">Đa phương tiện</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/15">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#FFE5A3]">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F2C14E]" />
                    <span>Đang tải dữ liệu bài viết...</span>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#c9b896]">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((row, index) => {
                  const origIndex = posts.findIndex((p) => p.id === row.id);
                  const isHoangPhap = row.mainCategory === 'dong-chay-hoang-phap';
                  const publicUrl = isHoangPhap
                    ? `/dong-chay-hoang-phap/${row.slug}`
                    : row.mainCategory === 'tri-tue-phat-phap'
                    ? `/tri-tue-phat-phap/${row.slug}`
                    : `/gioi-thieu`;

                  const kwCount = row.keywords?.length || 0;
                  const galleryCount = row.photoGallery?.length || 0;
                  const hasVideo = Boolean(row.videoBlock?.videoUrl);
                  const hasBook = Boolean(row.sourceBook);
                  const editionsCount = row.previousEditions?.length || 0;
                  const eventsCount = row.upcomingEvents?.length || 0;

                  return (
                    <tr
                      key={row.id || index}
                      className="hover:bg-[#25170E]/60 transition-colors group"
                    >
                      {/* 1. STT */}
                      <td className="p-3 text-center font-mono font-bold text-[#c9b896] border-r border-[#F2C14E]/15">
                        {index + 1}
                      </td>

                      {/* 2. Trạng thái */}
                      <td className="p-3 text-center border-r border-[#F2C14E]/15">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...posts];
                            updated[origIndex].status =
                              updated[origIndex].status === 'published' ? 'draft' : 'published';
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            row.status === 'published'
                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                          }`}
                        >
                          {row.status === 'published' ? 'Xuất bản' : 'Bản nháp'}
                        </button>
                      </td>

                      {/* 3. Ảnh bìa (Thumbnail) */}
                      <td className="p-2 text-center border-r border-[#F2C14E]/15">
                        <div
                          onClick={() =>
                            openS3Library((url) => {
                              const updated = [...posts];
                              updated[origIndex].thumbnailUrl = url;
                              if (!updated[origIndex].bannerUrl) updated[origIndex].bannerUrl = url;
                              setPosts(updated);
                              setIsDirty(true);
                            })
                          }
                          className="w-14 h-14 rounded-xl overflow-hidden border border-[#F2C14E]/40 mx-auto relative group/thumb cursor-pointer bg-black/60 shadow-md"
                          title="Bấm để đổi ảnh thumbnail từ S3"
                        >
                          <img
                            src={row.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                            alt="Ảnh"
                            style={{ objectPosition: row.thumbnailPosition || 'center 50%' }}
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-[#ffde59]">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </td>

                      {/* 4. Tiêu đề & Slug */}
                      <td className="p-3 border-r border-[#F2C14E]/15">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={row.title || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[origIndex].title = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full font-bold text-white bg-transparent hover:bg-[#2D1B10]/60 focus:bg-[#2D1B10] px-2 py-1 rounded-lg border border-transparent focus:border-[#F2C14E]/60 focus:outline-none text-xs sm:text-sm"
                          />
                          <div className="flex items-center gap-1.5 px-2">
                            <span className="text-[10px] text-[#c9b896]/60 font-mono">/</span>
                            <input
                              type="text"
                              value={row.slug || ''}
                              onChange={(e) => {
                                const updated = [...posts];
                                updated[origIndex].slug = e.target.value;
                                setPosts(updated);
                                setIsDirty(true);
                              }}
                              placeholder="slug-duong-dan"
                              className="w-full text-[11px] text-[#FFE5A3]/70 font-mono bg-transparent hover:bg-[#2D1B10]/40 focus:bg-[#2D1B10] px-1 py-0.5 rounded border border-transparent focus:border-[#F2C14E]/40 focus:outline-none"
                            />
                          </div>
                        </div>
                      </td>

                      {/* 5. Phân loại & Danh mục */}
                      <td className="p-3 border-r border-[#F2C14E]/15">
                        <div className="space-y-1.5">
                          <select
                            value={row.mainCategory || 'dong-chay-hoang-phap'}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[origIndex].mainCategory = e.target.value as any;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            className="w-full px-2 py-1 rounded-lg bg-[#25170E] border border-[#F2C14E]/30 text-[#ffde59] text-[11px] font-bold focus:outline-none focus:border-[#F2C14E]"
                          >
                            <option value="dong-chay-hoang-phap">Dòng Chảy Hoằng Pháp</option>
                            <option value="tri-tue-phat-phap">Trí Tuệ Phật Pháp</option>
                            <option value="gioi-thieu">Giới Thiệu Tông Phong</option>
                          </select>

                          <input
                            type="text"
                            value={row.subCategory || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[origIndex].subCategory = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="cong-tu, dai-le..."
                            className="w-full px-2 py-1 rounded-lg bg-[#25170E]/60 border border-[#F2C14E]/20 text-[#FFE5A3] text-[10px] font-mono focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>
                      </td>

                      {/* 6. Tác giả */}
                      <td className="p-3 border-r border-[#F2C14E]/15">
                        <input
                          type="text"
                          value={row.author || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[origIndex].author = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tác giả / Biên soạn..."
                          className="w-full px-2 py-1 rounded-lg bg-transparent hover:bg-[#25170E] focus:bg-[#25170E] border border-transparent focus:border-[#F2C14E]/40 text-white text-xs focus:outline-none"
                        />
                      </td>

                      {/* 7. Ngày đăng */}
                      <td className="p-3 border-r border-[#F2C14E]/15">
                        <input
                          type="date"
                          value={row.publishedDate || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[origIndex].publishedDate = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full px-2 py-1 rounded-lg bg-transparent hover:bg-[#25170E] focus:bg-[#25170E] border border-transparent focus:border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-mono focus:outline-none"
                        />
                      </td>

                      {/* 8. Đa phương tiện Badges */}
                      <td className="p-3 text-center border-r border-[#F2C14E]/15">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {kwCount > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title={`${kwCount} chú thích từ khóa`}
                            >
                              <Sparkles className="w-3 h-3 text-[#F2C14E]" />
                              <span>{kwCount}</span>
                            </span>
                          )}
                          {galleryCount > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title={`${galleryCount} ảnh trong album`}
                            >
                              <Images className="w-3 h-3 text-[#F2C14E]" />
                              <span>{galleryCount}</span>
                            </span>
                          )}
                          {hasVideo && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title="Có video pháp thoại minh họa"
                            >
                              <Video className="w-3 h-3 text-[#F2C14E]" />
                            </span>
                          )}
                          {hasBook && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title="Có trích dẫn nguồn sách"
                            >
                              <BookOpen className="w-3 h-3 text-[#F2C14E]" />
                            </span>
                          )}
                          {editionsCount > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title={`${editionsCount} kỳ khóa tu trước`}
                            >
                              <Clock className="w-3 h-3 text-[#F2C14E]" />
                              <span>{editionsCount}</span>
                            </span>
                          )}
                          {eventsCount > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-md bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] text-[10px] font-bold flex items-center gap-1"
                              title={`${eventsCount} chương trình sắp tới`}
                            >
                              <Calendar className="w-3 h-3 text-[#F2C14E]" />
                              <span>{eventsCount}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 9. Thao tác */}
                      <td className="p-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Soạn thảo văn bản */}
                          <button
                            type="button"
                            onClick={() => openBigEditor(origIndex)}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Mở trình soạn thảo văn bản Google Docs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Quản lý Đa phương tiện */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: origIndex, tab: 'banner' })}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Quản lý Đa Phương Tiện (Banner, Video, Album ảnh, Sự kiện sắp tới)"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xem trước */}
                          <button
                            type="button"
                            onClick={() => setPreviewModal(row)}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xem trước giao diện thực tế"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => handleDeletePost(origIndex)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xóa bài viết này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 4. TRÌNH SOẠN THẢO WYSIWYG TOÀN MÀN HÌNH (BIG EDITOR MODAL) */}
      {/* ============================================================ */}
      {bigEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div
            className={`bg-[#1C120A] border-2 border-[#F2C14E] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] transition-all duration-200 ${
              isEditorMaximized
                ? 'fixed inset-0 rounded-none w-screen h-screen max-w-none max-h-none p-4 sm:p-6'
                : 'rounded-3xl p-5 sm:p-7 w-full max-w-5xl max-h-[94vh]'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shrink-0 shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="px-2.5 py-0.5 rounded-lg bg-[#3A2718] text-[#ffde59] text-xs font-bold border border-[#F2C14E]/40 shrink-0"
                  >
                    Bài #{bigEditor.rowIndex + 1}
                  </span>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal truncate max-w-lg"
                  >
                    {posts[bigEditor.rowIndex]?.title || 'Chưa đặt tiêu đề'}
                  </h3>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                  className="p-2 rounded-xl hover:bg-[#25170E] text-[#FFE5A3] border border-transparent hover:border-[#F2C14E]/30 transition-all cursor-pointer"
                  title={isEditorMaximized ? 'Thu nhỏ' : 'Toàn màn hình'}
                >
                  {isEditorMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const md = getCurrentEditorMarkdown();
                    const updated = [...posts];
                    const extracted = cleanAndExtractContent(md, updated[bigEditor.rowIndex]);
                    updated[bigEditor.rowIndex].content = extracted.cleanedContent;
                    setPosts(updated);
                    setBigEditor(null);
                    setFloatingMenu(null);
                  }}
                  className="p-2 rounded-xl hover:bg-red-900/60 text-[#c9b896] hover:text-white transition-all cursor-pointer"
                  title="Đóng cửa sổ soạn thảo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 py-3 flex flex-col min-h-0 space-y-3 relative">
              {editorPreviewMode ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1C120A] rounded-2xl p-6 border border-[#F2C14E]/30 shadow-inner">
                  <HeroBanner
                    bannerUrl={posts[bigEditor.rowIndex].bannerUrl || posts[bigEditor.rowIndex].thumbnailUrl}
                    bannerPosition={posts[bigEditor.rowIndex].bannerPosition || 'center 50%'}
                    title={posts[bigEditor.rowIndex].title}
                    subtitle={posts[bigEditor.rowIndex].subtitle}
                  />
                  <div className="max-w-4xl mx-auto py-8">
                    <InfographicArticleRenderer
                      rawContent={posts[bigEditor.rowIndex].content || ''}
                      title={posts[bigEditor.rowIndex].title}
                      subtitle={posts[bigEditor.rowIndex].subtitle}
                      author={posts[bigEditor.rowIndex].author}
                      popups={posts[bigEditor.rowIndex].keywords}
                      onKeywordClick={(kw) => {
                        const found = posts[bigEditor.rowIndex].keywords?.find((k) => k.keyword.toLowerCase() === kw.toLowerCase());
                        if (found) setActivePreviewKeyword(found);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <ZenTipTapEditor
                  content={posts[bigEditor.rowIndex].content || ''}
                  onChange={(newMd) => {
                    const updated = [...posts];
                    updated[bigEditor.rowIndex].content = newMd;
                    setPosts(updated);
                    setIsDirty(true);
                  }}
                  folderPath="dong-chay-hoang-phap"
                  onOpenS3Explorer={() => setImageLibraryOpen(true)}
                  onAddAnnotationKeyword={(kw) => {
                    setAnnoKw({
                      keyword: kw,
                      title: kw,
                      subtitle: '',
                      description: '',
                      imageUrl: '',
                      imagePosition: 'center 50%',
                      linkUrl: '',
                    });
                    setAnnotationModal({ isOpen: true, tab: 'keyword', selectedText: kw });
                  }}
                  previewMode={editorPreviewMode}
                  onTogglePreview={() => setEditorPreviewMode(!editorPreviewMode)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 5. MODAL QUẢN LÝ ĐA PHƯƠNG TIỆN (BANNER, VIDEO, ALBUM, KỲ TRƯỚC, SẮP TỚI) */}
      {/* ============================================================ */}
      {mediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                  >
                    QUẢN LÝ ĐA PHƯƠNG TIỆN & SỰ KIỆN
                  </h3>
                  <p className="text-xs text-[#c9b896] truncate max-w-lg">
                    {posts[mediaModal.rowIndex]?.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="p-2 rounded-full hover:bg-[#25170E] text-[#c9b896] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Tabs (6 Tabs Đa Phương Tiện Toàn Năng) */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4 overflow-x-auto custom-scrollbar shrink-0">
              {[
                { id: 'banner', label: '1. Banner Hero', icon: ImageIcon },
                { id: 'video', label: '2. Video Pháp Thoại', icon: Video },
                { id: 'featured', label: '3. Bài Viết Nổi Bật', icon: Flame },
                { id: 'gallery', label: '4. Album Ảnh Tư Liệu', icon: Images },
                { id: 'editions', label: '5. Các Kỳ Khóa Tu Trước', icon: Clock },
                { id: 'events', label: '6. Chương Trình Sắp Tới', icon: Calendar },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = mediaModal.tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMediaModal({ ...mediaModal, tab: t.id as any })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                        : 'text-[#c9b896] hover:text-white hover:bg-[#352012]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-2 pr-1">
              {/* TAB 1: BANNER */}
              {mediaModal.tab === 'banner' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Ảnh Banner Hero & Tiêu Điểm</span>
                    </span>
                    <span className="text-[11px] text-[#F2C14E] font-mono">
                      {posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                    </span>
                  </div>

                  {posts[mediaModal.rowIndex].bannerUrl ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const f = e.dataTransfer.files?.[0];
                        if (f && f.type.startsWith('image/')) {
                          showToast('⏳ Đang tải ảnh Banner lên S3...');
                          const url = await uploadImageFileDirectly(f);
                          if (url) {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerUrl = url;
                            setPosts(updated);
                          }
                        }
                      }}
                      className="space-y-3"
                    >
                      <InteractiveImageDrag
                        imageUrl={posts[mediaModal.rowIndex].bannerUrl}
                        position={posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                        onPositionChange={(pos) => {
                          const updated = [...posts];
                          updated[mediaModal.rowIndex].bannerPosition = pos;
                          setPosts(updated);
                        }}
                        className="w-full h-60"
                      >
                        <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openS3Library((url) => {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].bannerUrl = url;
                                setPosts(updated);
                              });
                            }}
                            className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black flex items-center justify-center shadow-md cursor-pointer hover:scale-105"
                            title="Đổi ảnh từ S3"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </InteractiveImageDrag>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...posts];
                          updated[mediaModal.rowIndex].bannerUrl = url;
                          setPosts(updated);
                        })
                      }
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const f = e.dataTransfer.files?.[0];
                        if (f && f.type.startsWith('image/')) {
                          showToast('⏳ Đang tải ảnh Banner lên S3...');
                          const url = await uploadImageFileDirectly(f);
                          if (url) {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerUrl = url;
                            setPosts(updated);
                          }
                        }
                      }}
                      className="border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all group"
                      title="Bấm để chọn ảnh từ S3 hoặc Thả file ảnh vào đây"
                    >
                      <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh Banner từ S3 hoặc Kéo thả ảnh vào đây</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VIDEO */}
              {mediaModal.tab === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Link Video (YouTube Embed hoặc S3)</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].videoBlock?.videoUrl || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.videoUrl = e.target.value;
                        setPosts(updated);
                      }}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tiêu Đề Video Pháp Thoại</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].videoBlock?.title || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.title = e.target.value;
                        setPosts(updated);
                      }}
                      placeholder="Pháp thoại: Ý Nghĩa Thọ Trì Bát Quan Trai Giới..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tóm Tắt Nội Dung Video</span>
                    </label>
                    <textarea
                      rows={3}
                      value={posts[mediaModal.rowIndex].videoBlock?.summary || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.summary = e.target.value;
                        setPosts(updated);
                      }}
                      placeholder="Tóm tắt lời khai thị của Thầy Viện Chủ trong thời khóa..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURED */}
              {mediaModal.tab === 'featured' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tiêu Đề Bài Viết Nổi Bật</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].featuredArticle?.title || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.title = e.target.value;
                        setPosts(updated);
                      }}
                      placeholder="Tiêu đề bài viết nổi bật..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Link Bài Viết Nổi Bật</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].featuredArticle?.linkUrl || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.linkUrl = e.target.value;
                        setPosts(updated);
                      }}
                      placeholder="/dong-chay-hoang-phap/... hoặc /tri-tue-phat-phap/..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY */}
              {mediaModal.tab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Bộ Sưu Tập Ảnh Tư Liệu ({posts[mediaModal.rowIndex].photoGallery?.length || 0})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...posts];
                          if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                          updated[mediaModal.rowIndex].photoGallery!.push({
                            title: 'Ảnh tư liệu mới',
                            imageUrl: url,
                            imagePosition: 'center 50%',
                            khuVuc: 'Tùng Lâm Hòa Phúc',
                            noiDung: 'Mô tả hình ảnh sự kiện...',
                          });
                          setPosts(updated);
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md hover:scale-105"
                      title="Thêm ảnh mới từ S3"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  {/* Drop zone to upload multiple images at once */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        for (let i = 0; i < files.length; i++) {
                          const f = files[i];
                          if (f.type.startsWith('image/')) {
                            showToast(`⏳ Đang tải ảnh ${i + 1}/${files.length} lên S3...`);
                            const url = await uploadImageFileDirectly(f);
                            if (url) {
                              const updated = [...posts];
                              if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                              updated[mediaModal.rowIndex].photoGallery!.push({
                                title: f.name.replace(/\.[^/.]+$/, ''),
                                imageUrl: url,
                                imagePosition: 'center 50%',
                                khuVuc: 'Tùng Lâm Hòa Phúc',
                                noiDung: 'Mô tả hình ảnh sự kiện...',
                              });
                              setPosts(updated);
                            }
                          }
                        }
                      }
                    }}
                    className="border-2 border-dashed border-[#F2C14E]/30 rounded-2xl p-4 text-center cursor-pointer hover:border-[#F2C14E] bg-[#25170E]/30 transition-all"
                  >
                    <p className="text-xs text-[#FFE5A3]/80">Kéo thả nhiều ảnh cùng lúc vào đây để tự động tải lên S3 & thêm vào album</p>
                  </div>

                  {/* Photos list */}
                  <div className="space-y-3">
                    {posts[mediaModal.rowIndex].photoGallery?.map((item, pIdx) => (
                      <div key={pIdx} className="p-3 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl flex flex-col sm:flex-row gap-3">
                        <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-black border border-[#F2C14E]/40 relative">
                          <img src={item.imageUrl} alt="Ảnh" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery!.splice(pIdx, 1);
                              setPosts(updated);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-red-900/80 text-white hover:bg-red-700"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2 text-xs">
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery![pIdx].title = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Tiêu đề ảnh..."
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white font-bold"
                          />
                          <input
                            type="text"
                            value={item.noiDung || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery![pIdx].noiDung = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Mô tả sự kiện chi tiết..."
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PREVIOUS EDITIONS (CÁC KỲ KHÓA TU TRƯỚC) */}
              {mediaModal.tab === 'editions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Liên Kết Khóa Tu / Sự Kiện Các Kỳ Trước</span>
                      </h4>
                      <p className="text-[11px] text-[#c9b896]/70">
                        Ví dụ: Pháp hội niệm Phật tháng 06/2026, tháng 05/2026 hoặc năm trước...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].previousEditions) {
                          updated[mediaModal.rowIndex].previousEditions = [];
                        }
                        updated[mediaModal.rowIndex].previousEditions!.push({
                          title: 'Pháp Hội Niệm Phật Kỳ Trước',
                          period: 'Tháng trước / Năm trước',
                          slug: '',
                          thumbnailUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
                        });
                        setPosts(updated);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F2C14E] text-[#140D07] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Thêm Kỳ Trước</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {posts[mediaModal.rowIndex].previousEditions?.map((ed, edIdx) => (
                      <div key={edIdx} className="p-3.5 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl flex flex-col sm:flex-row gap-3 items-center">
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={ed.title}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].previousEditions![edIdx].title = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Tiêu đề kỳ trước..."
                            className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={ed.period}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].previousEditions![edIdx].period = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Thời gian: Tháng 06/2026..."
                            className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs"
                          />
                          <input
                            type="text"
                            value={ed.slug}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].previousEditions![edIdx].slug = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="slug-bai-viet-ky-truoc"
                            className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].previousEditions!.splice(edIdx, 1);
                            setPosts(updated);
                          }}
                          className="p-2 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-200"
                          title="Gỡ kỳ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: UPCOMING EVENTS (CHƯƠNG TRÌNH SẮP TỚI) */}
              {mediaModal.tab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Chương Trình / Khóa Tu Sắp Tới</span>
                      </h4>
                      <p className="text-[11px] text-[#c9b896]/70">
                        Thông báo thời gian, địa điểm để Phật tử thuận tiện theo dõi và đăng ký tham gia.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].upcomingEvents) {
                          updated[mediaModal.rowIndex].upcomingEvents = [];
                        }
                        updated[mediaModal.rowIndex].upcomingEvents!.push({
                          title: 'Khóa Tu Kỳ Sắp Tới',
                          timeString: '07h30 - 17h00 Ngày Chủ Nhật',
                          location: 'Tổ Đường & Giảng Đường Tùng Lâm Hòa Phúc',
                          description: 'Kính mời quý thiện nam tín nữ Phật tử gần xa sắp xếp về chùa tu học.',
                          registrationLink: '/admin/registrations/khoa-tu',
                        });
                        setPosts(updated);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F2C14E] text-[#140D07] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Thêm Sự Kiện Sắp Tới</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {posts[mediaModal.rowIndex].upcomingEvents?.map((ev, evIdx) => (
                      <div key={evIdx} className="p-4 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].upcomingEvents![evIdx].title = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Tiêu đề chương trình..."
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].upcomingEvents!.splice(evIdx, 1);
                              setPosts(updated);
                            }}
                            className="p-1.5 ml-2 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-200 shrink-0"
                            title="Xóa sự kiện này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={ev.timeString}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].upcomingEvents![evIdx].timeString = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Thời gian: 07h30 Ngày 15/08 Âm Lịch..."
                            className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs"
                          />
                          <input
                            type="text"
                            value={ev.location}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].upcomingEvents![evIdx].location = e.target.value;
                              setPosts(updated);
                            }}
                            placeholder="Địa điểm: Giảng Đường Tùng Lâm..."
                            className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  await savePostsToBackend(posts, false);
                  setMediaModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] font-bold border border-[#F2C14E] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(242,193,78,0.4)] cursor-pointer hover:scale-105"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 6. MODAL CHÚ THÍCH TỪ KHÓA & TRÍCH NGUỒN SÁCH TÍCH HỢP     */}
      {/* ============================================================ */}
      {annotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-lg flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#F2C14E]" />
                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                >
                  {annotationModal.tab === 'keyword' ? 'CHÚ THÍCH TỪ KHÓA' : 'TRÍCH NGUỒN SÁCH'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAnnotationModal(null)}
                className="p-1.5 rounded-full hover:bg-[#25170E] text-[#c9b896] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Từ Khóa / Khái Niệm *</span>
                </label>
                <input
                  type="text"
                  value={annoKw.keyword}
                  onChange={(e) => setAnnoKw({ ...annoKw, keyword: e.target.value, title: e.target.value })}
                  placeholder="Ví dụ: Bồ Đề Tâm, Tịnh Độ..."
                  className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Diễn Giải / Ý Nghĩa *</span>
                </label>
                <textarea
                  rows={3}
                  value={annoKw.description}
                  onChange={(e) => setAnnoKw({ ...annoKw, description: e.target.value })}
                  placeholder="Giải thích chi tiết ý nghĩa từ khóa..."
                  className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Link Bài Viết / Trang Liên Quan</span>
                </label>
                <input
                  type="text"
                  value={annoKw.linkUrl || ''}
                  onChange={(e) => setAnnoKw({ ...annoKw, linkUrl: e.target.value })}
                  placeholder="/tong-chi-tu-hoc/... hoặc /gioi-thieu/..."
                  className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono text-[11px]"
                />
              </div>

              {/* Image upload box */}
              <div>
                <span className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5 mb-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Ảnh Minh Họa</span>
                </span>

                {annoKw.imageUrl ? (
                  <div className="p-2.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-2xl space-y-2">
                    <InteractiveImageDrag
                      imageUrl={annoKw.imageUrl}
                      position={annoKw.imagePosition || 'center 50%'}
                      onPositionChange={(pos) => setAnnoKw((prev) => ({ ...prev, imagePosition: pos }))}
                      className="w-full h-32"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#c9b896]/70 font-mono truncate max-w-[200px]">{annoKw.imageUrl}</span>
                      <button
                        type="button"
                        onClick={() => openS3Library((url) => setAnnoKw((prev) => ({ ...prev, imageUrl: url })))}
                        className="w-7 h-7 rounded-lg bg-[#2D1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black flex items-center justify-center"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => openS3Library((url) => setAnnoKw((prev) => ({ ...prev, imageUrl: url })))}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const f = e.dataTransfer.files?.[0];
                      if (f && f.type.startsWith('image/')) {
                        showToast('⏳ Đang tải ảnh lên S3...');
                        const url = await uploadImageFileDirectly(f);
                        if (url) setAnnoKw((prev) => ({ ...prev, imageUrl: url }));
                      }
                    }}
                    className="p-4 border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-xl bg-[#1C120A]/60 text-center cursor-pointer transition-all"
                  >
                    <ImageIcon className="w-6 h-6 text-[#F2C14E]/70 mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh từ S3 hoặc Thả ảnh vào đây</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setAnnotationModal(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  const curIdx = annotationModal.rowIndex ?? bigEditor?.rowIndex;
                  if (curIdx === undefined || !posts[curIdx]) return;
                  const updated = [...posts];

                  if (annoKw.keyword.trim()) {
                    const kws = [...(updated[curIdx].keywords || [])];
                    const existingIdx = kws.findIndex((k) => k.keyword.toLowerCase() === annoKw.keyword.toLowerCase());
                    if (existingIdx !== -1) {
                      kws[existingIdx] = { ...annoKw };
                    } else {
                      kws.push({ ...annoKw });
                    }
                    updated[curIdx].keywords = kws;

                    if (wysiwygEditorRef.current) {
                      const kwText = annoKw.keyword.trim();
                      const curHtml = wysiwygEditorRef.current.innerHTML;
                      const escaped = kwText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      const regex = new RegExp(`(?<!<b>|<strong>)(${escaped})(?!<\\/b>|<\\/strong>)`, 'gi');
                      if (regex.test(curHtml)) {
                        wysiwygEditorRef.current.innerHTML = curHtml.replace(regex, '<b>$1</b>');
                      }
                      const afterMd = getCurrentEditorMarkdown();
                      const afterExtracted = cleanAndExtractContent(afterMd, updated[curIdx]);
                      updated[curIdx].content = afterExtracted.cleanedContent;
                    }

                    showToast(`✨ Đã lưu chú thích: ${annoKw.keyword}!`);
                  }

                  setPosts(updated);
                  setIsDirty(true);
                  // Không tự động tắt popup để người dùng tiếp tục xem / thêm / chỉnh sửa mà không bị out
                  // setAnnotationModal(null);

                  await savePostsToBackend(updated, true);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] font-bold border border-[#F2C14E] cursor-pointer shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center hover:scale-105"
                title="Lưu chú thích (Không tắt popup)"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 7. MODAL XEM TRƯỚC BÀI VIẾT TRỰC QUAN 100% (LIVE PREVIEW) */}
      {/* ============================================================ */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] overflow-hidden">
            {/* Nav Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#F2C14E]/30 bg-[#25170E] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59]">
                  <Eye className="w-4 h-4" />
                </div>
                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal truncate max-w-lg"
                >
                  {previewModal.title || 'Xem trước bài viết'}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewModal.slug && (
                  <button
                    type="button"
                    onClick={() => {
                      const url = previewModal.mainCategory === 'dong-chay-hoang-phap'
                        ? `/dong-chay-hoang-phap/${previewModal.slug}`
                        : `/tri-tue-phat-phap/${previewModal.slug}`;
                      window.open(url, '_blank');
                    }}
                    className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                    title="Mở tab mới trang web thật"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="w-8 h-8 rounded-xl hover:bg-red-900/60 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1C120A]">
              <HeroBanner
                bannerUrl={previewModal.bannerUrl || previewModal.thumbnailUrl}
                bannerPosition={previewModal.bannerPosition || 'center 50%'}
                isEditable={true}
                onPositionChange={(newPos) => {
                  const updated = [...posts];
                  const idx = updated.findIndex((p) => p.id === previewModal.id);
                  if (idx !== -1) {
                    updated[idx].bannerPosition = newPos;
                    setPosts(updated);
                    setPreviewModal({ ...previewModal, bannerPosition: newPos });
                  }
                }}
                title={previewModal.title}
                subtitle={previewModal.subtitle}
              />

              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-14">
                {/* 1. Article content */}
                <section>
                  <InfographicArticleRenderer
                    rawContent={previewModal.content || previewModal.summary || ''}
                    title={previewModal.title}
                    subtitle={previewModal.subtitle}
                    author={previewModal.author}
                    popups={previewModal.keywords}
                    onKeywordClick={(kwStr) => {
                      const found = previewModal.keywords?.find((k) => k.keyword.toLowerCase() === kwStr.toLowerCase());
                      if (found) {
                        const postIdx = posts.findIndex((p) => p.id === previewModal.id);
                        setActivePreviewKeyword({
                          ...found,
                          _articleIndex: postIdx !== -1 ? postIdx : undefined,
                        });
                      }
                    }}
                  />
                </section>

                {/* 2. Video block */}
                {previewModal.videoBlock?.videoUrl && (
                  <IllustrationVideo heroBanner={previewModal.bannerUrl} videoBlock={previewModal.videoBlock} />
                )}

                {/* 3. Photo gallery */}
                {previewModal.photoGallery && previewModal.photoGallery.length > 0 && (
                  <PhotoGallery photoGallery={previewModal.photoGallery} onSelectPhoto={() => {}} />
                )}

                {/* 4. Book citation */}
                {previewModal.sourceBook && (
                  <BookCitationSection sourceBook={previewModal.sourceBook} />
                )}

                {/* 5. Khóa tu các kỳ trước (Previous Editions) */}
                {previewModal.previousEditions && previewModal.previousEditions.length > 0 && (
                  <div className="my-10 p-6 rounded-3xl bg-[#25170E]/80 border border-[#F2C14E]/30 space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#F2C14E]/20 pb-3">
                      <Clock className="w-5 h-5 text-[#F2C14E]" />
                      <h3
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                        className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                      >
                        KHÓA TU / BÀI VIẾT CÁC KỲ TRƯỚC
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {previewModal.previousEditions.map((ed, edIdx) => (
                        <div key={edIdx} className="p-4 rounded-2xl bg-[#1C120A] border border-[#F2C14E]/20 hover:border-[#F2C14E] transition-all group">
                          <span className="text-[11px] font-bold text-[#F2C14E] uppercase">{ed.period}</span>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#ffde59] transition-colors mt-1">
                            {ed.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Chương trình sắp tới (Upcoming Events) */}
                {previewModal.upcomingEvents && previewModal.upcomingEvents.length > 0 && (
                  <div className="my-10 p-6 rounded-3xl bg-[#2D1B10] border-2 border-[#F2C14E] space-y-4 shadow-[0_0_30px_rgba(242,193,78,0.2)]">
                    <div className="flex items-center gap-2 border-b border-[#F2C14E]/30 pb-3">
                      <Calendar className="w-5 h-5 text-[#F2C14E]" />
                      <h3
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                        className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                      >
                        CHƯƠNG TRÌNH / KHÓA TU SẮP TỚI
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewModal.upcomingEvents.map((ev, evIdx) => (
                        <div key={evIdx} className="p-4 rounded-2xl bg-[#1C120A] border border-[#F2C14E]/30 space-y-2">
                          <h4 className="text-base font-bold text-[#ffde59]">{ev.title}</h4>
                          <p className="text-xs text-[#FFE5A3] font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#F2C14E]" />
                            <span>{ev.timeString}</span>
                          </p>
                          <p className="text-xs text-[#c9b896] flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-[#F2C14E]" />
                            <span>{ev.location}</span>
                          </p>
                          {ev.description && <p className="text-xs text-[#f7e7ce]/90 pt-1">{ev.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Discover more */}
                <DiscoverMore
                  relatedArticles={posts
                    .filter((p) => p.id !== previewModal.id)
                    .slice(0, 3)
                    .map((p) => ({
                      category: p.categoryName || p.subCategory || 'Bài viết liên quan',
                      title: p.title,
                      url: p.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
                      link: p.mainCategory === 'dong-chay-hoang-phap' ? `/dong-chay-hoang-phap/${p.slug}` : `/tri-tue-phat-phap/${p.slug}`,
                    }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 8. POPUP XEM THỬ CHÚ THÍCH TỪ KHÓA                         */}
      {/* ============================================================ */}
      {activePreviewKeyword && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setActivePreviewKeyword(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#1C120A] border border-[#F2C14E] rounded-2xl shadow-[0_0_50px_rgba(242,193,78,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F2C14E]/30 bg-[#25170E]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                <span className="text-xs font-bold text-[#FFE5A3] uppercase tracking-wider">
                  Xem Thử Chú Thích Từ Khóa
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewKeyword(null)}
                className="w-7 h-7 rounded-lg hover:bg-red-900/60 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
              <div>
                <h4
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-base sm:text-lg font-bold text-[#FFDE59] uppercase leading-snug"
                >
                  {activePreviewKeyword.title || activePreviewKeyword.keyword}
                </h4>
                {activePreviewKeyword.subtitle &&
                  activePreviewKeyword.subtitle.trim().toLowerCase() !== (activePreviewKeyword.title || activePreviewKeyword.keyword).trim().toLowerCase() && (
                  <p className="text-xs font-semibold text-[#F2C14E]/80 uppercase mt-0.5 tracking-wide">
                    {activePreviewKeyword.subtitle}
                  </p>
                )}
              </div>

              {activePreviewKeyword.imageUrl && (
                <div className="space-y-1.5">
                  <InteractiveImageDrag
                    imageUrl={activePreviewKeyword.imageUrl}
                    position={activePreviewKeyword.imagePosition || 'center 50%'}
                    onPositionChange={(newPos) => {
                      setActivePreviewKeyword((prev) => (prev ? { ...prev, imagePosition: newPos } : null));
                      if (activePreviewKeyword._articleIndex !== undefined && activePreviewKeyword._articleIndex >= 0) {
                        const updated = [...posts];
                        const artIdx = activePreviewKeyword._articleIndex;
                        if (updated[artIdx]?.keywords) {
                          const kws = [...updated[artIdx].keywords];
                          const kwIdx = kws.findIndex(
                            (k) => k.keyword.toLowerCase() === activePreviewKeyword.keyword.toLowerCase()
                          );
                          if (kwIdx !== -1) {
                            kws[kwIdx].imagePosition = newPos;
                            updated[artIdx].keywords = kws;
                            setPosts(updated);
                          }
                        }
                      }
                    }}
                    className="w-full h-44 sm:h-52 rounded-xl border border-[#F2C14E]/40 overflow-hidden shadow-inner"
                  />
                </div>
              )}

              {activePreviewKeyword.description && (
                <div className="p-3.5 rounded-xl bg-[#25170E]/80 border border-[#F2C14E]/20">
                  <p className="text-xs sm:text-sm text-[#FFE5A3] leading-relaxed whitespace-pre-line">
                    {activePreviewKeyword.description}
                  </p>
                </div>
              )}

              {activePreviewKeyword.linkUrl &&
                activePreviewKeyword.linkUrl.trim() !== '' &&
                activePreviewKeyword.linkUrl.trim() !== '#' && (
                  <div className="pt-1 text-center">
                    <a
                      href={activePreviewKeyword.linkUrl}
                      target={activePreviewKeyword.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] text-black text-xs font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      <span>Xem thêm chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-[#F2C14E]/30 bg-[#25170E] shrink-0">
              <button
                type="button"
                onClick={() => {
                  const kwToEdit = { ...activePreviewKeyword };
                  setActivePreviewKeyword(null);
                  if (bigEditor) {
                    setEditorPreviewMode(false);
                  }
                  setAnnoKw({
                    keyword: kwToEdit.keyword,
                    title: kwToEdit.title || kwToEdit.keyword,
                    subtitle: kwToEdit.subtitle || '',
                    description: kwToEdit.description || '',
                    imageUrl: kwToEdit.imageUrl || '',
                    imagePosition: kwToEdit.imagePosition || 'center 50%',
                    linkUrl: kwToEdit.linkUrl || '',
                  });
                  const artIdx = kwToEdit._articleIndex ?? bigEditor?.rowIndex ?? 0;
                  const existingIdx = posts[artIdx]?.keywords?.findIndex(
                    (k) => k.keyword.toLowerCase() === kwToEdit.keyword.toLowerCase()
                  );
                  setAnnotationModal({
                    isOpen: true,
                    tab: 'keyword',
                    selectedText: kwToEdit.keyword,
                    editingIndex: existingIdx !== -1 ? existingIdx : undefined,
                    originalKey: kwToEdit.keyword,
                    rowIndex: artIdx,
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa chú thích này</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewKeyword(null)}
                className="px-4 py-1.5 rounded-xl bg-[#25170E] hover:bg-[#352012] text-[#c9b896] hover:text-white text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S3 File Explorer Modal */}
      <S3FileExplorerModal
        isOpen={imageLibraryOpen}
        onClose={() => {
          setImageLibraryOpen(false);
          setTargetImageCallback(null);
        }}
        onSelectImage={(url, caption) => {
          if (targetImageCallback) {
            targetImageCallback(url, caption);
          } else {
            insertImageToEditor(url, caption);
          }
        }}
        initialPath="dong-chay-hoang-phap"
      />
    </div>
  );
}
