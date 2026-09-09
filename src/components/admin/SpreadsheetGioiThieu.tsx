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
  Check,
  X,
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
  Clock,
  FileText,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Quote,
  Heading1,
  Heading2,
  Link as LinkIcon,
  RefreshCw,
  Loader2,
  Landmark,
  ShieldCheck,
  Building2,
  History,
  Scroll
} from 'lucide-react';

import ZenTipTapEditor from './ZenTipTapEditor';
import { S3FileExplorerModal } from './S3FileExplorerModal';
import { GioiThieuRecord, MilestoneItem } from '@/app/api/admin/gioi-thieu/route';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';

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

      {/* Grid 3x3 */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div />
      </div>

      {/* Tiêu điểm */}
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

// 🪷 Converter Markdown -> WYSIWYG HTML
function markdownToWysiwygHtml(raw: string): string {
  if (!raw) return '<p class="mb-5"><br></p>';
  let html = raw.replace(/&gt;/g, '>').replace(/&lt;/g, '<');

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

  html = html.replace(/^---$/gm, '\n\n<hr class="my-6 border-[#F2C14E]/30" />\n\n');
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<i>$1</i>');

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

// 🪷 Converter WYSIWYG HTML -> Markdown
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

  const brs = temp.querySelectorAll('br');
  brs.forEach((br) => {
    br.replaceWith(document.createTextNode('\n'));
  });

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

// 3 NHÓM CHỦ ĐỀ GIỚI THIỆU
const GIOI_THIEU_GROUPS = [
  { id: 'all', label: 'Tất Cả Chủ Đề', icon: Landmark },
  { id: 'lich-su-chua', label: '1. Lịch Sử Chùa & Đại Sự', icon: History },
  { id: 'nguoi-lien-quan', label: '2. Chư Tôn Đức & Tổ Sư', icon: User },
  { id: 'thanh-quy-van-hoa', label: '3. Thanh Quy & Văn Hóa', icon: ShieldCheck },
];

export function SpreadsheetGioiThieu() {
  const [topics, setTopics] = useState<GioiThieuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openingWpId, setOpeningWpId] = useState<string | null>(null);

  // S3 Library Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);

  // Big WYSIWYG Editor Modal
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

  const wysiwygEditorRef = useRef<HTMLDivElement>(null);

  // Media & Milestones Modal
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    tab: 'banner' | 'quote' | 'milestones' | 'gallery' | 'video' | 'book';
  } | null>(null);

  // Live Preview Modal
  const [previewModal, setPreviewModal] = useState<GioiThieuRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gioi-thieu');
      const data = await res.json();
      if (data.success && data.topics) {
        setTopics(data.topics);
      }
    } catch (err: any) {
      showToast(`Lỗi khi tải dữ liệu giới thiệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openS3Library = (callback: (url: string, caption?: string) => void) => {
    setTargetImageCallback(() => callback);
    setImageLibraryOpen(true);
  };

  const uploadImageFileDirectly = async (file: File, folderPath: string = 'gioi-thieu'): Promise<string | null> => {
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

  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          showToast('⏳ Đang tải ảnh lên S3...');
          const url = await uploadImageFileDirectly(file, 'gioi-thieu');
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
          e.preventDefault();
          document.execCommand('insertLineBreak');
          updateEditorSelectionAndFormat();
          return;
        }

        const textContent = blockElement.textContent?.trim() || '';
        if (!textContent) {
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
          e.preventDefault();
          document.execCommand('insertLineBreak');
          updateEditorSelectionAndFormat();
          return;
        }
      }
    }
  };

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

  const getCurrentEditorMarkdown = () => {
    if (wysiwygEditorRef.current) {
      return wysiwygHtmlToMarkdown(wysiwygEditorRef.current.innerHTML);
    }
    return bigEditor?.value || '';
  };

  const saveTopicsToBackend = async (topicsToSave: GioiThieuRecord[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/gioi-thieu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicsToSave),
      });
      const data = await res.json();
      if (data.success) {
        setTopics(topicsToSave);
        setIsDirty(false);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        if (!silent) showToast(`✅ Đã lưu thành công ${topicsToSave.length} chủ đề Giới Thiệu!`);
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi lưu');
      }
    } catch (err: any) {
      showToast(`Không thể kết nối máy chủ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (bigEditor && wysiwygEditorRef.current) {
          const md = getCurrentEditorMarkdown();
          const updated = [...topics];
          updated[bigEditor.rowIndex].content = md;
          setTopics(updated);
          setBigEditor((prev) => (prev ? { ...prev, value: md } : null));
          saveTopicsToBackend(updated, false);
        } else {
          saveTopicsToBackend(topics, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topics, bigEditor]);

  // 🌟 MỞ TRỰC TIẾP TRÌNH SOẠN THẢO WORDPRESS GUTENBERG (1-CLICK)
  const handleOpenGutenberg = async (row: GioiThieuRecord, index: number) => {
    setOpeningWpId(row.id);
    showToast('⚡ Đang kết nối WordPress và nạp nội dung bài viết vào Gutenberg...');

    // Mở tab trống trước để chống popup blocker của trình duyệt
    const newTab = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.wpPostId,
          title: row.title || 'Chủ đề Giới Thiệu Mới',
          subtitle: row.subtitle || row.overviewSummary || '',
          content: (row as any).contentHtml || (row as any).content || row.overviewSummary || row.subtitle || '',
          contentHtml: (row as any).contentHtml || '',
          summary: row.overviewSummary || row.subtitle || '',
          category: 'gioi-thieu',
          postType: 'post',
        }),
      });
      const data = await res.json();
      if (data.success && data.editUrl) {
        if (data.wpPostId && String(data.wpPostId) !== String(row.wpPostId)) {
          const updated = [...topics];
          updated[index].wpPostId = String(data.wpPostId);
          setTopics(updated);
          await saveTopicsToBackend(updated, true);
        }
        if (newTab) {
          newTab.location.href = data.editUrl;
        } else {
          window.open(data.editUrl, '_blank', 'noopener,noreferrer');
        }
        showToast('✨ Đã mở trình soạn thảo WordPress Gutenberg với đầy đủ nội dung bài viết!');
      } else {
        const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
        if (newTab) newTab.location.href = fallbackUrl;
        else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
      if (newTab) newTab.location.href = fallbackUrl;
      else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setOpeningWpId(null);
    }
  };

  const handleAddNewTopic = () => {
    const newTopic: GioiThieuRecord = {
      id: `gt-${Date.now()}`,
      slug: `chu-de-moi-${Date.now().toString().slice(-4)}`,
      title: 'Chủ đề giới thiệu mới',
      subtitle: 'Tùng Lâm Hòa Phúc',
      tag: 'Giới Thiệu Tông Phong',
      groupCategory: selectedGroup !== 'all' ? (selectedGroup as any) : 'lich-su-chua',
      groupCategoryName: selectedGroup === 'nguoi-lien-quan' ? 'Người Liên Quan' : selectedGroup === 'thanh-quy-van-hoa' ? 'Thanh Quy & Văn Hóa' : 'Lịch Sử Chùa',
      heroBanner: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      heroBannerPosition: 'center 50%',
      overviewSummary: 'Tổng quan chủ đề...',
      content: 'Nội dung chi tiết chủ đề...',
      quoteTitle: 'LỜI DẠY',
      quoteContent: ['Lời khai thị chánh niệm...'],
      quoteAuthor: 'Thượng tọa Thích Tâm Hòa',
      milestones: [],
      galleryImages: [],
      status: 'published',
      orderIndex: topics.length + 1,
    };

    const updated = [newTopic, ...topics];
    setTopics(updated);
    setIsDirty(true);
    showToast('✨ Đã thêm dòng chủ đề giới thiệu mới!');
  };

  const handleDeleteTopic = (index: number) => {
    const target = topics[index];
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chủ đề:\n"${target.title}"?`)) return;

    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
    setIsDirty(true);
    saveTopicsToBackend(updated, false);
    showToast(`🗑️ Đã xóa chủ đề "${target.title}"`);
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (selectedGroup !== 'all' && t.groupCategory !== selectedGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = t.title?.toLowerCase().includes(q);
        const mSubtitle = t.subtitle?.toLowerCase().includes(q);
        const mSum = t.overviewSummary?.toLowerCase().includes(q);
        const mContent = t.content?.toLowerCase().includes(q);
        if (!mTitle && !mSubtitle && !mSum && !mContent) return false;
      }
      return true;
    });
  }, [topics, selectedGroup, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#140D07] text-[#FFE5A3] p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#F2C14E] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-2xl bg-[#2A1D14] border-2 border-[#F2C14E] text-[#ffde59] text-xs sm:text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      {/* 🌟 1. TOOLBAR TINH GỌN (CHỈ DÙNG BIỂU TƯỢNG VÀ NÚT VUÔNG ĐỒNG BỘ) */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D1B10] border border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E] shadow-inner shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFE5A3] flex items-center gap-2">
              <span>Bảng Quản Trị Giới Thiệu Tông Phong & Bổn Tự</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] text-xs font-mono font-bold border border-[#F2C14E]/40">
                {topics.length} Chủ Đề
              </span>
            </h2>
            <p className="text-[11px] text-[#c9b896] flex items-center gap-1.5 flex-wrap">
              <span>Lịch sử chùa, Chư Tôn Đức & Tổ Sư, Thanh quy tu học</span>
              <span>•</span>
              <span>Bấm vào ô &quot;Nội Dung&quot; để mở trình soạn thảo</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Nút 0: Quản Lý Tệp S3 Đám Mây */}
          <button
            type="button"
            onClick={() => {
              setTargetImageCallback(null);
              setImageLibraryOpen(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Mở Trình Quản Lý Tệp S3 Đám Mây (Cây Thư Mục & Quản Lý Ảnh)"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Nút 1: Thêm Chủ Đề Mới */}
          <button
            type="button"
            onClick={handleAddNewTopic}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Thêm Chủ Đề Giới Thiệu Mới"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Nút 2: Tải lại */}
          <button
            type="button"
            onClick={fetchTopics}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Tải lại dữ liệu bài viết"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Nút 3: Lưu Bảng Tính */}
          <button
            type="button"
            onClick={() => saveTopicsToBackend(topics, false)}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Lưu toàn bộ bảng tính ngay (Ctrl+S)"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề chủ đề, nhân vật hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-sm"
          />
        </div>

        {/* Dropdown Lọc Phân Nhóm */}
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[240px]"
        >
          {GIOI_THIEU_GROUPS.map((grp) => {
            const count =
              grp.id === 'all'
                ? topics.length
                : topics.filter((t) => t.groupCategory === grp.id).length;
            return (
              <option key={grp.id} value={grp.id}>
                {grp.label} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* 🌟 2. BẢNG TÍNH SPREADSHEET 8 CỘT CHUẨN HÓA */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C120A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[78vh] custom-scrollbar">
          <table className="w-full border-collapse text-xs text-left min-w-[1100px] table-fixed">
            <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/40 select-none shadow-md">
              <tr>
                <th className="p-3 w-[45px] min-w-[45px] text-center border-r border-[#F2C14E]/20">#</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20 text-center">Phân Nhóm</th>
                <th className="p-3 w-[80px] min-w-[80px] text-center border-r border-[#F2C14E]/20">Ảnh Bìa</th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">Tiêu Đề Chủ Đề</th>
                <th className="p-3 w-[200px] min-w-[200px] border-r border-[#F2C14E]/20">Phụ Đề / Tác Giả</th>
                <th className="p-3 w-[140px] min-w-[140px] border-r border-[#F2C14E]/20 text-center">Đa Phương Tiện</th>
                <th
                  className="p-3 border-r border-[#F2C14E]/20 cursor-help"
                  title="Bấm vào từng ô để mở trình soạn thảo toàn màn hình"
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
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F2C14E]" />
                    <span>Đang tải danh mục giới thiệu...</span>
                  </td>
                </tr>
              ) : filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    Không có chủ đề nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((row, filterIdx) => {
                  const targetIdx = topics.findIndex((t) => t.id === row.id);
                  const origIndex = targetIdx !== -1 ? targetIdx : filterIdx;
                  const msCount = row.milestones?.length || 0;
                  const galleryCount = row.galleryImages?.length || 0;
                  const hasVideo = Boolean(row.videoBlock?.videoUrl);
                  const hasQuote = Boolean(row.quoteContent && row.quoteContent.length > 0);
                  const publicUrl = `/gioi-thieu/${row.slug}`;

                  return (
                    <tr
                      key={row.id || filterIdx}
                      className={`transition-colors group focus-within:bg-[#2D1B0F] ${
                        filterIdx % 2 === 0 ? 'bg-[#170E08]' : 'bg-[#120A05]'
                      } hover:bg-[#26160B]`}
                    >
                      {/* 1. STT */}
                      <td className="p-3 w-[45px] min-w-[45px] text-center font-mono font-bold text-[#F2C14E] border-r border-[#F2C14E]/15 bg-[#140D07]/60 align-middle">
                        {origIndex + 1}
                      </td>

                      {/* 2. Nhóm phân loại */}
                      <td className="p-2.5 w-[160px] min-w-[160px] border-r border-[#F2C14E]/15 align-middle">
                        <select
                          value={row.groupCategory}
                          onChange={(e) => {
                            const updated = [...topics];
                            updated[origIndex].groupCategory = e.target.value as any;
                            updated[origIndex].groupCategoryName =
                              e.target.value === 'nguoi-lien-quan'
                                ? 'Người Liên Quan'
                                : e.target.value === 'thanh-quy-van-hoa'
                                ? 'Thanh Quy & Văn Hóa'
                                : 'Lịch Sử Chùa';
                            setTopics(updated);
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                          <option value="lich-su-chua">1. Lịch Sử Chùa</option>
                          <option value="nguoi-lien-quan">2. Chư Tôn Đức</option>
                          <option value="thanh-quy-van-hoa">3. Thanh Quy</option>
                        </select>
                      </td>

                      {/* 3. Ảnh bìa */}
                      <td className="p-2 w-[80px] min-w-[80px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div
                          onClick={() =>
                            openS3Library((url) => {
                              const updated = [...topics];
                              updated[origIndex].heroBanner = url;
                              setTopics(updated);
                              setIsDirty(true);
                            })
                          }
                          className="relative w-14 h-12 mx-auto rounded-xl overflow-hidden border border-[#F2C14E]/40 hover:border-[#F2C14E] bg-black/60 cursor-pointer group/banner shadow-sm transition-all hover:scale-105"
                          title="Bấm để đổi ảnh banner từ S3"
                        >
                          <img
                            src={row.heroBanner || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                            alt="Banner"
                            style={{ objectPosition: row.heroBannerPosition || 'center 50%' }}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                            Sửa
                          </div>
                        </div>
                      </td>

                      {/* 4. Tiêu đề chủ đề */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <input
                          type="text"
                          value={row.title || ''}
                          onChange={(e) => {
                            const updated = [...topics];
                            updated[origIndex].title = e.target.value;
                            setTopics(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tiêu đề chủ đề..."
                          className="w-full px-2.5 py-2 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all shadow-sm"
                        />
                      </td>

                      {/* 5. Phụ đề / Tác giả */}
                      <td className="p-2.5 w-[200px] min-w-[200px] border-r border-[#F2C14E]/15 align-middle">
                        <input
                          type="text"
                          value={row.subtitle || row.quoteAuthor || ''}
                          onChange={(e) => {
                            const updated = [...topics];
                            updated[origIndex].subtitle = e.target.value;
                            setTopics(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Phụ đề / tác giả..."
                          className="w-full px-2.5 py-2 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] focus:outline-none transition-all shadow-sm"
                        />
                      </td>

                      {/* 6. Đa Phương Tiện & Niên Biểu (3 Nút Vector Chuẩn Hóa) */}
                      <td className="p-2.5 w-[140px] min-w-[140px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Video */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: origIndex, tab: 'video' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              hasVideo
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={hasVideo ? `Video: ${row.videoBlock?.title}` : 'Cài đặt Video tư liệu'}
                          >
                            <Video className="w-4 h-4" />
                            {hasVideo && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F2C14E] rounded-full animate-ping" />
                            )}
                          </button>

                          {/* Nút Niên Biểu */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: origIndex, tab: 'milestones' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              msCount > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={`Mốc niên biểu (${msCount} mốc)`}
                          >
                            <History className="w-4 h-4" />
                            {msCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {msCount}
                              </span>
                            )}
                          </button>

                          {/* Nút Album Ảnh */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: origIndex, tab: 'gallery' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              galleryCount > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={`Bộ sưu tập ảnh (${galleryCount} ảnh)`}
                          >
                            <Images className="w-4 h-4" />
                            {galleryCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {galleryCount}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 7. Nội Dung Chi Tiết (Bấm Mở Trực Tiếp WordPress Gutenberg) */}
                      <td className="p-2.5 border-r border-[#F2C14E]/15 align-middle max-w-full overflow-hidden">
                        <div
                          onClick={() => handleOpenGutenberg(row, origIndex)}
                          className="w-full min-h-[72px] p-2.5 bg-[#22140A] hover:bg-[#2C1A0E] border border-[#52331C] hover:border-[#F2C14E] rounded-xl cursor-pointer transition-all flex flex-col justify-between group/cell shadow-inner overflow-hidden"
                          title="Bấm vào để mở trực tiếp trong trình soạn thảo WordPress Gutenberg"
                        >
                          <p className="text-xs text-[#F5EADB]/80 line-clamp-2 leading-relaxed truncate">
                            {row.content
                              ? row.content.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : row.overviewSummary
                              ? row.overviewSummary.slice(0, 140) + '...'
                              : 'Chưa có nội dung...'}
                          </p>
                          <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#F2C14E]/15 text-[11px] text-[#F2C14E] overflow-hidden">
                            <span className="flex items-center gap-1.5 font-bold text-[#F2C14E] group-hover/cell:text-[#ffde59]">
                              {openingWpId === row.id ? (
                                <Loader2 className="w-3.5 h-3.5 shrink-0 text-[#F2C14E] animate-spin" />
                              ) : (
                                <Edit3 className="w-3.5 h-3.5 shrink-0 text-[#F2C14E]" />
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffde59]">
                                {openingWpId === row.id
                                  ? 'Đang mở WP...'
                                  : row.wpPostId
                                  ? `Gutenberg #${row.wpPostId}`
                                  : 'Mở Gutenberg'}
                              </span>
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-[#c9b896]/75 shrink-0">
                              {hasQuote && (
                                <span
                                  title="Có trích dẫn thiền môn"
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <Quote className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>Trích dẫn</span>
                                </span>
                              )}
                              {msCount > 0 && (
                                <span
                                  title={`${msCount} mốc niên biểu`}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <History className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>{msCount} mốc</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 8. Thao Tác (Xem Web Trực Tiếp & Xóa) */}
                      <td className="p-2 w-[85px] min-w-[85px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Xem Web Trực Tiếp */}
                          {row.slug ? (
                            <Link
                              href={publicUrl}
                              target="_blank"
                              className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer shadow-sm hover:scale-105"
                              title="Mở bài viết trên trang web chính thức (tab mới)"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <span className="p-2 rounded-xl bg-[#1A110A] border border-[#52331C]/30 text-[#6B5A4E] opacity-50 cursor-not-allowed">
                              <ExternalLink className="w-4 h-4" />
                            </span>
                          )}

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(origIndex)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xóa chủ đề này"
                          >
                            <Trash2 className="w-4 h-4" />
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
      {/* 🌟 5. MODAL QUẢN LÝ NIÊN BIỂU, LỜI DẠY, ĐA PHƯƠNG TIỆN      */}
      {/* ============================================================ */}
      {mediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
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
                    QUẢN LÝ NIÊN BIỂU, LỜI DẠY & MEDIA
                  </h3>
                  <p className="text-xs text-[#c9b896] truncate max-w-lg">
                    {topics[mediaModal.rowIndex]?.title}
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

            {/* Tabs Selector */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4 overflow-x-auto custom-scrollbar shrink-0">
              {[
                { id: 'banner', label: '1. Banner Hero', icon: ImageIcon },
                { id: 'quote', label: '2. Lời Dạy / Quote', icon: Quote },
                { id: 'milestones', label: '3. Niên Biểu / Dòng Thời Gian', icon: History },
                { id: 'gallery', label: '4. Album Ảnh Tư Liệu', icon: Images },
                { id: 'video', label: '5. Video Giới Thiệu', icon: Video },
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

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-2 pr-1">
              {/* TAB 1: BANNER */}
              {mediaModal.tab === 'banner' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                    <span>Ảnh Banner & Tiêu Điểm</span>
                    <span className="text-[11px] text-[#F2C14E] font-mono">
                      {topics[mediaModal.rowIndex].heroBannerPosition || 'center 50%'}
                    </span>
                  </div>

                  {topics[mediaModal.rowIndex].heroBanner ? (
                    <InteractiveImageDrag
                      imageUrl={topics[mediaModal.rowIndex].heroBanner}
                      position={topics[mediaModal.rowIndex].heroBannerPosition || 'center 50%'}
                      onPositionChange={(pos) => {
                        const updated = [...topics];
                        updated[mediaModal.rowIndex].heroBannerPosition = pos;
                        setTopics(updated);
                      }}
                      className="w-full h-60"
                    >
                      <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openS3Library((url) => {
                              const updated = [...topics];
                              updated[mediaModal.rowIndex].heroBanner = url;
                              setTopics(updated);
                            });
                          }}
                          className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black flex items-center justify-center shadow-md cursor-pointer hover:scale-105"
                          title="Đổi ảnh từ S3"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </InteractiveImageDrag>
                  ) : (
                    <div
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...topics];
                          updated[mediaModal.rowIndex].heroBanner = url;
                          setTopics(updated);
                        })
                      }
                      className="border-2 border-dashed border-[#F2C14E]/40 rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all"
                    >
                      <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#FFE5A3]">Bấm để chọn ảnh Banner từ S3</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: QUOTE */}
              {mediaModal.tab === 'quote' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3]">Tiêu Đề Lời Dạy / Pháp Ngữ</label>
                    <input
                      type="text"
                      value={topics[mediaModal.rowIndex].quoteTitle || ''}
                      onChange={(e) => {
                        const updated = [...topics];
                        updated[mediaModal.rowIndex].quoteTitle = e.target.value;
                        setTopics(updated);
                      }}
                      placeholder="LỜI DẠY CỦA SƯ TỔ / PHÁP NGỮ SƯ PHỤ..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3]">Nội Dung Lời Dạy (Mỗi dòng một câu)</label>
                    <textarea
                      rows={4}
                      value={topics[mediaModal.rowIndex].quoteContent?.join('\n') || ''}
                      onChange={(e) => {
                        const updated = [...topics];
                        updated[mediaModal.rowIndex].quoteContent = e.target.value.split('\n');
                        setTopics(updated);
                      }}
                      placeholder="Câu 1...&#10;Câu 2...&#10;Câu 3..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3]">Tác Giả Lời Dạy</label>
                    <input
                      type="text"
                      value={topics[mediaModal.rowIndex].quoteAuthor || ''}
                      onChange={(e) => {
                        const updated = [...topics];
                        updated[mediaModal.rowIndex].quoteAuthor = e.target.value;
                        setTopics(updated);
                      }}
                      placeholder="Thượng tọa Thích Tâm Hòa..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MILESTONES (NIÊN BIỂU LỊCH SỬ) */}
              {mediaModal.tab === 'milestones' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Niên Biểu & Dòng Thời Gian Lịch Sử</span>
                      </h4>
                      <p className="text-[11px] text-[#c9b896]/70">
                        Ghi dấu các mốc son lịch sử trọng đại, năm đại trùng tu, tôn tượng...
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...topics];
                        if (!updated[mediaModal.rowIndex].milestones) {
                          updated[mediaModal.rowIndex].milestones = [];
                        }
                        updated[mediaModal.rowIndex].milestones!.push({
                          year: 'Năm ...',
                          title: 'Mốc son mới',
                          description: 'Mô tả chi tiết sự kiện lịch sử...',
                        });
                        setTopics(updated);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F2C14E] text-[#140D07] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Thêm Mốc Lịch Sử</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topics[mediaModal.rowIndex].milestones?.map((ms, msIdx) => (
                      <div key={msIdx} className="p-4 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <input
                              type="text"
                              value={ms.year}
                              onChange={(e) => {
                                const updated = [...topics];
                                updated[mediaModal.rowIndex].milestones![msIdx].year = e.target.value;
                                setTopics(updated);
                              }}
                              placeholder="Năm: 2008 / Thời Cổ Tự..."
                              className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#F2C14E] text-xs font-bold font-mono"
                            />
                            <input
                              type="text"
                              value={ms.title}
                              onChange={(e) => {
                                const updated = [...topics];
                                updated[mediaModal.rowIndex].milestones![msIdx].title = e.target.value;
                                setTopics(updated);
                              }}
                              placeholder="Tiêu đề mốc son..."
                              className="sm:col-span-2 px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white text-xs font-bold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...topics];
                              updated[mediaModal.rowIndex].milestones!.splice(msIdx, 1);
                              setTopics(updated);
                            }}
                            className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-200 shrink-0"
                            title="Xóa mốc này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={ms.description}
                          onChange={(e) => {
                            const updated = [...topics];
                            updated[mediaModal.rowIndex].milestones![msIdx].description = e.target.value;
                            setTopics(updated);
                          }}
                          placeholder="Mô tả sự kiện chi tiết..."
                          className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY */}
              {mediaModal.tab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFE5A3]">
                      Album Ảnh Tư Liệu ({topics[mediaModal.rowIndex].galleryImages?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openS3Library((url) => {
                          const updated = [...topics];
                          if (!updated[mediaModal.rowIndex].galleryImages) {
                            updated[mediaModal.rowIndex].galleryImages = [];
                          }
                          updated[mediaModal.rowIndex].galleryImages!.push({
                            url,
                            caption: 'Ảnh tư liệu Tùng Lâm...',
                          });
                          setTopics(updated);
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md hover:scale-105"
                      title="Thêm ảnh từ S3"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topics[mediaModal.rowIndex].galleryImages?.map((img, iIdx) => (
                      <div key={iIdx} className="p-3 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl flex gap-3">
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black border border-[#F2C14E]/40 relative">
                          <img src={img.url} alt="Ảnh" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...topics];
                              updated[mediaModal.rowIndex].galleryImages!.splice(iIdx, 1);
                              setTopics(updated);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-red-900/80 text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={img.caption || ''}
                            onChange={(e) => {
                              const updated = [...topics];
                              updated[mediaModal.rowIndex].galleryImages![iIdx].caption = e.target.value;
                              setTopics(updated);
                            }}
                            placeholder="Chú thích ảnh..."
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: VIDEO */}
              {mediaModal.tab === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3]">Link Video (Youtube / S3)</label>
                    <input
                      type="text"
                      value={topics[mediaModal.rowIndex].videoBlock?.videoUrl || ''}
                      onChange={(e) => {
                        const updated = [...topics];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.videoUrl = e.target.value;
                        setTopics(updated);
                      }}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
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
                  await saveTopicsToBackend(topics, false);
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
      {/* 🌟 6. MODAL XEM TRƯỚC TRỰC QUAN (LIVE PREVIEW)                */}
      {/* ============================================================ */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#F2C14E]/30 bg-[#25170E] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59]">
                  <Eye className="w-4 h-4" />
                </div>
                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal truncate max-w-lg"
                >
                  {previewModal.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewModal.slug && (
                  <button
                    type="button"
                    onClick={() => window.open(`/gioi-thieu/${previewModal.slug}`, '_blank')}
                    className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
                    title="Mở trang web thật"
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

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1C120A]">
              <HeroBanner
                bannerUrl={previewModal.heroBanner}
                bannerPosition={previewModal.heroBannerPosition || 'center 50%'}
                title={previewModal.title}
                subtitle={previewModal.subtitle}
              />

              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
                {/* Overview */}
                {previewModal.overviewSummary && (
                  <div className="p-6 rounded-3xl bg-[#25170E]/80 border border-[#F2C14E]/30 leading-relaxed text-[#FFE5A3] text-sm sm:text-base italic">
                    {previewModal.overviewSummary}
                  </div>
                )}

                {/* Quote block */}
                {previewModal.quoteContent && previewModal.quoteContent.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3A2718] to-[#25170E] border-l-4 border-[#F2C14E] space-y-3">
                    <span className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider">
                      {previewModal.quoteTitle || 'LỜI DẠY'}
                    </span>
                    <div className="space-y-1.5">
                      {previewModal.quoteContent.map((q, qIdx) => (
                        <p key={qIdx} className="text-base sm:text-lg font-serif italic text-white leading-relaxed">
                          "{q}"
                        </p>
                      ))}
                    </div>
                    {previewModal.quoteAuthor && (
                      <p className="text-xs font-bold text-[#FFE5A3] text-right pt-2">
                        — {previewModal.quoteAuthor}
                      </p>
                    )}
                  </div>
                )}

                {/* Milestones timeline */}
                {previewModal.milestones && previewModal.milestones.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#F2C14E]/30 pb-3">
                      <History className="w-5 h-5 text-[#F2C14E]" />
                      <h3
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                        className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal"
                      >
                        DÒNG THỜI GIAN LỊCH SỬ (NIÊN BIỂU)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewModal.milestones.map((ms, msIdx) => (
                        <div key={msIdx} className="p-5 rounded-2xl bg-[#1C120A] border border-[#F2C14E]/30 space-y-2">
                          <span className="text-xs font-bold font-mono text-[#F2C14E] uppercase">{ms.year}</span>
                          <h4 className="text-base font-bold text-white">{ms.title}</h4>
                          <p className="text-xs text-[#FFE5A3]/90 leading-relaxed">{ms.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <InfographicArticleRenderer
                  rawContent={previewModal.content || ''}
                  title={previewModal.title}
                  subtitle={previewModal.subtitle}
                />

                {/* Photo Gallery */}
                {previewModal.galleryImages && previewModal.galleryImages.length > 0 && (
                  <PhotoGallery
                    photoGallery={previewModal.galleryImages.map((g) => ({
                      title: g.caption,
                      imageUrl: g.url,
                      imagePosition: 'center 50%',
                    }))}
                    onSelectPhoto={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* S3 Library */}
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
        initialPath="gioi-thieu"
      />
    </div>
  );
}
