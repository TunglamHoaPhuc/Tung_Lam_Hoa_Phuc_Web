'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Check,
  Table as TableIcon,
  Eye,
  X,
  Maximize2,
  Minimize2,
  Edit3,
  Loader2,
  Cloud,
  Image as ImageIcon,
  RefreshCw,
  BookOpen,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Quote as QuoteIcon,
  Minus,
  FileSpreadsheet,
  FolderOpen,
  Link as LinkIcon,
  FileText,
  User,
  Video,
  Film,
  Star,
  Images,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  AlignCenter,
  Zap,
  ArrowRight,
  Bold,
  Italic,
  Info,
  Layers,
  Crosshair,
} from 'lucide-react';
import ZenTipTapEditor from '@/components/admin/ZenTipTapEditor';
import { S3FileExplorerModal } from '@/components/admin/S3FileExplorerModal';
import { UnsavedChangesModal } from '@/components/admin/UnsavedChangesModal';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';

interface KeywordItem {
  keyword: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imagePosition?: string;
  description: string;
  linkUrl?: string;
}

interface SourceBook {
  bookTitle: string;
  author?: string;
  coverImage?: string;
  coverPosition?: string;
  description?: string;
  linkUrl?: string;
}

interface PhotoGalleryItem {
  title?: string;
  imageUrl: string;
  imagePosition?: string;
  khuVuc?: string;
  noiDung?: string;
}

interface ArticleRow {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categoryName?: string;
  bannerImage: string;
  bannerPosition?: string;
  excerpt?: string;
  content: string;
  author?: string;
  authorLink?: string;
  publishedAt?: string;
  sourceBook?: SourceBook | SourceBook[];
  videoBlock?: {
    title?: string;
    subtitle?: string;
    description?: string;
    videoUrl?: string;
  };
  featuredArticle?: {
    label?: string;
    title?: string;
    author?: string;
    bgImage?: string;
    bgPosition?: string;
    linkUrl?: string;
  };
  photoGallery?: PhotoGalleryItem[];
  keywords: KeywordItem[];
}

// 🌟 COMPONENT KÉO THẢ TRỰC TIẾP CĂN CHỈNH VỊ TRÍ ẢNH VỚI LƯỚI 3x3
function InteractiveImageDrag({
  imageUrl,
  position = 'center 50%',
  onPositionChange,
  className = 'w-full h-56',
  children,
}: {
  imageUrl: string;
  position?: string;
  onPositionChange: (pos: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragStartPercent, setDragStartPercent] = useState<number>(50);
  const [currentPos, setCurrentPos] = useState<string>(position);

  useEffect(() => {
    setCurrentPos(position || 'center 50%');
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    const parsed = parseInt((currentPos || '50%').replace(/[^0-9]/g, ''), 10) || 50;
    setDragStartPercent(parsed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY;
    const newPercent = Math.max(0, Math.min(100, Math.round(dragStartPercent + deltaY * 0.25)));
    const nextPos = `center ${newPercent}%`;
    setCurrentPos(nextPos);
    onPositionChange(nextPos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative group/drag rounded-2xl overflow-hidden border-2 border-[#F2C14E]/50 bg-[#120A05] cursor-grab active:cursor-grabbing select-none shadow-lg ${className}`}
    >
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-full object-cover transition-all duration-200 pointer-events-none"
        style={{ objectPosition: currentPos || 'center' }}
      />

      {/* 🌟 Lưới 3x3 thanh mảnh khi hover hoặc đang kéo */}
      <div
        className={`absolute inset-0 transition-opacity pointer-events-none ${
          isDragging ? 'opacity-100 bg-black/20' : 'opacity-0 group-hover/drag:opacity-100'
        }`}
      >
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-[#F2C14E]/30">
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div className="border-b border-[#F2C14E]/20" />
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div className="border-b border-[#F2C14E]/20" />
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div className="border-r border-b border-[#F2C14E]/20" />
          <div />
        </div>

        {/* Badge vị trí góc nhỏ gọn */}
        <div className="absolute top-2 left-2 z-40">
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="px-2.5 py-0.5 rounded-full bg-black/85 border border-[#F2C14E]/60 text-[#ffde59] text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1"
          >
            <MoveVertical className="w-3 h-3 text-[#ffde59] shrink-0" />
            <span>{isDragging ? currentPos : 'Kéo để căn'}</span>
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}

const CATEGORIES = [
  { id: 'tong-phong-truyen-thua', name: 'TÔNG PHONG TRUYỀN THỪA' },
  { id: 'nen-tang-tu-hoc', name: 'NỀN TẢNG TU HỌC' },
  { id: 'phuong-phap-hanh-tri', name: 'PHƯƠNG PHÁP HÀNH TRÌ' },
  { id: 'lo-trinh-tu-hoc', name: 'LỘ TRÌNH TU HỌC' },
  { id: 'nep-song-thien-gia', name: 'NẾP SỐNG THIỀN GIA' },
];

export const POPULAR_BOOKS: SourceBook[] = [
  {
    bookTitle: 'Đi Qua Khổ Vui Cuộc Đời',
    author: 'Vô Trí - Tâm Hòa',
    description: "Tác phẩm văn học Phật giáo 'Đi Qua Khổ Vui Cuộc Đời' (Quyển 1 & Quyển 2) do Sa Môn Vô Trí hiệu Tâm Hòa biên soạn, ghi lại những chặng đường tu học, hoằng pháp lợi sinh và những bài học nhân duyên sâu sắc.",
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-phong-truyen-thua/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.webp',
    linkUrl: '/tri-tue-phat-phap',
  },
  {
    bookTitle: 'Đóa Sen Khắc Vách Núi',
    author: 'Vô Trí - Tâm Hòa',
    description: 'Tác phẩm văn học Phật giáo khắc họa hành trình xây dựng Tùng Lâm Hòa Phúc và tiếp nối tông phong của Thầy Tổ.',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/bia-sach-doa-sen-khac-vach-nui.webp',
    linkUrl: '/tri-tue-phat-phap',
  },
  {
    bookTitle: 'Lược Sử Sư Tổ Ngộ Chân Tử',
    author: 'Tổ Đình Hoằng Pháp',
    description: 'Cuộc đời, hành trạng và công đức hoằng hóa lợi sinh của Đại Lão Hòa Thượng Ngộ Chân Tử - Tổ khai sáng Tông phong Hoằng Pháp.',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/bia-sach-luoc-su-su-to.webp',
    linkUrl: '/gioi-thieu/tieu-su-su-to',
  },
  {
    bookTitle: 'Tập Văn Hòa Phúc',
    author: 'Tùng Lâm Hòa Phúc',
    description: 'Tuyển tập các bài nghiên cứu, tham luận và cảm nhận tu học tại Tùng Lâm Hòa Phúc.',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/bia-sach-tap-van-hoa-phuc.webp',
    linkUrl: '/tri-tue-phat-phap',
  },
];

export function getMatchedBookData(inputTitle: string): SourceBook | null {
  if (!inputTitle || !inputTitle.trim()) return null;
  const clean = inputTitle.trim().toLowerCase();
  const exact = POPULAR_BOOKS.find((b) => b.bookTitle.toLowerCase() === clean);
  if (exact) return exact;
  const partial = POPULAR_BOOKS.find(
    (b) =>
      b.bookTitle.toLowerCase().includes(clean) ||
      clean.includes(b.bookTitle.toLowerCase())
  );
  return partial || null;
}

// 🪷 Converter Markdown -> WYSIWYG Google Docs HTML (Hỗ trợ sửa chú thích trực tiếp & xóa ảnh như Word)
function markdownToWysiwygHtml(raw: string): string {
  if (!raw) return '<p class="mb-5"><br></p>';
  let html = raw.replace(/&gt;/g, '>').replace(/&lt;/g, '<');

  // Images: ![caption](url) -> Khối ảnh tương tác như Word (Cho phép click sửa chú thích trực tiếp)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, caption, url) => {
    const cleanCap = caption || 'Chú thích hình ảnh...';
    return `\n\n<div class="my-6 text-center select-none visual-img-block relative group/img inline-block w-full max-w-2xl mx-auto" data-img-url="${url}">
      <div class="relative inline-block max-w-full group">
        <img src="${url}" class="max-h-80 mx-auto rounded-2xl border-2 border-[#F2C14E]/60 shadow-xl object-contain hover:border-[#F2C14E] cursor-pointer" />
      </div>
      <div class="mt-2 text-center">
        <p class="img-caption-text text-xs italic text-[#FFE5A3] font-medium focus:outline-none hover:bg-[#3A2718]/60 px-3 py-1 rounded-lg border border-transparent focus:border-[#F2C14E]/60 cursor-text inline-block min-w-[140px]" contenteditable="true" data-placeholder="Nhập chú thích ảnh...">(${cleanCap})</p>
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

  // Bold & Italic & Underline
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<i>$1</i>');

  // Split paragraphs - Giữ nguyên phân đoạn khổ thơ với class mb-5 và không làm mất dòng trống
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

// 🪷 Converter WYSIWYG Google Docs HTML -> Markdown/Clean Text
function wysiwygHtmlToMarkdown(html: string): string {
  if (!html || typeof window === 'undefined') return html || '';
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Visual Image Blocks (Trích xuất caption mà người dùng đã sửa trực tiếp trên màn hình)
  const imgBlocks = temp.querySelectorAll('.visual-img-block');
  imgBlocks.forEach((b) => {
    const url = b.getAttribute('data-img-url') || b.querySelector('img')?.getAttribute('src') || '';
    const capEl = b.querySelector('.img-caption-text') || b.querySelector('p');
    let caption = capEl?.textContent?.replace(/^\(|\)$/g, '').trim() || '';
    if (caption === 'Chú thích hình ảnh...' || caption === 'Nhập chú thích ảnh...') caption = '';
    const textNode = document.createTextNode(`\n\n![${caption}](${url})\n\n`);
    b.replaceWith(textNode);
  });

  // Raw Images
  const rawImgs = temp.querySelectorAll('img');
  rawImgs.forEach((img) => {
    const url = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const textNode = document.createTextNode(`\n\n![${alt}](${url})\n\n`);
    img.replaceWith(textNode);
  });

  // Headings
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

  // HR
  const hrs = temp.querySelectorAll('hr');
  hrs.forEach((hr) => {
    const textNode = document.createTextNode(`\n\n---\n\n`);
    hr.replaceWith(textNode);
  });

  // Convert all remaining <br> tags directly into newline characters
  const brs = temp.querySelectorAll('br');
  brs.forEach((br) => {
    br.replaceWith(document.createTextNode('\n'));
  });

  // Convert paragraphs and divs to preserve line breaks
  const paragraphs = temp.querySelectorAll('p, div');
  paragraphs.forEach((p) => {
    p.insertAdjacentText('beforebegin', '\n\n');
    p.insertAdjacentText('afterend', '\n\n');
  });

  let result = temp.innerHTML
    .replace(/(?:<strong[^>]*>|<b[^>]*>)+/gi, '<b>')
    .replace(/(?:<\/strong>|<\/b>)+/gi, '</b>')
    .replace(/(?:<em[^>]*>|<i[^>]*>)+/gi, '<i>')
    .replace(/(?:<\/em>|<\/i>)+/gi, '</i>')
    .replace(/<b[^>]*>\s*<\/b>/gi, '')
    .replace(/<i[^>]*>\s*<\/i>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/?(?:p|div)[^>]*>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<[^>]+>/g, '');

  // Đảm bảo tác giả trong markdown luôn có 2 dòng trống cách biệt
  result = result.replace(/(?:\r?\n)*(\*?(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)[^\n]*\*?)(?:\r?\n)*/gi, '\n\n$1\n\n');

  result = result.replace(/\n{3,}/g, '\n\n').trim();
  return result;
}

export function SpreadsheetTongChi() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewModal, setPreviewModal] = useState<ArticleRow | null>(null);

  // 🌟 Quản lý trạng thái chưa lưu & ngăn chặn thoát ngoài ý muốn
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState<boolean>(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState<(() => void) | null>(null);

  // Helper cập nhật articles kèm đánh dấu thay đổi chưa lưu
  const updateArticles = (newArticles: ArticleRow[]) => {
    setArticles(newArticles);
    setIsDirty(true);
  };

  // Big Editor Modal State
  const [bigEditor, setBigEditor] = useState<{
    rowIndex: number;
    field: keyof ArticleRow;
    fieldName: string;
    value: string;
  } | null>(null);
  const [editorPreviewMode, setEditorPreviewMode] = useState<boolean>(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState<boolean>(false);
  const wysiwygEditorRef = useRef<HTMLDivElement>(null);

  // 🌟 Active Formatting Indicators for Toolbar Buttons (H1, H2, Quote)
  const [activeFormat, setActiveFormat] = useState<{
    isH1: boolean;
    isH2: boolean;
    isQuote: boolean;
  }>({
    isH1: false,
    isH2: false,
    isQuote: false,
  });

  // Floating Context Menu (Bubble Menu khi bôi đen chuột trong Editor)
  const [floatingMenu, setFloatingMenu] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // 🌟 State xem thử popup chú thích trong Preview Mode kèm kéo cân chỉnh khung hình ảnh
  const [activePreviewKeyword, setActivePreviewKeyword] = useState<(KeywordItem & { _articleIndex?: number }) | null>(null);

  // S3 Image Library State
  const [imageLibraryOpen, setImageLibraryOpen] = useState<boolean>(false);
  const [s3Images, setS3Images] = useState<Array<{ url: string; key: string }>>([]);
  const [loadingS3Images, setLoadingS3Images] = useState<boolean>(false);
  const [s3Search, setS3Search] = useState<string>('');
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);

  // Insert Custom Image Modal State
  const [insertImageModal, setInsertImageModal] = useState<{
    isOpen: boolean;
    url: string;
    caption: string;
  } | null>(null);
  const [uploadingInlineImg, setUploadingInlineImg] = useState<boolean>(false);

  // Modal Nhập Dữ Liệu Từ Google Sheets / Excel (Link / File / Paste)
  const [sheetImportModal, setSheetImportModal] = useState<boolean>(false);
  const [sheetTab, setSheetTab] = useState<'link' | 'file' | 'paste'>('link');
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [sheetPasteText, setSheetPasteText] = useState<string>('');
  const [scanningSheet, setScanningSheet] = useState<boolean>(false);

  // Integrated Annotation Modal (Khi bôi đen hoặc bấm Ctrl+B)
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

  // Media Management Modal State (Banner, Video, Featured Article, Photo Gallery)
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    tab: 'banner' | 'video' | 'featured' | 'gallery';
  } | null>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 🌟 Tự động lấy thông tin từ YouTube
  const handleAutoFetchYouTube = async (url: string) => {
    if (!url || !mediaModal || mediaModal.rowIndex === undefined) return;
    setIsFetchingMeta(true);
    try {
      const res = await fetch(`/api/admin/fetch-metadata?url=${encodeURIComponent(url.trim())}`);
      const json = await res.json();
      if (json.success) {
        const updated = [...articles];
        if (!updated[mediaModal.rowIndex].videoBlock) updated[mediaModal.rowIndex].videoBlock = {};
        if (json.title) updated[mediaModal.rowIndex].videoBlock!.title = json.title;
        if (json.subtitle) updated[mediaModal.rowIndex].videoBlock!.subtitle = json.subtitle;
        if (json.description) updated[mediaModal.rowIndex].videoBlock!.description = json.description;
        if (json.videoUrl) updated[mediaModal.rowIndex].videoBlock!.videoUrl = json.videoUrl;
        setArticles(updated);
        showToast('Đã tự động nhận diện và điền thông tin Video YouTube!');
      } else {
        showToast(json.error || 'Không thể lấy thông tin video');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối khi tải thông tin video');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // 🌟 Tự động lấy thông tin bài viết từ website (Chùa Hoằng Pháp, etc.)
  const handleAutoFetchFeatured = async (url: string) => {
    if (!url || !mediaModal || mediaModal.rowIndex === undefined) return;
    setIsFetchingMeta(true);
    try {
      const res = await fetch(`/api/admin/fetch-metadata?url=${encodeURIComponent(url.trim())}`);
      const json = await res.json();
      if (json.success) {
        const updated = [...articles];
        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
        if (json.title) updated[mediaModal.rowIndex].featuredArticle!.title = json.title;
        if (json.author) updated[mediaModal.rowIndex].featuredArticle!.author = json.author;
        if (json.label) updated[mediaModal.rowIndex].featuredArticle!.label = json.label;
        if (json.bgImage) updated[mediaModal.rowIndex].featuredArticle!.bgImage = json.bgImage;
        if (json.linkUrl) updated[mediaModal.rowIndex].featuredArticle!.linkUrl = json.linkUrl;
        setArticles(updated);
        showToast('Đã tự động nhận diện và điền thông tin Bài viết!');
      } else {
        showToast(json.error || 'Không thể lấy thông tin bài viết');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối khi tải thông tin bài viết');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // Fetch initial data
  const loadData = () => {
    setLoading(true);
    fetch('/api/admin/tong-chi')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch S3 Image Library
  const fetchS3Images = async () => {
    setLoadingS3Images(true);
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (data.files) {
        setS3Images(data.files);
      }
    } catch (err) {
      console.error('Error fetching S3 images:', err);
    } finally {
      setLoadingS3Images(false);
    }
  };

  const openS3Library = (onSelect?: (url: string, caption?: string) => void) => {
    setTargetImageCallback(() => onSelect || null);
    setImageLibraryOpen(true);
    fetchS3Images();
  };

  // Khi mở BigEditor: Điền innerHTML 1 LẦN DUY NHẤT để không bị giật con trỏ chuột & giữ nguyên Ctrl+Z
  useEffect(() => {
    if (bigEditor && wysiwygEditorRef.current) {
      const initialHtml = markdownToWysiwygHtml(bigEditor.value);
      wysiwygEditorRef.current.innerHTML = initialHtml;
    }
  }, [bigEditor?.rowIndex]);

  // Kiểm tra selection để cập nhật Active Format (H1, H2, Quote) & Bubble Menu
  const updateEditorSelectionAndFormat = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (!sel || !wysiwygEditorRef.current) return;

    // 1. Quét tìm Block hiện tại để xác định H1, H2, Quote đang active
    let node = sel.anchorNode as HTMLElement | null;
    let foundH1 = false;
    let foundH2 = false;
    let foundQuote = false;

    while (node && node !== wysiwygEditorRef.current) {
      const tag = node.tagName?.toLowerCase();
      if (tag === 'h3') foundH1 = true;
      if (tag === 'h4') foundH2 = true;
      if (tag === 'blockquote') foundQuote = true;
      node = node.parentElement;
    }

    setActiveFormat({
      isH1: foundH1,
      isH2: foundH2,
      isQuote: foundQuote,
    });

    // 2. Kiểm tra hiển thị Floating Bubble Menu nếu có bôi đen chữ (Tự động canh lề không bị khuất mép màn hình)
    if (!sel.isCollapsed && sel.toString().trim()) {
      const text = sel.toString().trim();
      if (text.length > 0 && wysiwygEditorRef.current.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const menuHalfWidth = 145;
        const clampedX = Math.max(
          menuHalfWidth + 16,
          Math.min(window.innerWidth - menuHalfWidth - 16, rect.left + rect.width / 2)
        );
        setFloatingMenu({
          x: clampedX,
          y: Math.max(10, rect.top - 46),
          text,
        });
        return;
      }
    }
    setFloatingMenu(null);
  };

  // Auto clean and extract content helper
  const cleanAndExtractContent = (rawContent: string, currentArticle: ArticleRow) => {
    let lines = rawContent.split('\n');
    let cleanedLines: string[] = [];
    let extractedAuthor = currentArticle.author;
    let extractedBooks: SourceBook[] = Array.isArray(currentArticle.sourceBook)
      ? [...currentArticle.sourceBook]
      : currentArticle.sourceBook
        ? [currentArticle.sourceBook]
        : [];
    let extractedVideo = currentArticle.videoBlock?.videoUrl;
    let inRefSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^(tác giả\s*[:：]|sa môn|vô trí\s*[-–—]|thích tâm hòa)/i.test(trimmed) && trimmed.length < 90) {
        const authName = trimmed.replace(/^tác giả\s*[:：]\s*/i, '').trim();
        if (authName && !extractedAuthor) extractedAuthor = authName;
        cleanedLines.push(line);
        continue;
      }

      if (/^(bài thơ\s+)?(được\s+)?trích(\s+trong\s+tác\s+phẩm|\s+tác\s+phẩm|\s+nguồn)?\s*[:：]/i.test(trimmed)) {
        const bookInfo = trimmed.replace(/^(bài thơ\s+)?(được\s+)?trích(\s+trong\s+tác\s+phẩm|\s+tác\s+phẩm|\s+nguồn)?\s*[:：]\s*/i, '').trim();
        if (bookInfo) {
          const parts = bookInfo.split(' - ');
          extractedBooks.push({ bookTitle: parts[0]?.trim() || bookInfo, description: parts[1]?.trim() });
        }
        continue;
      }

      if (/^TÀI LIỆU THAM KHẢO/i.test(trimmed)) {
        inRefSection = true;
        continue;
      }

      if (inRefSection || trimmed.startsWith('📘')) {
        if (trimmed.startsWith('📘')) {
          const bookTitle = trimmed.replace(/^📘\s*/, '').trim();
          if (bookTitle) extractedBooks.push({ bookTitle });
        }
        continue;
      }

      if (/^(video|pháp thoại|youtube)[:\s-]*https?:\/\//i.test(trimmed) || /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i.test(trimmed)) {
        const urlMatch = trimmed.match(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i);
        if (urlMatch) extractedVideo = urlMatch[0];
        continue;
      }

      cleanedLines.push(line);
    }

    return {
      cleanedContent: cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
      author: extractedAuthor,
      extractedBooks: extractedBooks.length > 0 ? extractedBooks : undefined,
      videoUrl: extractedVideo,
    };
  };

  // Open Big Editor Modal
  const openBigEditor = (index: number, field: keyof ArticleRow, fieldName: string) => {
    const article = articles[index];
    const initialVal = (article?.[field] as string) || '';

    setBigEditor({
      rowIndex: index,
      field,
      fieldName,
      value: initialVal,
    });
    setEditorPreviewMode(false);

    // Điền nội dung vào WYSIWYG Editor
    setTimeout(() => {
      if (wysiwygEditorRef.current) {
        wysiwygEditorRef.current.innerHTML = markdownToWysiwygHtml(initialVal);
        updateEditorSelectionAndFormat();
      }
    }, 40);
  };

  // Execute rich text formatting commands for Google Docs mode (NATIVE BROWSER COMMANDS)
  const handleExecCommand = (cmd: string, val: string = '') => {
    if (wysiwygEditorRef.current) {
      wysiwygEditorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    updateEditorSelectionAndFormat();
  };

  // Toggle Heading H1 (h3) or H2 (h4) on/off chuẩn xác không nhảy trỏ chuột
  const toggleHeading = (level: 'h3' | 'h4') => {
    if (wysiwygEditorRef.current) {
      wysiwygEditorRef.current.focus();
    }
    const isCurrentlyActive = level === 'h3' ? activeFormat.isH1 : activeFormat.isH2;

    if (isCurrentlyActive) {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${level}>`);
    }
    updateEditorSelectionAndFormat();
  };

  // Toggle Quote Blockquote on/off với tự động chèn dấu “ và ” - Gộp toàn bộ vùng chọn thành 1 quote duy nhất
  const toggleQuote = () => {
    if (!wysiwygEditorRef.current) return;
    wysiwygEditorRef.current.focus();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    let parentNode: Node | null = range.commonAncestorContainer;
    if (parentNode.nodeType === Node.TEXT_NODE) {
      parentNode = parentNode.parentNode;
    }
    const existingBq = (parentNode as HTMLElement)?.closest?.('blockquote');

    if (existingBq || activeFormat.isQuote) {
      // 1. TẮT QUOTE: Chuyển blockquote thành các đoạn <p>
      const targetBq = existingBq || (wysiwygEditorRef.current ? (wysiwygEditorRef.current.querySelector('blockquote') as HTMLElement | null) : null);
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
      // 2. BẬT QUOTE: Bôi đen cả cụm nhiều dòng -> Gộp thành 1 KHỐI QUOTE DUY NHẤT
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
  };

  // Tự động tải ảnh trực tiếp lên đúng thư mục S3 khi kéo thả file
  const uploadImageFileDirectly = async (file: File, folderPath: string = 'tong-chi-tu-hoc'): Promise<string | null> => {
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
          const url = await uploadImageFileDirectly(file, 'tong-chi-tu-hoc');
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

    // Chuẩn hóa định dạng Markdown/Text sang HTML WYSIWYG chuẩn
    const convertedHtml = markdownToWysiwygHtml(pastedText);

    // Chèn nội dung chuẩn hóa vào vị trí con trỏ
    document.execCommand('insertHTML', false, convertedHtml);
    setIsDirty(true);
    updateEditorSelectionAndFormat();
    showToast('✨ Đã tự động chuẩn hóa định dạng văn bản sao chép!');
  };

  // Xử lý phím Enter & Shift+Enter:
  // - Khi ở H1/H2: Enter -> Thoát ra dòng mới Paragraph (normal text).
  // - Khi ở Quote: Shift+Enter -> Xuống dòng <br> vẫn giữ nguyên khối Quote.
  //                Enter -> Nếu dòng đang có chữ, tạo dòng mới <br> trong Quote; nếu dòng trống (Enter 2 lần) -> Thoát ra Paragraph.
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !wysiwygEditorRef.current) return;

      let node = sel.anchorNode as HTMLElement | null;
      let isInsideHeading = false;
      let isInsideQuote = false;
      let blockElement: HTMLElement | null = null;

      while (node && node !== wysiwygEditorRef.current) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'h3' || tag === 'h4') {
          isInsideHeading = true;
          blockElement = node;
          break;
        }
        if (tag === 'blockquote') {
          isInsideQuote = true;
          blockElement = node;
          break;
        }
        node = node.parentElement;
      }

      if (isInsideHeading && blockElement) {
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
        return;
      }

      if (isInsideQuote && blockElement) {
        if (e.shiftKey) {
          // Shift+Enter: browser default or manual line break inside blockquote
          e.preventDefault();
          document.execCommand('insertLineBreak');
          updateEditorSelectionAndFormat();
          return;
        }

        // Enter thường trong Quote
        const textContent = blockElement.textContent?.trim() || '';
        if (!textContent) {
          // Nếu blockquote hoàn toàn trống thì thoát ra ngoài
          e.preventDefault();
          const p = document.createElement('p');
          p.className = 'mb-5';
          p.innerHTML = '<br>';
          if (blockElement.nextSibling) {
            blockElement.parentNode?.insertBefore(p, blockElement.nextSibling);
          } else {
            blockElement.parentNode?.appendChild(p);
          }
          blockElement.remove();
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          updateEditorSelectionAndFormat();
          return;
        } else {
          // Giữ nguyên định dạng Quote và xuống dòng mới
          e.preventDefault();
          document.execCommand('insertLineBreak');
          updateEditorSelectionAndFormat();
          return;
        }
      }
    }
  };

  // Tự động nhận diện khi gõ và lưu draft tức thời vào LocalStorage
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    updateEditorSelectionAndFormat();
    setIsDirty(true);
    if (bigEditor && wysiwygEditorRef.current && typeof window !== 'undefined') {
      try {
        const rowId = articles[bigEditor.rowIndex]?.id || bigEditor.rowIndex;
        localStorage.setItem(`tong_chi_draft_${rowId}`, wysiwygEditorRef.current.innerHTML);
      } catch (err) {
        // ignore quota
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

  // 💾 Core function lưu toàn bộ dữ liệu vào Backend (1 Request duy nhất, cực nhanh)
  const saveArticlesToBackend = async (articlesToSave: ArticleRow[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/tong-chi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articlesToSave),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Lỗi khi lưu');

      const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(nowStr);
      setIsDirty(false); // 🌟 Đã lưu an toàn
      if (!silent) {
        showToast(`Đã lưu bảng tính thành công (${nowStr})!`);
      }
    } catch (err: any) {
      if (!silent) showToast(`Lỗi khi lưu: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 🛡️ Ngăn chặn thoát / tải lại trang ngoài ý muốn khi có thay đổi chưa lưu
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ⌨️ Bắt phím tắt Ctrl+S (Lưu), Ctrl+B (Toggle Bold tự nhiên) & Ctrl+I (Gán Tác Giả)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl+S: Lưu bài viết
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveArticlesToBackend(articles, false);
      }

      // 2. Ctrl+B trong Editor: Chuẩn toggle bold (in đậm / hủy in đậm) & TỰ ĐỘNG GỠ CHÚ THÍCH KHI HỦY BOLD
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && bigEditor) {
        e.preventDefault();
        const sel = window.getSelection();
        const selectedText = sel ? sel.toString().trim() : '';
        const wasBold = document.queryCommandState('bold');

        handleExecCommand('bold');

        if (selectedText) {
          const cleanText = selectedText.toLowerCase();
          const updated = [...articles];
          const cur = updated[bigEditor.rowIndex];

          if (cur) {
            let changed = false;
            const hasKw = (cur.keywords || []).some(
              (k) =>
                k.keyword.trim().toLowerCase() === cleanText ||
                cleanText.includes(k.keyword.trim().toLowerCase()) ||
                k.keyword.trim().toLowerCase().includes(cleanText)
            );

            // Nếu trước đó đang in đậm hoặc có trong danh mục chú thích thì tự động gỡ luôn
            if (wasBold || hasKw) {
              if (cur.keywords && cur.keywords.length > 0) {
                const prevLen = cur.keywords.length;
                cur.keywords = cur.keywords.filter(
                  (k) =>
                    k.keyword.trim().toLowerCase() !== cleanText &&
                    !cleanText.includes(k.keyword.trim().toLowerCase()) &&
                    !k.keyword.trim().toLowerCase().includes(cleanText)
                );
                if (cur.keywords.length !== prevLen) changed = true;
              }

              if (cur.sourceBook) {
                const books = Array.isArray(cur.sourceBook) ? cur.sourceBook : [cur.sourceBook];
                const prevLen = books.length;
                const newBooks = books.filter(
                  (b) =>
                    b.bookTitle.trim().toLowerCase() !== cleanText &&
                    !cleanText.includes(b.bookTitle.trim().toLowerCase())
                );
                if (newBooks.length !== prevLen) {
                  cur.sourceBook = newBooks.length > 0 ? newBooks : undefined;
                  changed = true;
                }
              }

              if (changed) {
                setArticles(updated);
                showToast(`Đã hủy in đậm & tự động gỡ chú thích: "${selectedText}"`);
              }
            }
          }
        }
      }

      // 3. Ctrl+I trong Editor: In nghiêng / Hủy in nghiêng & TỰ ĐỘNG GỠ TÁC GIẢ KHI HỦY IN NGHIÊNG
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i' && bigEditor) {
        e.preventDefault();
        const sel = window.getSelection();
        const selectedText = sel ? sel.toString().trim() : '';
        const wasItalic = document.queryCommandState('italic');

        handleExecCommand('italic');

        if (selectedText) {
          const cleanText = selectedText.toLowerCase();
          const updated = [...articles];
          const cur = updated[bigEditor.rowIndex];

          if (cur) {
            const hasAuthor = cur.author && (
              cur.author.trim().toLowerCase() === cleanText ||
              cleanText.includes(cur.author.trim().toLowerCase()) ||
              cur.author.trim().toLowerCase().includes(cleanText)
            );

            if (wasItalic || hasAuthor) {
              // Hủy in nghiêng -> Tự động xóa tác giả
              delete cur.author;
              delete cur.authorLink;
              setArticles(updated);
              showToast(`Đã hủy in nghiêng & tự động gỡ tác giả: "${selectedText}"`);
            } else {
              // In nghiêng mới -> Gán tác giả & mở modal
              setAnnoAuthor({ name: selectedText, link: cur.authorLink || '' });
              setAnnotationModal({ isOpen: true, tab: 'author', selectedText });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [articles, bigEditor]);

  // Add new empty row
  const handleAddRow = () => {
    const newId = articles.length > 0 ? Math.max(...articles.map((a) => a.id || 0)) + 1 : 1;
    const newRow: ArticleRow = {
      id: newId,
      slug: `bai-viet-${newId}`,
      title: 'TIÊU ĐỀ BÀI VIẾT MỚI',
      subtitle: 'Lời tựa ngắn...',
      category: selectedCategory !== 'all' ? selectedCategory : 'tong-phong-truyen-thua',
      categoryName: 'TÔNG PHONG TRUYỀN THỪA',
      bannerImage: '/images/trang-chu/z5856417756187_3b9aa0f55b1ca50d9934ff24e27fdbad.jpg',
      excerpt: '',
      content: 'Nhập nội dung bài thơ / bài kệ ở đây...',
      author: 'Vô Trí - Tâm Hòa',
      publishedAt: new Date().toISOString(),
      keywords: [],
    };
    setArticles([newRow, ...articles]);
    showToast('✨ Đã thêm dòng bài viết mới vào đầu bảng tính!');
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dòng bài viết này không?')) return;
    const updated = articles.filter((_, i) => i !== index);
    setArticles(updated);
    saveArticlesToBackend(updated, false);
  };

  // Parse and import data from Google Sheets Link, CSV, or Text
  const parseRowsFromText = (rawText: string) => {
    const lines = rawText.trim().split('\n');
    const newRows: ArticleRow[] = [];
    let startId = articles.length > 0 ? Math.max(...articles.map((a) => a.id || 0)) + 1 : 1;

    for (const line of lines) {
      const cols = line.includes('\t') ? line.split('\t') : line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (cols.length >= 2) {
        const catOrTitle = cols[0]?.replace(/^"|"$/g, '').trim() || '';
        const titleOrSub = cols[1]?.replace(/^"|"$/g, '').trim() || '';
        const subOrContent = cols[2]?.replace(/^"|"$/g, '').trim() || '';
        const content = cols[3]?.replace(/^"|"$/g, '').trim() || cols[2]?.replace(/^"|"$/g, '').trim() || cols[1]?.replace(/^"|"$/g, '').trim() || '';

        let matchedCat = 'tong-phong-truyen-thua';
        const foundCat = CATEGORIES.find((c) => c.name.toLowerCase() === catOrTitle.toLowerCase() || c.id === catOrTitle.toLowerCase());
        if (foundCat) matchedCat = foundCat.id;

        newRows.push({
          id: startId++,
          slug: `bai-viet-${startId}`,
          category: matchedCat,
          title: foundCat ? titleOrSub : catOrTitle,
          subtitle: foundCat ? subOrContent : titleOrSub,
          content: content || 'Nội dung chi tiết...',
          bannerImage: '/images/trang-chu/z5856417756187_3b9aa0f55b1ca50d9934ff24e27fdbad.jpg',
          author: 'Vô Trí - Tâm Hòa',
          publishedAt: new Date().toISOString(),
          keywords: [],
        });
      }
    }

    if (newRows.length > 0) {
      const merged = [...newRows, ...articles];
      setArticles(merged);
      setSheetImportModal(false);
      setSheetUrl('');
      setSheetPasteText('');
      saveArticlesToBackend(merged, false);
      showToast(`🎉 Đã quét và nhập thành công ${newRows.length} bài viết vào bảng tính!`);
    } else {
      alert('Không tìm thấy dữ liệu hợp lệ. Vui lòng kiểm tra lại đường link hoặc file!');
    }
  };

  // Quét từ Link Google Sheet
  const handleScanGoogleSheetUrl = async () => {
    if (!sheetUrl.trim()) return;
    setScanningSheet(true);
    try {
      const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match || !match[1]) {
        alert('Đường link Google Sheet không hợp lệ. Hãy dán link có dạng: https://docs.google.com/spreadsheets/d/...');
        return;
      }
      const sheetId = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error('Không thể tải dữ liệu từ Google Sheet. Hãy đảm bảo bạn đã bật "Bất kỳ ai có đường liên kết đều có thể xem (Public)" cho file Sheet này!');
      }
      const csvText = await res.text();
      parseRowsFromText(csvText);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi quét Google Sheet');
    } finally {
      setScanningSheet(false);
    }
  };

  // Filtered rows
  const filtered = articles.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.subtitle?.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ fontFamily: "'UTM Avo', sans-serif" }} className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] text-[#FFE5A3] font-bold text-xs shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-5 flex items-center gap-2.5 backdrop-blur-md">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header Toolbar (ICON-ONLY MINIMAL) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#25170E] p-4 rounded-2xl border border-[#F2C14E]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3A2718] border border-[#F2C14E]/50 flex items-center justify-center text-[#F2C14E] shrink-0">
            <TableIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#ffde59] uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>Bảng Quản Trị Tông Chỉ Tu Học</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/40 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> S3 Sẵn Sàng
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#FFE5A3] text-[10px] font-bold border border-[#F2C14E]/40">
                {articles.length} Bài Viết
              </span>
            </h2>
            <p className="text-[11px] text-[#c9b896] flex items-center gap-1.5 flex-wrap">
              <span>Nhập trực tiếp trên bảng tính</span>
              <span>•</span>
              <span>Bấm vào ô &quot;Nội Dung&quot; để mở khung soạn thảo</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                Bấm biểu tượng
                <Eye className="w-3.5 h-3.5 text-[#F2C14E] shrink-0 inline" />
                để xem trước &amp; kéo thả chỉnh ảnh.
              </span>
            </p>
          </div>
        </div>

        {/* 🌟 ICON-ONLY BUTTONS (Chỉ để biểu tượng, hover hiện tooltip tiếng Việt) */}
        <div className="flex items-center gap-2">
          {/* Nút 0: Quản Lý Tệp S3 Đám Mây (S3 File Explorer) */}
          <button
            type="button"
            onClick={() => {
              setTargetImageCallback(null);
              setImageLibraryOpen(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Mở Trình Quản Lý Tệp S3 Đám Mây (Cây Thư Mục & Quản Lý Ảnh)"
          >
            <Cloud className="w-5 h-5" />
          </button>

          {/* Nút 1: Nhập & Quét Google Sheets / Excel */}
          <button
            type="button"
            onClick={() => setSheetImportModal(true)}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Quét & Nhập dữ liệu tự động từ Google Sheets / Excel (Link hoặc File)"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </button>

          {/* Nút 2: Thêm Dòng */}
          <button
            type="button"
            onClick={handleAddRow}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Thêm Dòng Mới vào bảng tính"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Nút 3: Lưu Bảng Tính */}
          <button
            type="button"
            onClick={() => saveArticlesToBackend(articles, false)}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Lưu toàn bộ bảng tính ngay (Ctrl+S)"
          >
            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề bài viết hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-sm"
          />
        </div>

        {/* Dropdown Lọc Chuyên Mục Tinh Gọn */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[220px]"
        >
          <option value="all">Tất Cả Chuyên Mục ({articles.length})</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({articles.filter((a) => a.category === c.id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Excel Table Grid (Gọn Gàng Cốt Lõi) */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C120A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[78vh] custom-scrollbar">
          <table className="w-full border-collapse text-xs text-left min-w-[1100px] table-fixed">
            <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/40 select-none shadow-md">
              <tr>
                <th className="p-3 w-[45px] min-w-[45px] text-center border-r border-[#F2C14E]/20">#</th>
                <th className="p-3 w-[150px] min-w-[150px] border-r border-[#F2C14E]/20 text-center">Chuyên Mục</th>
                <th className="p-3 w-[80px] min-w-[80px] text-center border-r border-[#F2C14E]/20">Banner</th>
                <th className="p-3 w-[190px] min-w-[190px] border-r border-[#F2C14E]/20">Tiêu Đề Bài Viết</th>
                <th className="p-3 w-[250px] min-w-[250px] border-r border-[#F2C14E]/20">Tiêu Đề Phụ</th>
                <th className="p-3 w-[140px] min-w-[140px] border-r border-[#F2C14E]/20 text-center">Đa Phương Tiện</th>
                <th
                  className="p-3 border-r border-[#F2C14E]/20 cursor-help"
                  title="Bấm vào từng ô để mở khung soạn thảo toàn màn hình"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nội Dung Chi Tiết</span>
                    <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  </div>
                </th>
                <th className="p-3 w-[85px] min-w-[85px] text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/15">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    Đang tải dữ liệu bảng tính...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    Chưa có bài viết nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                filtered.map((row, filterIdx) => {
                  const targetIdx = articles.findIndex((a) => a.id === row.id);
                  const actualIdx = targetIdx !== -1 ? targetIdx : filterIdx;

                  // Đếm số lượng nguồn sách
                  const bookCount = Array.isArray(row.sourceBook)
                    ? row.sourceBook.filter((b) => b && b.bookTitle?.trim()).length
                    : row.sourceBook?.bookTitle?.trim()
                      ? 1
                      : 0;

                  return (
                    <tr
                      key={row.id || filterIdx}
                      className={`transition-colors group focus-within:bg-[#2D1B0F] ${filterIdx % 2 === 0 ? 'bg-[#170E08]' : 'bg-[#120A05]'
                        } hover:bg-[#26160B]`}
                    >
                      {/* 1. STT */}
                      <td className="p-3 w-[45px] min-w-[45px] text-center font-mono font-bold text-[#F2C14E] border-r border-[#F2C14E]/15 bg-[#140D07]/60 align-middle">
                        {actualIdx + 1}
                      </td>

                      {/* 2. Chuyên Mục (Căn giữa dọc đẹp mắt) */}
                      <td className="p-2.5 w-[150px] min-w-[150px] border-r border-[#F2C14E]/15 align-middle">
                        <select
                          value={row.category}
                          onChange={(e) => {
                            const updated = [...articles];
                            updated[actualIdx].category = e.target.value;
                            setArticles(updated);
                          }}
                          className="w-full px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 3. Ảnh Banner / Đại Diện */}
                      <td className="p-2 w-[80px] min-w-[80px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div
                          onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'banner' })}
                          className="relative w-14 h-12 mx-auto rounded-xl overflow-hidden border border-[#F2C14E]/40 hover:border-[#F2C14E] bg-black/60 cursor-pointer group/banner shadow-sm transition-all hover:scale-105"
                          title="Bấm để cài đặt ảnh Banner / Đại diện"
                        >
                          {row.bannerImage ? (
                            <img src={row.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#F2C14E]/60">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-[9px] mt-0.5 font-bold">Thêm</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                            Sửa
                          </div>
                        </div>
                      </td>

                      {/* 4. Tiêu Đề Bài Viết (Căn giữa dọc đẹp mắt) */}
                      <td className="p-2.5 w-[190px] min-w-[190px] border-r border-[#F2C14E]/15 align-middle">
                        <textarea
                          rows={3}
                          value={row.title}
                          onChange={(e) => {
                            const updated = [...articles];
                            updated[actualIdx].title = e.target.value;
                            setArticles(updated);
                          }}
                          placeholder="Nhập tiêu đề bài viết..."
                          className="w-full min-h-[72px] px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs font-bold text-[#ffde59] uppercase focus:outline-none leading-snug transition-all resize-none shadow-sm flex items-center"
                        />
                      </td>

                      {/* 5. Tiêu Đề Phụ (Căn giữa dọc đẹp mắt) */}
                      <td className="p-2.5 w-[250px] min-w-[250px] border-r border-[#F2C14E]/15 align-middle">
                        <textarea
                          rows={3}
                          value={row.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...articles];
                            updated[actualIdx].subtitle = e.target.value;
                            setArticles(updated);
                          }}
                          placeholder="Nhập lời tựa / phụ..."
                          className="w-full min-h-[72px] px-3 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] italic focus:outline-none leading-relaxed transition-all resize-none shadow-sm flex items-center"
                        />
                      </td>

                      {/* 6. Đa Phương Tiện (Icon Vector SVG với tooltip & số đếm) */}
                      <td className="p-2.5 w-[140px] min-w-[140px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Video */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'video' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${row.videoBlock?.videoUrl
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                              }`}
                            title={row.videoBlock?.videoUrl ? `Video: ${row.videoBlock.title || 'Đã cài đặt video'}` : 'Quản lý Video Minh Họa'}
                          >
                            <Video className="w-4 h-4" />
                            {row.videoBlock?.videoUrl && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                1
                              </span>
                            )}
                          </button>

                          {/* Nút Bài Viết Nổi Bật */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'featured' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${row.featuredArticle?.title
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                              }`}
                            title={row.featuredArticle?.title ? `Nổi bật: ${row.featuredArticle.title}` : 'Quản lý Bài Viết Nổi Bật'}
                          >
                            <Star className="w-4 h-4" />
                            {row.featuredArticle?.title && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                1
                              </span>
                            )}
                          </button>

                          {/* Nút Bộ Sưu Tập Ảnh */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'gallery' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${(row.photoGallery?.length || 0) > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                              }`}
                            title={`Bộ sưu tập ảnh (${row.photoGallery?.length || 0} ảnh)`}
                          >
                            <Images className="w-4 h-4" />
                            {(row.photoGallery?.length || 0) > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {row.photoGallery!.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 7. Nội Dung Chi Tiết (Bấm Mở Khung Soạn Thảo Modal) */}
                      <td className="p-2.5 border-r border-[#F2C14E]/15 align-middle max-w-full overflow-hidden">
                        <div
                          onClick={() => openBigEditor(actualIdx, 'content', 'Nội Dung Chi Tiết')}
                          className="w-full min-h-[72px] p-2.5 bg-[#22140A] hover:bg-[#2C1A0E] border border-[#52331C] hover:border-[#F2C14E] rounded-xl cursor-pointer transition-all flex flex-col justify-between group/cell shadow-inner overflow-hidden"
                          title="Bấm vào để mở khung soạn thảo toàn màn hình"
                        >
                          <p className="text-xs text-[#F5EADB]/80 line-clamp-2 leading-relaxed truncate">
                            {row.content ? row.content.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...' : 'Chưa có nội dung...'}
                          </p>
                          <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#F2C14E]/15 text-[11px] text-[#F2C14E] overflow-hidden">
                            <span className="flex items-center gap-1.5 font-bold text-[#F2C14E] group-hover/cell:text-[#ffde59]" title="Mở khung soạn thảo">
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-[#c9b896]/75 shrink-0">
                              {row.keywords?.length > 0 && (
                                <span
                                  title={`${row.keywords.length} chú thích thuật ngữ`}
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-[#F2C14E] shrink-0" />
                                  <span>{row.keywords.length}</span>
                                </span>
                              )}
                              {bookCount > 0 && (
                                <span
                                  title={`${bookCount} nguồn sách tham khảo`}
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-[#F2C14E] shrink-0" />
                                  <span>{bookCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 8. Thao Tác (Soạn Thảo Đầy Đủ / Xem Trước / Xem Web / Xóa) */}
                      <td className="p-2 w-[120px] min-w-[120px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          {/* Nút Mở Trình Soạn Thảo WordPress Đầy Đủ */}
                          <Link
                            href={`/admin/tong-chi/${row.id}`}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Mở trình soạn thảo WordPress chuyên nghiệp đầy đủ"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#F2C14E] hover:text-black" />
                          </Link>

                          {/* Nút Xem Web Trực Tiếp */}
                          {row.slug && (
                            <Link
                              href={`/tong-chi-tu-hoc/${row.slug}`}
                              target="_blank"
                              className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer shadow-sm hover:scale-105"
                              title="Mở bài viết trên trang web chính thức (tab mới)"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* Nút Xem Trước Nhanh */}
                          <button
                            type="button"
                            onClick={() => setPreviewModal(row)}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xem trước & chỉnh sửa giao diện trực quan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(actualIdx)}
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
    {/* 🌟 1. TRÌNH SOẠN THẢO GOOGLE DOCS TOÀN MÀN HÌNH (BIG EDITOR MODAL) */}
    {/* ============================================================ */}
    {bigEditor && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
        <div
          className={`bg-[#1C120A] border-2 border-[#F2C14E] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] transition-all duration-200 ${isEditorMaximized
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
                  {articles[bigEditor.rowIndex]?.title || 'Chưa đặt tiêu đề'}
                </h3>
              </div>
            </div>

            {/* Window Controls & Action Save Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Nút Xem Trên Web */}
              {articles[bigEditor.rowIndex]?.slug && (
                <Link
                  href={`/tong-chi-tu-hoc/${articles[bigEditor.rowIndex].slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-[#25170E] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] hover:text-[#FFDE59] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  title="Mở bài viết trực tiếp trên trang web (tab mới)"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span className="hidden sm:inline">Xem Web</span>
                </Link>
              )}

              {/* Nút Mở Trình Soạn Thảo Đầy Đủ */}
              {articles[bigEditor.rowIndex]?.id && (
                <Link
                  href={`/admin/tong-chi/${articles[bigEditor.rowIndex].id}`}
                  className="px-3 py-1.5 rounded-xl bg-[#25170E] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#FFDE59] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  title="Mở trang soạn thảo chuyên sâu toàn màn hình (WordPress style)"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span className="hidden md:inline">Trình Soạn Thảo Đầy Đủ</span>
                </Link>
              )}

              {/* NÚT LƯU BÀI VIẾT CHÍNH */}
              <button
                type="button"
                onClick={() => saveArticlesToBackend(articles, false)}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(242,193,78,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105"
                title="Lưu ngay bài viết này (Phím tắt: Ctrl + S)"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#1A120B]" />
                ) : (
                  <Save className="w-4 h-4 text-[#1A120B] stroke-[2.5]" />
                )}
                <span>{saving ? 'Đang Lưu...' : 'Lưu Bài Viết'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                className="p-2 rounded-xl hover:bg-[#25170E] text-[#FFE5A3] border border-transparent hover:border-[#F2C14E]/30 transition-all cursor-pointer"
                title={isEditorMaximized ? 'Thu nhỏ cửa sổ' : 'Mở rộng toàn màn hình'}
              >
                {isEditorMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBigEditor(null);
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
            {/* 1. PREVIEW CONTAINER */}
            {editorPreviewMode ? (
              <div className="flex-1 w-full bg-[#1C120A] border border-[#F2C14E]/40 rounded-2xl overflow-y-auto custom-scrollbar shadow-inner">
                <HeroBanner
                  bannerUrl={articles[bigEditor.rowIndex]?.bannerImage}
                  bannerPosition={articles[bigEditor.rowIndex]?.bannerPosition}
                  title={articles[bigEditor.rowIndex]?.title || ''}
                  subtitle={articles[bigEditor.rowIndex]?.subtitle}
                />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
                  <section id="bai-tho" className="relative pt-2">
                    <InfographicArticleRenderer
                      rawContent={String(articles[bigEditor.rowIndex]?.[bigEditor.field] || '')}
                      title={articles[bigEditor.rowIndex]?.title || ''}
                      subtitle={articles[bigEditor.rowIndex]?.subtitle}
                      author={articles[bigEditor.rowIndex]?.author}
                      authorLink={articles[bigEditor.rowIndex]?.authorLink}
                      popups={articles[bigEditor.rowIndex]?.keywords}
                      onKeywordClick={(kwStr) => {
                        const kws = articles[bigEditor.rowIndex]?.keywords || [];
                        const found = kws.find((k) => k.keyword.toLowerCase() === kwStr.toLowerCase());
                        if (found) {
                          setActivePreviewKeyword({
                            ...found,
                            _articleIndex: bigEditor.rowIndex,
                          });
                        }
                      }}
                    />
                  </section>
                  {articles[bigEditor.rowIndex]?.sourceBook && (
                    <BookCitationSection sourceBook={articles[bigEditor.rowIndex].sourceBook} />
                  )}
                </div>
              </div>
            ) : (
              /* 2. PROSEMIRROR TIPTAP ZEN EDITOR CONTAINER */
              <ZenTipTapEditor
                content={String(articles[bigEditor.rowIndex]?.[bigEditor.field] || '')}
                onChange={(newMd) => {
                  const updated = [...articles];
                  updated[bigEditor.rowIndex] = {
                    ...updated[bigEditor.rowIndex],
                    [bigEditor.field]: newMd,
                  };
                  setArticles(updated);
                  setIsDirty(true);
                }}
                folderPath="tong-chi-tu-hoc"
                onOpenS3Explorer={() => setImageLibraryOpen(true)}
                onAddAnnotationKeyword={(kw) => {
                  const existingKw = articles[bigEditor.rowIndex]?.keywords?.find(
                    (k) => k.keyword.toLowerCase() === kw.toLowerCase()
                  );
                  if (existingKw) {
                    setAnnoKw({ ...existingKw });
                  } else {
                    setAnnoKw({
                      keyword: kw,
                      title: kw,
                      subtitle: '',
                      description: '',
                      imageUrl: '',
                      imagePosition: 'center 50%',
                      linkUrl: '',
                    });
                  }
                  setAnnotationModal({ isOpen: true, tab: 'keyword', selectedText: kw });
                }}
                previewMode={editorPreviewMode}
                onTogglePreview={() => setEditorPreviewMode(!editorPreviewMode)}
              />
            )}

            {/* 🌟 3 Ô ĐÁY MÀN HÌNH: TỔNG HỢP CHÚ THÍCH & NGUỒN SÁCH ĐÃ TRÍCH DẪN (CLICK ĐỂ SỬA TRỰC TIẾP) */}
            {(() => {
              const curArticle = articles[bigEditor.rowIndex];
              if (!curArticle) return null;

              const kwList = curArticle.keywords || [];
              const books = Array.isArray(curArticle.sourceBook)
                ? curArticle.sourceBook
                : curArticle.sourceBook
                  ? [curArticle.sourceBook]
                  : [];

              if (kwList.length === 0 && books.length === 0 && !curArticle.author) return null;

              return (
                <div className="p-2 bg-[#1A1008] border border-[#F2C14E]/30 rounded-2xl shrink-0 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#FFE5A3] font-bold px-1">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3 h-3 text-[#F2C14E]" />
                      <span>Mục chú thích &amp; nguồn sách ({kwList.length + books.length + (curArticle.author ? 1 : 0)})</span>
                    </span>
                    <span className="text-[10px] text-[#c9b896]/60 font-normal italic">
                      (Bấm để sửa • Bấm ✕ để gỡ)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
                    {/* Tác Giả Card */}
                    {curArticle.author && (
                      <div
                        onClick={() => {
                          setAnnoAuthor({
                            name: curArticle.author || '',
                            link: curArticle.authorLink || '',
                          });
                          setAnnotationModal({
                            isOpen: true,
                            tab: 'author',
                            selectedText: curArticle.author || '',
                          });
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#25170E] border border-[#FFE5A3]/40 hover:border-[#F2C14E] hover:bg-[#352012] rounded-xl shrink-0 shadow-sm cursor-pointer transition-all hover:scale-[1.02] group text-xs"
                        title="Bấm để chỉnh sửa thông tin Tác giả"
                      >
                        <span className="w-5 h-5 rounded-md bg-[#3A2718] flex items-center justify-center text-[#F2C14E] shrink-0">
                          <User className="w-3 h-3" />
                        </span>
                        <div className="max-w-[130px]">
                          <p className="text-[11px] text-[#FFE5A3] font-bold truncate group-hover:text-[#FFDE59]">{curArticle.author}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = [...articles];
                            const curMd = getCurrentEditorMarkdown();
                            if (curMd) {
                              const extracted = cleanAndExtractContent(curMd, updated[bigEditor.rowIndex]);
                              updated[bigEditor.rowIndex].content = extracted.cleanedContent;
                            }
                            updated[bigEditor.rowIndex].author = undefined;
                            setArticles(updated);
                            setIsDirty(true);
                            showToast('Đã gỡ tác giả bài viết');
                          }}
                          className="p-0.5 rounded hover:bg-red-900/60 text-[#c9b896] hover:text-red-300 transition-all cursor-pointer ml-0.5"
                          title="Xóa tác giả"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Chú Thích Items */}
                    {kwList.map((kw, i) => (
                      <div
                        key={`kw-${i}`}
                        onClick={() => {
                          setAnnoKw({
                            keyword: kw.keyword,
                            title: kw.title || kw.keyword,
                            subtitle: kw.subtitle || '',
                            description: kw.description || '',
                            imageUrl: kw.imageUrl || '',
                            imagePosition: kw.imagePosition || 'center 50%',
                            linkUrl: kw.linkUrl || '',
                          });
                          setAnnotationModal({
                            isOpen: true,
                            tab: 'keyword',
                            selectedText: kw.keyword,
                            editingIndex: i,
                            originalKey: kw.keyword,
                          });
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#25170E] border border-[#F2C14E]/40 hover:border-[#F2C14E] hover:bg-[#352012] rounded-xl shrink-0 group shadow-sm cursor-pointer transition-all hover:scale-[1.02] text-xs"
                        title={`Bấm để chỉnh sửa chi tiết chú thích: ${kw.keyword}`}
                      >
                        {kw.imageUrl ? (
                          <img src={kw.imageUrl} alt="kw" className="w-5 h-5 object-cover rounded-md border border-[#F2C14E]/30" />
                        ) : (
                          <span className="w-5 h-5 rounded-md bg-[#3A2718] flex items-center justify-center text-[#F2C14E] shrink-0">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                        <div className="max-w-[130px]">
                          <p className="text-[11px] text-[#FFE5A3] font-bold truncate group-hover:text-[#FFDE59]">{kw.keyword}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const kwToRemove = kw.keyword;
                            const updated = [...articles];
                            const curMd = getCurrentEditorMarkdown();
                            if (curMd) {
                              const extracted = cleanAndExtractContent(curMd, updated[bigEditor.rowIndex]);
                              updated[bigEditor.rowIndex].content = extracted.cleanedContent;
                            }
                            updated[bigEditor.rowIndex].keywords = kwList.filter((_, idx) => idx !== i);

                            // Đồng bộ gỡ in đậm trong editor nếu có
                            if (wysiwygEditorRef.current) {
                              const curHtml = wysiwygEditorRef.current.innerHTML;
                              const escaped = kwToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                              const regex = new RegExp(`<b>(${escaped})<\\/b>`, 'gi');
                              wysiwygEditorRef.current.innerHTML = curHtml.replace(regex, '$1');
                              const afterMd = getCurrentEditorMarkdown();
                              const afterExtracted = cleanAndExtractContent(afterMd, updated[bigEditor.rowIndex]);
                              updated[bigEditor.rowIndex].content = afterExtracted.cleanedContent;
                            }

                            setArticles(updated);
                            setIsDirty(true);
                            showToast(`Đã gỡ chú thích: ${kw.keyword}`);
                          }}
                          className="p-0.5 rounded hover:bg-red-900/60 text-[#c9b896] hover:text-red-300 transition-all cursor-pointer ml-0.5"
                          title="Gỡ chú thích"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Sách Items */}
                    {books.map((b, i) => (
                      <div
                        key={`book-${i}`}
                        onClick={() => {
                          const matched = getMatchedBookData(b.bookTitle);
                          setAnnoBook({
                            bookTitle: b.bookTitle,
                            author: b.author || matched?.author || '',
                            coverImage: b.coverImage || matched?.coverImage || '',
                            description: b.description || matched?.description || '',
                            linkUrl: b.linkUrl || matched?.linkUrl || '',
                          });
                          setAnnotationModal({
                            isOpen: true,
                            tab: 'book',
                            selectedText: b.bookTitle,
                            editingIndex: i,
                            originalKey: b.bookTitle,
                          });
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#25170E] border border-[#4A88B7]/60 hover:border-[#4A88B7] hover:bg-[#1E3042]/50 rounded-xl shrink-0 group shadow-sm cursor-pointer transition-all hover:scale-[1.02] text-xs"
                        title={`Bấm để chỉnh sửa nguồn sách: ${b.bookTitle}`}
                      >
                        {b.coverImage ? (
                          <img src={b.coverImage} alt="cover" className="w-5 h-5 object-cover rounded-md border border-[#4A88B7]/40" />
                        ) : (
                          <span className="w-5 h-5 rounded-md bg-[#1E3042] flex items-center justify-center text-[#4A88B7] shrink-0">
                            <BookOpen className="w-3 h-3" />
                          </span>
                        )}
                        <div className="max-w-[130px]">
                          <p className="text-[11px] text-[#4A88B7] font-bold truncate group-hover:text-[#88C0E8]">{b.bookTitle}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = [...articles];
                            const curMd = getCurrentEditorMarkdown();
                            if (curMd) {
                              const extracted = cleanAndExtractContent(curMd, updated[bigEditor.rowIndex]);
                              updated[bigEditor.rowIndex].content = extracted.cleanedContent;
                            }
                            const newBooks = books.filter((_, idx) => idx !== i);
                            updated[bigEditor.rowIndex].sourceBook = newBooks.length > 0 ? newBooks : undefined;
                            setArticles(updated);
                            setIsDirty(true);
                            showToast(`Đã gỡ trích nguồn sách: ${b.bookTitle}`);
                          }}
                          className="p-0.5 rounded hover:bg-red-900/60 text-[#c9b896] hover:text-red-300 transition-all cursor-pointer ml-0.5"
                          title="Gỡ sách"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            </div>

            {/* 🌟 STICKY FOOTER ACTION BAR CỦA TRÌNH SOẠN THẢO */}
            <div className="pt-3 border-t border-[#F2C14E]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#FFE5A3]">
                <span>{isDirty ? '⚠️ Có thay đổi chưa lưu' : '✅ Dữ liệu đã đồng bộ'}</span>
                {lastSavedTime && <span className="text-[10px] text-[#c9b896]/60">• Đã lưu lúc {lastSavedTime}</span>}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setBigEditor(null)}
                  className="px-4 py-2 rounded-xl bg-[#25170E] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] text-xs font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await saveArticlesToBackend(articles, false);
                    setBigEditor(null);
                  }}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#3A2718] hover:bg-[#523824] border border-[#F2C14E]/60 text-[#FFDE59] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F2C14E]" />
                  <span>Lưu &amp; Đóng</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveArticlesToBackend(articles, false)}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] text-xs sm:text-sm font-bold transition-all shadow-[0_0_15px_rgba(242,193,78,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin text-[#1A120B]" /> : <Save className="w-4 h-4 text-[#1A120B] stroke-[2.5]" />}
                  <span>{saving ? 'Đang Lưu...' : 'Lưu Bài Viết (Ctrl+S)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 2. MODAL NHẬP DỮ LIỆU TỪ GOOGLE SHEETS / EXCEL (LINK / FILE / PASTE) */}
      {/* ============================================================ */}
      {sheetImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-2xl flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal"
                  >
                    NHẬP &amp; QUÉT TỰ ĐỘNG GOOGLE SHEETS / EXCEL
                  </h3>
                  <p className="text-xs text-[#c9b896]">
                    Nhập đường link Google Sheet hoặc tải file Excel (.csv, .tsv) để tự động bóc tách vào bảng tính.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSheetImportModal(false)}
                className="p-2 rounded-full hover:bg-[#25170E] text-[#c9b896] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs (100% VECTOR SVG ICONS) */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4">
              <button
                type="button"
                onClick={() => setSheetTab('link')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${sheetTab === 'link' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                  }`}
                title="1. Nhập Link Google Sheet"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSheetTab('file')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${sheetTab === 'file' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                  }`}
                title="2. Tải File Excel (.csv / .tsv / .txt)"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSheetTab('paste')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${sheetTab === 'paste' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                  }`}
                title="3. Dán Nội Dung Bảng Tính Trực Tiếp"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            {/* Tab 1: Google Sheet Link */}
            {sheetTab === 'link' && (
              <div className="py-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>Dán link Google Sheet:</span>
                  </label>
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1aBcDeFgHiJk.../edit"
                    className="w-full px-4 py-3 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
                <div className="p-3 bg-[#2A1D14] border border-[#F2C14E]/20 rounded-xl text-[11px] text-[#c9b896] space-y-1">
                  <p className="font-bold text-[#F2C14E] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Hướng dẫn quyền truy cập:</span>
                  </p>
                  <p>Hãy đảm bảo file Google Sheet của bạn được đặt ở chế độ: <strong>&quot;Bất kỳ ai có đường liên kết đều có thể xem (Viewer)&quot;</strong> để hệ thống có thể đọc dữ liệu tự động.</p>
                </div>
              </div>
            )}

            {/* Tab 2: File Upload */}
            {sheetTab === 'file' && (
              <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-[#F2C14E]/40 rounded-2xl bg-[#25170E]/50 my-2">
                <FileSpreadsheet className="w-12 h-12 text-[#F2C14E] mb-3 opacity-80" />
                <label className="p-3 rounded-2xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all cursor-pointer flex items-center justify-center shadow-md hover:scale-105" title="Chọn file từ máy tính (.csv, .tsv, .txt)">
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    accept=".csv, .tsv, .txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          if (text) parseRowsFromText(text);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                <p className="text-[11px] text-[#c9b896]/60 mt-3">Hỗ trợ file CSV hoặc file xuất từ Microsoft Excel / Google Sheets</p>
              </div>
            )}

            {/* Tab 3: Paste Text */}
            {sheetTab === 'paste' && (
              <div className="py-3 space-y-2">
                <textarea
                  rows={8}
                  value={sheetPasteText}
                  onChange={(e) => setSheetPasteText(e.target.value)}
                  placeholder="Sao chép các dòng trong Excel và dán vào đây..."
                  className="w-full p-4 bg-[#25170E] border border-[#F2C14E]/40 rounded-2xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                />
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setSheetImportModal(false)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Hủy bỏ"
              >
                <X className="w-5 h-5" />
              </button>

              {sheetTab === 'link' ? (
                <button
                  type="button"
                  onClick={handleScanGoogleSheetUrl}
                  disabled={scanningSheet || !sheetUrl.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center cursor-pointer disabled:opacity-50 hover:scale-105"
                  title="Quét & Nhập dữ liệu tự động từ link vào bảng tính"
                >
                  {scanningSheet ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 stroke-[2.5]" />}
                </button>
              ) : sheetTab === 'paste' ? (
                <button
                  type="button"
                  onClick={() => parseRowsFromText(sheetPasteText)}
                  disabled={!sheetPasteText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center cursor-pointer disabled:opacity-50 hover:scale-105"
                  title="Nhập dữ liệu đã dán vào bảng tính"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 3. MODAL CHÚ THÍCH / SÁCH / TÁC GIẢ TÍCH HỢP (KÈM TRƯỜNG THÊM ẢNH) */}
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
                  {annotationModal.tab === 'keyword' ? 'THÊM CHÚ THÍCH TỪ KHÓA' : annotationModal.tab === 'book' ? 'GÁN TRÍCH NGUỒN SÁCH' : 'GÁN TÁC GIẢ BÀI VIẾT'}
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

            {/* Selector Tab - 100% Vector SVG Icons */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4">
              <button
                type="button"
                onClick={() => setAnnotationModal({ ...annotationModal, tab: 'keyword' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  annotationModal.tab === 'keyword'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="1. Thêm Chú Thích Từ Khóa"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAnnotationModal({ ...annotationModal, tab: 'book' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  annotationModal.tab === 'book'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="2. Gán Trích Nguồn Sách"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAnnotationModal({ ...annotationModal, tab: 'author' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  annotationModal.tab === 'author'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="3. Gán Tác Giả Bài Viết"
              >
                <User className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Body */}
            <div className="space-y-3 py-1">
              {annotationModal.tab === 'keyword' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Từ Khóa Trong Bài *</span>
                    </label>
                    <input
                      type="text"
                      value={annoKw.keyword}
                      onChange={(e) => setAnnoKw({ ...annoKw, keyword: e.target.value, title: e.target.value })}
                      placeholder="Ví dụ: Bồ Đề Tâm..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Nội Dung Giải Nghĩa / Diễn Giải *</span>
                    </label>
                    <textarea
                      rows={3}
                      value={annoKw.description}
                      onChange={(e) => setAnnoKw({ ...annoKw, description: e.target.value })}
                      placeholder="Giải thích ý nghĩa khi người đọc bấm vào từ khóa..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  {/* 🌟 TRƯỜNG LINK BÀI VIẾT / TRANG LIÊN QUAN (KÈM GỢI Ý NHANH) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Link Bài Viết / Trang Liên Quan (Tùy chọn)</span>
                      </label>
                      <span title="Chỉ hiện nút 'Xem chi tiết' khi có link" className="cursor-help text-[#c9b896]/60">
                        <Info className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={annoKw.linkUrl || ''}
                        onChange={(e) => setAnnoKw({ ...annoKw, linkUrl: e.target.value })}
                        placeholder="Ví dụ: /gioi-thieu/su-ong-hoang-phap hoặc https://chuahoangphap.com.vn"
                        className="w-full px-3.5 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono text-[11px]"
                      />
                      {annoKw.linkUrl && (
                        <button
                          type="button"
                          onClick={() => setAnnoKw((prev) => ({ ...prev, linkUrl: '' }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#c9b896] hover:text-white cursor-pointer"
                          title="Xóa link"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Danh sách nút đề xuất link có sẵn */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span title="Gợi ý liên kết nhanh" className="text-[10px] text-[#FFE5A3]/60 font-medium flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-[#F2C14E]" />
                      </span>
                      {[
                        { label: 'Sư Ông Hoằng Pháp', url: '/gioi-thieu/su-ong-hoang-phap' },
                        { label: 'Sư Tổ Ngộ Chân Tử', url: '/gioi-thieu/tieu-su-su-to' },
                        { label: 'Sư Phụ Trụ Trì', url: '/gioi-thieu/su-phu-tru-tri' },
                        { label: 'Chùa Hoằng Pháp', url: 'https://chuahoangphap.com.vn' },
                        { label: 'Bản Đồ Danh Tăng', url: '/admin/danh-tang' },
                        { label: 'Lịch Sử Tùng Lâm', url: '/gioi-thieu/lich-su-tung-lam-hoa-phuc' },
                        { label: 'Trí Tuệ Phật Pháp', url: '/tri-tue-phat-phap' },
                      ].map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setAnnoKw((prev) => ({ ...prev, linkUrl: sug.url }))}
                          title={sug.url}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                            annoKw.linkUrl === sug.url
                              ? 'bg-[#F2C14E] text-[#1A120B] border-[#F2C14E]'
                              : 'bg-[#2A1D14] text-[#FFE5A3] hover:text-[#ffde59] border-[#F2C14E]/30 hover:border-[#F2C14E]'
                          }`}
                        >
                          {sug.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 🌟 ẢNH MINH HỌA VÀ KÉO CHỈNH VỊ TRÍ */}
                  <div>
                    <div className="text-xs font-bold text-[#FFE5A3] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Ảnh Minh Họa (S3)</span>
                      </span>
                      {annoKw.imageUrl && (
                        <span title="Kéo chuột trên ảnh để chỉnh khung nhìn" className="cursor-help text-[#F2C14E] flex items-center gap-1 text-[10px]">
                          <Info className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {annoKw.imageUrl ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh lên S3...');
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) setAnnoKw((prev) => ({ ...prev, imageUrl: url }));
                          }
                        }}
                        className="p-2.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-2xl space-y-2"
                      >
                        <InteractiveImageDrag
                          imageUrl={annoKw.imageUrl}
                          position={annoKw.imagePosition || 'center 50%'}
                          onPositionChange={(pos) => setAnnoKw((prev) => ({ ...prev, imagePosition: pos }))}
                          className="w-full h-32 sm:h-36"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[10px] text-[#c9b896]/70 font-mono truncate max-w-[200px]" title={annoKw.imageUrl}>
                            {annoKw.imageUrl}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => openS3Library((url) => setAnnoKw((prev) => ({ ...prev, imageUrl: url })))}
                              className="w-8 h-8 rounded-xl bg-[#2D1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/40 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
                              title="Đổi ảnh từ Thư Viện S3 (hoặc kéo thả ảnh mới vào đây)"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setAnnoKw((prev) => ({ ...prev, imageUrl: '', imagePosition: undefined }))}
                              className="w-8 h-8 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/40 transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                              title="Gỡ ảnh này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) setAnnoKw((prev) => ({ ...prev, imageUrl: url }));
                          }
                        }}
                        className="p-4 border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-xl bg-[#1C120A]/60 hover:bg-[#2A1D14]/60 text-center cursor-pointer transition-all group"
                        title="Bấm để mở S3 hoặc Kéo thả ảnh trực tiếp vào đây"
                      >
                        <ImageIcon className="w-6 h-6 text-[#F2C14E]/70 group-hover:text-[#F2C14E] mx-auto mb-1" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh từ S3 hoặc Thả ảnh vào đây</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {annotationModal.tab === 'book' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tên Sách / Tác Phẩm *</span>
                    </label>
                    <input
                      type="text"
                      value={annoBook.bookTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = getMatchedBookData(val);
                        if (matched) {
                          setAnnoBook({
                            bookTitle: val,
                            author: matched.author || annoBook.author || '',
                            description: matched.description || annoBook.description || '',
                            coverImage: matched.coverImage || annoBook.coverImage || '',
                            linkUrl: matched.linkUrl || annoBook.linkUrl || '',
                          });
                        } else {
                          setAnnoBook((prev) => ({ ...prev, bookTitle: val }));
                        }
                      }}
                      placeholder="Ví dụ: Đi Qua Khổ Vui Cuộc Đời..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tác Giả Sách</span>
                    </label>
                    <input
                      type="text"
                      value={annoBook.author || ''}
                      onChange={(e) => setAnnoBook({ ...annoBook, author: e.target.value })}
                      placeholder="Vô Trí - Tâm Hòa..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Mô Tả Tóm Tắt Về Tác Phẩm / Sách</span>
                    </label>
                    <textarea
                      rows={3}
                      value={annoBook.description || ''}
                      onChange={(e) => setAnnoBook({ ...annoBook, description: e.target.value })}
                      placeholder="Mô tả tóm tắt nội dung tác phẩm hoặc nguồn trích dẫn..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#FFE5A3] mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Ảnh Bìa Sách (S3)</span>
                    </div>

                    {annoBook.coverImage ? (
                      <div className="flex items-center gap-3 p-3 bg-[#1C120A] border border-[#F2C14E]/40 rounded-xl">
                        <img
                          src={annoBook.coverImage}
                          alt="Bìa sách"
                          className="w-14 h-20 rounded-lg object-cover border border-[#F2C14E]/60 shadow-md shrink-0 bg-black/40"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '0.3';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#FFE5A3] font-mono truncate" title={annoBook.coverImage}>
                            {annoBook.coverImage}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => openS3Library((url) => setAnnoBook((prev) => ({ ...prev, coverImage: url })))}
                              className="w-8 h-8 rounded-xl bg-[#2D1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/40 transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
                              title="Đổi ảnh bìa từ Thư Viện S3"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setAnnoBook((prev) => ({ ...prev, coverImage: '' }))}
                              className="w-8 h-8 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/40 transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                              title="Gỡ ảnh bìa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => openS3Library((url) => setAnnoBook((prev) => ({ ...prev, coverImage: url })))}
                        className="p-4 border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-xl bg-[#1C120A]/60 hover:bg-[#2A1D14]/60 text-center cursor-pointer transition-all group"
                        title="Bấm để mở Cây Thư Mục S3 và chọn ảnh bìa"
                      >
                        <ImageIcon className="w-6 h-6 text-[#F2C14E]/70 group-hover:text-[#F2C14E] mx-auto mb-1" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh bìa từ Thư Viện S3</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {annotationModal.tab === 'author' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tên Tác Giả Bài Viết *</span>
                    </label>
                    <input
                      type="text"
                      value={annoAuthor.name}
                      onChange={(e) => setAnnoAuthor({ ...annoAuthor, name: e.target.value })}
                      placeholder="Ví dụ: Vô Trí - Thích Tâm Hòa..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Link Giới Thiệu Tác Giả (Không bắt buộc)</span>
                    </label>
                    <input
                      type="text"
                      value={annoAuthor.link}
                      onChange={(e) => setAnnoAuthor({ ...annoAuthor, link: e.target.value })}
                      placeholder="/gioi-thieu/su-phu-tru-tri..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setAnnotationModal(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Hủy bỏ"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  const curIdx = annotationModal.rowIndex ?? bigEditor?.rowIndex;
                  if (curIdx === undefined || !articles[curIdx]) return;
                  const updated = [...articles];

                  // 🛡️ 1. LUÔN LUÔN ĐỒNG BỘ NỘI DUNG HIỆN TẠI TỪ EDITOR DOM VÀO BÀI VIẾT NẾU ĐANG MỞ TRÌNH SOẠN THẢO
                  if (bigEditor && wysiwygEditorRef.current) {
                    const curMd = getCurrentEditorMarkdown();
                    if (curMd) {
                      const extracted = cleanAndExtractContent(curMd, updated[curIdx]);
                      updated[curIdx].content = extracted.cleanedContent;
                      if (extracted.author && !updated[curIdx].author) {
                        updated[curIdx].author = extracted.author;
                      }
                    }
                  }

                  if (annotationModal.tab === 'keyword' && annoKw.keyword.trim()) {
                    const kws = [...(updated[curIdx].keywords || [])];
                    if (
                      annotationModal.editingIndex !== undefined &&
                      annotationModal.editingIndex !== null &&
                      annotationModal.editingIndex >= 0 &&
                      annotationModal.editingIndex < kws.length
                    ) {
                      kws[annotationModal.editingIndex] = { ...annoKw };
                    } else {
                      const searchKey = (annotationModal.originalKey || annoKw.keyword).toLowerCase();
                      const existingIdx = kws.findIndex((k) => k.keyword.toLowerCase() === searchKey);
                      if (existingIdx !== -1) {
                        kws[existingIdx] = { ...annoKw };
                      } else {
                        kws.push({ ...annoKw });
                      }
                    }
                    updated[curIdx].keywords = kws;

                    // 🪷 Tự động in đậm từ khóa trong trình soạn thảo WYSIWYG nếu chưa in đậm
                    if (wysiwygEditorRef.current) {
                      const kwText = annoKw.keyword.trim();
                      const curHtml = wysiwygEditorRef.current.innerHTML;
                      const escaped = kwText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      const regex = new RegExp(`(?<!<b>|<strong>)(${escaped})(?!<\\/b>|<\\/strong>)`, 'gi');
                      if (regex.test(curHtml)) {
                        wysiwygEditorRef.current.innerHTML = curHtml.replace(regex, '<b>$1</b>');
                      }
                      // Đồng bộ lại markdown sau khi in đậm
                      const afterMd = getCurrentEditorMarkdown();
                      const afterExtracted = cleanAndExtractContent(afterMd, updated[curIdx]);
                      updated[curIdx].content = afterExtracted.cleanedContent;
                    }

                    showToast(`✨ Đã lưu chú thích: ${annoKw.keyword}!`);
                  } else if (annotationModal.tab === 'book' && annoBook.bookTitle.trim()) {
                    let books = Array.isArray(updated[curIdx].sourceBook)
                      ? [...(updated[curIdx].sourceBook as SourceBook[])]
                      : updated[curIdx].sourceBook
                        ? [updated[curIdx].sourceBook as SourceBook]
                        : [];
                    if (
                      annotationModal.editingIndex !== undefined &&
                      annotationModal.editingIndex !== null &&
                      annotationModal.editingIndex >= 0 &&
                      annotationModal.editingIndex < books.length
                    ) {
                      books[annotationModal.editingIndex] = { ...annoBook };
                    } else {
                      const searchTitle = (annotationModal.originalKey || annoBook.bookTitle).toLowerCase();
                      const existingBookIdx = books.findIndex((b) => b.bookTitle.toLowerCase() === searchTitle);
                      if (existingBookIdx !== -1) {
                        books[existingBookIdx] = { ...annoBook };
                      } else {
                        books.push({ ...annoBook });
                      }
                    }
                    updated[curIdx].sourceBook = books;
                    showToast(`📘 Đã lưu trích nguồn sách: ${annoBook.bookTitle}!`);
                  } else if (annotationModal.tab === 'author' && annoAuthor.name.trim()) {
                    updated[curIdx].author = annoAuthor.name;
                    if (annoAuthor.link) updated[curIdx].authorLink = annoAuthor.link;
                    showToast(`✍️ Đã cập nhật tác giả: ${annoAuthor.name}!`);
                  }

                  // Lưu draft vào LocalStorage an toàn
                  if (typeof window !== 'undefined' && wysiwygEditorRef.current) {
                    try {
                      const rowId = updated[curIdx]?.id || curIdx;
                      localStorage.setItem(`tong_chi_draft_${rowId}`, wysiwygEditorRef.current.innerHTML);
                    } catch (e) {
                      // ignore
                    }
                  }

                  setArticles(updated);
                  setIsDirty(true);
                  // Không tự động tắt popup để người dùng tiếp tục xem / thêm / chỉnh sửa mà không bị out
                  // setAnnotationModal(null);

                  // Lưu Backend
                  await saveArticlesToBackend(updated, true);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] border border-[#F2C14E] cursor-pointer shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center transition-all hover:scale-105"
                title="Lưu chú thích / Trích dẫn (Không tắt popup)"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 4. TRÌNH QUẢN LÝ TỆP S3 ĐÁM MÂY (S3 FILE EXPLORER) */}
      {/* ============================================================ */}
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
        initialPath="tong-chi-tu-hoc"
      />

      {/* ============================================================ */}
      {/* 🌟 5. MODAL TẢI ẢNH MỚI TỪ MÁY LÊN S3 */}
      {/* ============================================================ */}
      {insertImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-xl flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                  >
                    TẢI ẢNH MỚI VÀO BÀI VIẾT
                  </h3>
                  <p className="text-xs text-[#c9b896]">
                    Chọn file ảnh từ máy tính để tải lên S3 và chèn vào bài viết.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInsertImageModal(null)}
                className="p-2 rounded-full hover:bg-[#25170E] text-[#c9b896] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                  <span>1. Chọn file ảnh hoặc Nhập link *</span>
                  <label className="cursor-pointer text-[11px] text-[#F2C14E] hover:underline flex items-center gap-1">
                    {uploadingInlineImg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingInlineImg ? 'Đang tải lên S3...' : 'Tải file từ máy tính'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingInlineImg}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setUploadingInlineImg(true);
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.url) {
                              setInsertImageModal((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    url: data.url,
                                    caption: prev.caption || '',
                                  }
                                  : null
                              );
                              showToast('✅ Đã tải ảnh lên S3 thành công!');
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setUploadingInlineImg(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={insertImageModal.url}
                  onChange={(e) =>
                    setInsertImageModal({
                      ...insertImageModal,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://... hoặc đường dẫn ảnh"
                  className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#FFE5A3]">
                  2. Chú Thích / Mô Tả Ảnh (Caption - Cho phép chỉnh sửa trực tiếp)
                </label>
                <input
                  type="text"
                  value={insertImageModal.caption}
                  onChange={(e) =>
                    setInsertImageModal({
                      ...insertImageModal,
                      caption: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Sơ đồ cấu trúc bài học..."
                  className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setInsertImageModal(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Hủy bỏ"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={!insertImageModal.url}
                onClick={() => {
                  if (!insertImageModal.url) return;
                  insertImageToEditor(insertImageModal.url.trim(), insertImageModal.caption.trim());
                  setInsertImageModal(null);
                }}
                className={`px-6 py-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${insertImageModal.url
                    ? 'bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] shadow-[0_0_20px_rgba(242,193,78,0.4)] hover:scale-105'
                    : 'bg-[#2A1D14] text-[#c9b896]/40 cursor-not-allowed'
                  }`}
                title="Chèn ảnh vào bài viết"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 6. MODAL QUẢN LÝ ĐA PHƯƠNG TIỆN (BANNER, VIDEO, NỔI BẬT, BỘ ẢNH) */}
      {/* ============================================================ */}
      {mediaModal && mediaModal.rowIndex !== undefined && articles[mediaModal.rowIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(242,193,78,0.3)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3">
                <Film className="w-6 h-6 text-[#F2C14E]" />
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal"
                  >
                    QUẢN LÝ ĐA PHƯƠNG TIỆN (MEDIA)
                  </h3>
                  <p className="text-xs text-[#c9b896]/80 truncate max-w-md font-sans">
                    Bài viết: <span className="text-[#FFE5A3] font-bold">{articles[mediaModal.rowIndex].title}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="w-9 h-9 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (100% Vector SVG Icons với Hover Tooltip) */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4 shrink-0">
              <button
                type="button"
                onClick={() => setMediaModal({ ...mediaModal, tab: 'banner' })}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  mediaModal.tab === 'banner'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="1. Cài đặt Ảnh Banner / Đại diện"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMediaModal({ ...mediaModal, tab: 'video' })}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  mediaModal.tab === 'video'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="2. Cài đặt Video YouTube Minh Họa"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMediaModal({ ...mediaModal, tab: 'featured' })}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  mediaModal.tab === 'featured'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title="3. Cài đặt Bài Viết Nổi Bật"
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMediaModal({ ...mediaModal, tab: 'gallery' })}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center cursor-pointer relative ${
                  mediaModal.tab === 'gallery'
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-white'
                }`}
                title={`4. Bộ Sưu Tập Ảnh (${articles[mediaModal.rowIndex].photoGallery?.length || 0} ảnh)`}
              >
                <Images className="w-4 h-4" />
                {(articles[mediaModal.rowIndex].photoGallery?.length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {articles[mediaModal.rowIndex].photoGallery!.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 py-4 space-y-4">
              {/* TAB 1: BANNER */}
              {mediaModal.tab === 'banner' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Ảnh Banner / Đại Diện</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        {articles[mediaModal.rowIndex].bannerPosition || 'center (50%)'}
                      </span>
                    </div>

                    {articles[mediaModal.rowIndex].bannerImage ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh Banner lên S3...');
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) {
                              const updated = [...articles];
                              updated[mediaModal.rowIndex].bannerImage = url;
                              setArticles(updated);
                            }
                          }
                        }}
                        className="mt-2 space-y-3"
                      >
                        {/* 🌟 Interactive Image Drag with 3x3 Grid */}
                        <InteractiveImageDrag
                          imageUrl={articles[mediaModal.rowIndex].bannerImage}
                          position={articles[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...articles];
                            updated[mediaModal.rowIndex].bannerPosition = pos;
                            setArticles(updated);
                          }}
                          className="w-full h-60"
                        >
                          <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openS3Library((url) => {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].bannerImage = url;
                                  setArticles(updated);
                                });
                              }}
                              className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                              title="Đổi ảnh từ Thư Viện S3 (hoặc kéo thả file vào đây)"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...articles];
                                updated[mediaModal.rowIndex].bannerImage = '';
                                setArticles(updated);
                              }}
                              className="w-8 h-8 rounded-xl bg-red-800 hover:bg-red-700 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                              title="Gỡ ảnh này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </InteractiveImageDrag>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...articles];
                            updated[mediaModal.rowIndex].bannerImage = url;
                            setArticles(updated);
                          })
                        }
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh Banner lên S3...');
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) {
                              const updated = [...articles];
                              updated[mediaModal.rowIndex].bannerImage = url;
                              setArticles(updated);
                            }
                          }
                        }}
                        className="mt-2 border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all group"
                        title="Bấm để chọn ảnh Banner từ S3 hoặc thả file ảnh vào đây"
                      >
                        <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 group-hover:text-[#F2C14E] mx-auto mb-2" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh Banner từ S3 hoặc Thả ảnh vào đây</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>URL Banner</span>
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={articles[mediaModal.rowIndex].bannerImage || ''}
                        onChange={(e) => {
                          const updated = [...articles];
                          updated[mediaModal.rowIndex].bannerImage = e.target.value;
                          setArticles(updated);
                        }}
                        placeholder="https://..."
                        className="flex-1 px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...articles];
                            updated[mediaModal.rowIndex].bannerImage = url;
                            setArticles(updated);
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md shrink-0 hover:scale-105 transition-transform"
                        title="Mở Thư Viện S3"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO (TỰ ĐỘNG ĐIỀN KHI DÁN LINK YOUTUBE) */}
              {mediaModal.tab === 'video' && (
                <div className="space-y-4">
                  {/* Ô Dán Link YouTube Tối Giản */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Link YouTube</span>
                      </label>
                      {isFetchingMeta && (
                        <span className="text-[11px] text-[#F2C14E] flex items-center gap-1.5 animate-pulse font-medium">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Đang tải video...
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={articles[mediaModal.rowIndex].videoBlock?.videoUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = [...articles];
                        if (!updated[mediaModal.rowIndex].videoBlock) updated[mediaModal.rowIndex].videoBlock = {};
                        updated[mediaModal.rowIndex].videoBlock!.videoUrl = val;
                        setArticles(updated);
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted && (pasted.includes('youtube.com') || pasted.includes('youtu.be'))) {
                          setTimeout(() => handleAutoFetchYouTube(pasted), 50);
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 focus:border-[#F2C14E] rounded-xl text-xs text-white focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Tiêu Đề Video</span>
                      </label>
                      <input
                        type="text"
                        value={articles[mediaModal.rowIndex].videoBlock?.title || ''}
                        onChange={(e) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].videoBlock) updated[mediaModal.rowIndex].videoBlock = {};
                          updated[mediaModal.rowIndex].videoBlock!.title = e.target.value;
                          setArticles(updated);
                        }}
                        placeholder="Ví dụ: CUỘC ĐỜI VÀ ĐẠO NGHIỆP TỔ SƯ..."
                        className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Phụ Đề / Thể Loại</span>
                      </label>
                      <input
                        type="text"
                        value={articles[mediaModal.rowIndex].videoBlock?.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].videoBlock) updated[mediaModal.rowIndex].videoBlock = {};
                          updated[mediaModal.rowIndex].videoBlock!.subtitle = e.target.value;
                          setArticles(updated);
                        }}
                        placeholder="Ví dụ: Phim tài liệu / Pháp thoại"
                        className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Mô Tả Video</span>
                    </label>
                    <textarea
                      rows={3}
                      value={articles[mediaModal.rowIndex].videoBlock?.description || ''}
                      onChange={(e) => {
                        const updated = [...articles];
                        if (!updated[mediaModal.rowIndex].videoBlock) updated[mediaModal.rowIndex].videoBlock = {};
                        updated[mediaModal.rowIndex].videoBlock!.description = e.target.value;
                        setArticles(updated);
                      }}
                      placeholder="Nhập mô tả tóm tắt nội dung video..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURED ARTICLE (TỰ ĐỘNG ĐIỀN KHI DÁN LINK BÀI VIẾT) */}
              {mediaModal.tab === 'featured' && (
                <div className="space-y-4">
                  {/* Ô Dán Link Bài Viết Tối Giản */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Link Bài Viết Nổi Bật</span>
                      </label>
                      {isFetchingMeta && (
                        <span className="text-[11px] text-[#F2C14E] flex items-center gap-1.5 animate-pulse font-medium">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Đang tải bài viết...
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={articles[mediaModal.rowIndex].featuredArticle?.linkUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = [...articles];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.linkUrl = val;
                        setArticles(updated);
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted && pasted.startsWith('http')) {
                          setTimeout(() => handleAutoFetchFeatured(pasted), 50);
                        }
                      }}
                      placeholder="Dán link https://chuahoangphap.com.vn/... hoặc bài viết bất kỳ"
                      className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 focus:border-[#F2C14E] rounded-xl text-xs text-white focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Nhãn Nổi Bật</span>
                      </label>
                      <input
                        type="text"
                        value={articles[mediaModal.rowIndex].featuredArticle?.label || ''}
                        onChange={(e) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                          updated[mediaModal.rowIndex].featuredArticle!.label = e.target.value;
                          setArticles(updated);
                        }}
                        placeholder="Ví dụ: GIỚI THIỆU / BÀI VIẾT ĐẶC SẮC"
                        className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Tác Giả</span>
                      </label>
                      <input
                        type="text"
                        value={articles[mediaModal.rowIndex].featuredArticle?.author || ''}
                        onChange={(e) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                          updated[mediaModal.rowIndex].featuredArticle!.author = e.target.value;
                          setArticles(updated);
                        }}
                        placeholder="Sa Môn Vô Trí (Thích Tâm Hòa)..."
                        className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tiêu Đề Bài Viết</span>
                    </label>
                    <input
                      type="text"
                      value={articles[mediaModal.rowIndex].featuredArticle?.title || ''}
                      onChange={(e) => {
                        const updated = [...articles];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.title = e.target.value;
                        setArticles(updated);
                      }}
                      placeholder="Nhập tiêu đề bài viết nổi bật..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  {/* 🌟 ẢNH NỀN CARD BÀI VIẾT NỔI BẬT KÈM KÉO CHỈNH VÙNG TIÊU ĐIỂM */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Ảnh Nền Card Bài Viết Nổi Bật</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        {articles[mediaModal.rowIndex].featuredArticle?.bgPosition || 'center (50%)'}
                      </span>
                    </div>

                    {articles[mediaModal.rowIndex].featuredArticle?.bgImage ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh nền Card lên S3...');
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) {
                              const updated = [...articles];
                              if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                              updated[mediaModal.rowIndex].featuredArticle!.bgImage = url;
                              setArticles(updated);
                            }
                          }
                        }}
                        className="space-y-2"
                      >
                        <InteractiveImageDrag
                          imageUrl={articles[mediaModal.rowIndex].featuredArticle!.bgImage!}
                          position={articles[mediaModal.rowIndex].featuredArticle?.bgPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...articles];
                            if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                            updated[mediaModal.rowIndex].featuredArticle!.bgPosition = pos;
                            setArticles(updated);
                          }}
                          className="w-full h-44"
                        >
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-40">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openS3Library((url) => {
                                  const updated = [...articles];
                                  if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                                  updated[mediaModal.rowIndex].featuredArticle!.bgImage = url;
                                  setArticles(updated);
                                });
                              }}
                              className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                              title="Đổi ảnh nền từ Thư Viện S3 (hoặc kéo thả file vào đây)"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...articles];
                                if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                                updated[mediaModal.rowIndex].featuredArticle!.bgImage = '';
                                setArticles(updated);
                              }}
                              className="w-8 h-8 rounded-xl bg-red-800 hover:bg-red-700 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                              title="Gỡ ảnh nền"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </InteractiveImageDrag>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={articles[mediaModal.rowIndex].featuredArticle?.bgImage || ''}
                            onChange={(e) => {
                              const updated = [...articles];
                              if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                              updated[mediaModal.rowIndex].featuredArticle!.bgImage = e.target.value;
                              setArticles(updated);
                            }}
                            placeholder="https://... hoặc /images/..."
                            className="flex-1 px-3.5 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              openS3Library((url) => {
                                const updated = [...articles];
                                if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                                updated[mediaModal.rowIndex].featuredArticle!.bgImage = url;
                                setArticles(updated);
                              })
                            }
                            className="w-10 h-10 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md shrink-0 hover:scale-105 transition-transform"
                            title="Mở Thư Viện S3"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...articles];
                            if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                            updated[mediaModal.rowIndex].featuredArticle!.bgImage = url;
                            setArticles(updated);
                          })
                        }
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh nền Card lên S3...');
                            const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                            if (url) {
                              const updated = [...articles];
                              if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                              updated[mediaModal.rowIndex].featuredArticle!.bgImage = url;
                              setArticles(updated);
                            }
                          }
                        }}
                        className="border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all group"
                        title="Bấm để chọn ảnh nền Card từ S3 hoặc Thả file ảnh vào đây"
                      >
                        <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 group-hover:text-[#F2C14E] mx-auto mb-2" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh nền Card từ S3 hoặc Thả ảnh vào đây</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Link Chuyển Hướng</span>
                    </label>
                    <input
                      type="text"
                      value={articles[mediaModal.rowIndex].featuredArticle?.linkUrl || ''}
                      onChange={(e) => {
                        const updated = [...articles];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.linkUrl = e.target.value;
                        setArticles(updated);
                      }}
                      placeholder="/gioi-thieu/tieu-su-su-to hoặc https://..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PHOTO GALLERY */}
              {mediaModal.tab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Bộ Ảnh ({articles[mediaModal.rowIndex].photoGallery?.length || 0})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                          updated[mediaModal.rowIndex].photoGallery!.push({
                            title: 'Ảnh tư liệu mới',
                            imageUrl: url,
                            imagePosition: 'center 50%',
                            khuVuc: 'Tùng Lâm Hòa Phúc',
                            noiDung: 'Mô tả hình ảnh...',
                          });
                          setArticles(updated);
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md hover:scale-105 transition-transform"
                      title="Thêm ảnh mới từ Thư Viện S3"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {(!articles[mediaModal.rowIndex].photoGallery ||
                    articles[mediaModal.rowIndex].photoGallery!.length === 0) && (
                    <div
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...articles];
                          if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                          updated[mediaModal.rowIndex].photoGallery!.push({
                            title: 'Ảnh tư liệu mới',
                            imageUrl: url,
                            imagePosition: 'center 50%',
                            khuVuc: 'Tùng Lâm Hòa Phúc',
                            noiDung: 'Mô tả hình ảnh...',
                          });
                          setArticles(updated);
                        })
                      }
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
                              const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                              if (url) {
                                const updated = [...articles];
                                if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                                updated[mediaModal.rowIndex].photoGallery!.push({
                                  title: f.name.replace(/\.[^/.]+$/, ''),
                                  imageUrl: url,
                                  imagePosition: 'center 50%',
                                  khuVuc: 'Tùng Lâm Hòa Phúc',
                                  noiDung: 'Mô tả hình ảnh...',
                                });
                                setArticles(updated);
                              }
                            }
                          }
                        }
                      }}
                      className="border-2 border-dashed border-[#F2C14E]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#F2C14E] bg-[#25170E]/30 transition-all group"
                      title="Bấm để chọn ảnh từ S3 hoặc Thả nhiều ảnh vào đây"
                    >
                      <Images className="w-8 h-8 text-[#F2C14E]/50 group-hover:text-[#F2C14E] mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#FFE5A3]">Chọn ảnh từ S3 hoặc Thả nhiều file ảnh vào đây</p>
                    </div>
                  )}

                  {articles[mediaModal.rowIndex].photoGallery && articles[mediaModal.rowIndex].photoGallery!.length > 0 && (
                    <div className="space-y-3">
                      {articles[mediaModal.rowIndex].photoGallery!.map((item, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl flex flex-col sm:flex-row items-start gap-3.5 shadow-md"
                        >
                          <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const f = e.dataTransfer.files?.[0];
                              if (f && f.type.startsWith('image/')) {
                                showToast('⏳ Đang tải ảnh lên S3...');
                                const url = await uploadImageFileDirectly(f, 'tong-chi-tu-hoc');
                                if (url) {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].photoGallery![pIdx].imageUrl = url;
                                  setArticles(updated);
                                }
                              }
                            }}
                            className="w-full sm:w-32 h-32 shrink-0 bg-black/60 rounded-xl overflow-hidden border border-[#F2C14E]/40 relative"
                          >
                            {item.imageUrl ? (
                              <InteractiveImageDrag
                                imageUrl={item.imageUrl}
                                position={item.imagePosition || 'center 50%'}
                                onPositionChange={(pos) => {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].photoGallery![pIdx].imagePosition = pos;
                                  setArticles(updated);
                                }}
                                className="w-full h-full"
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openS3Library((url) => {
                                      const updated = [...articles];
                                      updated[mediaModal.rowIndex].photoGallery![pIdx].imageUrl = url;
                                      setArticles(updated);
                                    });
                                  }}
                                  className="absolute top-1.5 right-1.5 bg-[#F2C14E] hover:bg-[#ffde59] text-black p-1.5 rounded-lg shadow-md transition-all cursor-pointer z-40 hover:scale-105"
                                  title="Đổi ảnh này từ Thư Viện S3 (hoặc thả ảnh vào đây)"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                              </InteractiveImageDrag>
                            ) : (
                              <div
                                onClick={() =>
                                  openS3Library((url) => {
                                    const updated = [...articles];
                                    updated[mediaModal.rowIndex].photoGallery![pIdx].imageUrl = url;
                                    setArticles(updated);
                                  })
                                }
                                className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer bg-[#1C120A] hover:bg-[#25170E] transition-colors"
                                title="Bấm để chọn ảnh từ S3 hoặc thả ảnh vào đây"
                              >
                                <ImageIcon className="w-6 h-6 text-[#F2C14E]/70 mb-1" />
                                <span className="text-[10px] text-[#FFE5A3] font-bold">Chọn ảnh</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full space-y-2 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].photoGallery![pIdx].title = e.target.value;
                                  setArticles(updated);
                                }}
                                placeholder="Tiêu đề ảnh..."
                                className="px-3 py-2 bg-[#1C120A] border border-[#52331C] focus:border-[#F2C14E] rounded-xl text-white font-bold"
                              />
                              <input
                                type="text"
                                value={item.khuVuc || ''}
                                onChange={(e) => {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].photoGallery![pIdx].khuVuc = e.target.value;
                                  setArticles(updated);
                                }}
                                placeholder="Địa điểm / Khu vực..."
                                className="px-3 py-2 bg-[#1C120A] border border-[#52331C] focus:border-[#F2C14E] rounded-xl text-[#FFE5A3]"
                              />
                            </div>

                            {/* Trường URL Ảnh kèm nút đổi ảnh trực tiếp */}
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={item.imageUrl || ''}
                                onChange={(e) => {
                                  const updated = [...articles];
                                  updated[mediaModal.rowIndex].photoGallery![pIdx].imageUrl = e.target.value;
                                  setArticles(updated);
                                }}
                                placeholder="https://... đường dẫn ảnh"
                                className="flex-1 px-3 py-1.5 bg-[#1C120A] border border-[#52331C] focus:border-[#F2C14E] rounded-xl text-[11px] font-mono text-[#c9b896]"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  openS3Library((url) => {
                                    const updated = [...articles];
                                    updated[mediaModal.rowIndex].photoGallery![pIdx].imageUrl = url;
                                    setArticles(updated);
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/30 text-[11px] font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                                title="Đổi ảnh từ Thư Viện S3"
                              >
                                <FolderOpen className="w-3.5 h-3.5 inline mr-1" />
                                <span>Đổi ảnh</span>
                              </button>
                            </div>

                            <textarea
                              rows={2}
                              value={item.noiDung || ''}
                              onChange={(e) => {
                                const updated = [...articles];
                                updated[mediaModal.rowIndex].photoGallery![pIdx].noiDung = e.target.value;
                                setArticles(updated);
                              }}
                              placeholder="Nội dung mô tả bức ảnh..."
                              className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#52331C] focus:border-[#F2C14E] rounded-xl text-[#c9b896] resize-none text-xs"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...articles];
                              updated[mediaModal.rowIndex].photoGallery = updated[mediaModal.rowIndex].photoGallery!.filter((_, idx) => idx !== pIdx);
                              setArticles(updated);
                            }}
                            className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-800 text-red-300 hover:text-white transition-all cursor-pointer self-center sm:self-start hover:scale-105 shrink-0 shadow-sm"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  await saveArticlesToBackend(articles, false);
                  showToast('Đã lưu thay đổi đa phương tiện thành công!');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] border border-[#F2C14E] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(242,193,78,0.4)] cursor-pointer disabled:opacity-50 hover:scale-105"
                title="Lưu thay đổi đa phương tiện"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 7. MODAL XEM TRƯỚC & CHỈNH SỬA GIAO DIỆN (TRỰC QUAN) */}
      {/* ============================================================ */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] overflow-hidden">
            {/* Top Navigation Bar (Tối giản, tinh tế) */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#F2C14E]/30 bg-[#25170E] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shrink-0 shadow-sm">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="px-2.5 py-0.5 rounded-lg bg-[#3A2718] text-[#ffde59] text-xs font-bold border border-[#F2C14E]/40 shrink-0"
                  >
                    Xem trước
                  </span>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal truncate max-w-lg"
                  >
                    {previewModal.title || 'Chưa đặt tiêu đề'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewModal.slug && (
                  <button
                    type="button"
                    onClick={() => window.open(`/tong-chi-tu-hoc/${previewModal.slug}`, '_blank')}
                    className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                    title="Mở trên tab mới (Trang web thực tế)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="w-8 h-8 rounded-xl hover:bg-red-900/60 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Đóng xem trước"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Full Page Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1C120A]">
              {/* 1. HERO BANNER - CÓ THỂ KÉO THẢ TRỰC TIẾP TRÊN ẢNH VỚI LƯỚI 3x3 */}
              <HeroBanner
                bannerUrl={previewModal.bannerImage}
                bannerPosition={previewModal.bannerPosition}
                isEditable={true}
                onPositionChange={(newPos) => {
                  const updated = [...articles];
                  const idx = updated.findIndex((a) => a.id === previewModal.id);
                  if (idx !== -1) {
                    updated[idx].bannerPosition = newPos;
                    setArticles(updated);
                    setPreviewModal({ ...previewModal, bannerPosition: newPos });
                  }
                }}
                title={previewModal.title}
                subtitle={previewModal.subtitle}
              />

              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-16">
                {/* 2. INFOGRAPHIC ARTICLE / POEM RENDERER */}
                <section id="bai-tho" className="relative pt-2">
                  <InfographicArticleRenderer
                    rawContent={previewModal.content}
                    title={previewModal.title}
                    subtitle={previewModal.subtitle}
                    author={previewModal.author}
                    authorLink={previewModal.authorLink}
                    popups={previewModal.keywords}
                    onKeywordClick={(kwStr) => {
                      const kws = previewModal.keywords || [];
                      const found = kws.find((k) => k.keyword.toLowerCase() === kwStr.toLowerCase());
                      if (found) {
                        const artIdx = articles.findIndex((a) => a.id === previewModal.id);
                        setActivePreviewKeyword({
                          ...found,
                          _articleIndex: artIdx !== -1 ? artIdx : undefined,
                        });
                      }
                    }}
                  />
                </section>

                {/* 3. BOOK CITATION SECTION */}
                {previewModal.sourceBook && (
                  <BookCitationSection sourceBook={previewModal.sourceBook} />
                )}

                {/* 4. VIDEO BLOCK */}
                {previewModal.videoBlock?.videoUrl && (
                  <IllustrationVideo
                    heroBanner={previewModal.bannerImage}
                    videoBlock={previewModal.videoBlock}
                  />
                )}

                {/* 5. FEATURED POST */}
                {previewModal.featuredArticle?.title && (
                  <FeaturedPosts
                    heroBanner={previewModal.bannerImage}
                    featuredArticle={previewModal.featuredArticle}
                  />
                )}

                {/* 6. PHOTO GALLERY */}
                {previewModal.photoGallery && previewModal.photoGallery.length > 0 && (
                  <PhotoGallery
                    photoGallery={previewModal.photoGallery}
                    onSelectPhoto={() => { }}
                  />
                )}

                {/* 7. DISCOVER MORE */}
                <DiscoverMore
                  relatedArticles={articles
                    .filter((a) => a.id !== previewModal.id)
                    .slice(0, 3)
                    .map((a) => ({
                      category: a.categoryName || a.category,
                      title: a.title,
                      url: a.bannerImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
                      link: `/tong-chi-tu-hoc/${a.slug}`,
                    }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 5. POPUP XEM THỬ CHÚ THÍCH TỪ KHÓA TRONG PREVIEW MODE     */}
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
            {/* Header */}
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

            {/* Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
              {/* Title & Subtitle */}
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

              {/* Interactive Image Preview with live Position Drag */}
              {activePreviewKeyword.imageUrl && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#FFE5A3]/80">
                    <span className="font-semibold flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" /> Ảnh Chú Thích
                    </span>
                    <span className="text-[10px] text-[#F2C14E] font-medium">
                      (Kéo chuột trên ảnh để căn chỉnh khung hình)
                    </span>
                  </div>
                  <InteractiveImageDrag
                    imageUrl={activePreviewKeyword.imageUrl}
                    position={activePreviewKeyword.imagePosition || 'center 50%'}
                    onPositionChange={(newPos) => {
                      setActivePreviewKeyword((prev) => (prev ? { ...prev, imagePosition: newPos } : null));
                      if (activePreviewKeyword._articleIndex !== undefined && activePreviewKeyword._articleIndex >= 0) {
                        const updated = [...articles];
                        const artIdx = activePreviewKeyword._articleIndex;
                        if (updated[artIdx]?.keywords) {
                          const kws = [...updated[artIdx].keywords];
                          const kwIdx = kws.findIndex(
                            (k) => k.keyword.toLowerCase() === activePreviewKeyword.keyword.toLowerCase()
                          );
                          if (kwIdx !== -1) {
                            kws[kwIdx].imagePosition = newPos;
                            updated[artIdx].keywords = kws;
                            setArticles(updated);
                          }
                        }
                      }
                    }}
                    className="w-full h-44 sm:h-52 rounded-xl border border-[#F2C14E]/40 overflow-hidden shadow-inner"
                  />
                </div>
              )}

              {/* Description */}
              {activePreviewKeyword.description && (
                <div className="p-3.5 rounded-xl bg-[#25170E]/80 border border-[#F2C14E]/20">
                  <p className="text-xs sm:text-sm text-[#FFE5A3] leading-relaxed whitespace-pre-line">
                    {activePreviewKeyword.description}
                  </p>
                </div>
              )}

              {/* Link Button (Nếu có) */}
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

            {/* Footer */}
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
                  const existingIdx = articles[artIdx]?.keywords?.findIndex(
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

      {/* 🛡️ Modal Cảnh Báo Chưa Lưu (Zen Minimalist) */}
      <UnsavedChangesModal
        isOpen={unsavedModalOpen}
        saving={saving}
        onSave={async () => {
          await saveArticlesToBackend(articles, false);
          setUnsavedModalOpen(false);
          if (pendingNavigationAction) {
            pendingNavigationAction();
            setPendingNavigationAction(null);
          }
        }}
        onDiscard={() => {
          setIsDirty(false);
          setUnsavedModalOpen(false);
          if (pendingNavigationAction) {
            pendingNavigationAction();
            setPendingNavigationAction(null);
          }
        }}
        onCancel={() => {
          setUnsavedModalOpen(false);
          setPendingNavigationAction(null);
        }}
      />
    </div>
  );
}
