'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { AdminPagination, useAdminPagination } from '@/components/admin/AdminPagination';
import { useTableDragDrop, GripHandleIcon } from '@/components/admin/useTableDragDrop';
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
  Bell,
  Cloud,
  Star,
  Table as TableIcon,
  Globe,
  Camera,
  Crosshair,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

import ZenTipTapEditor from './ZenTipTapEditor';
import { S3FileExplorerModal } from './S3FileExplorerModal';
import { ImageFocalPositionerModal } from './ImageFocalPositionerModal';
import { PostRecord, KeywordItem, SourceBook, VideoBlock, FeaturedArticle, PhotoItem, RelatedEdition, UpcomingEvent } from '@/app/api/admin/posts/route';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
// Cac helper component tach rieng de de bao tri
import { InteractiveImageDrag, HOANG_PHAP_CATEGORIES } from './posts/ImageDragHelper';
import { CharCounter } from './CharCounter';

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

export function SpreadsheetPosts() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [savedRowId, setSavedRowId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = useRef(false);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filters & Search (Tối giản 1 dropdown & 1 ô tìm kiếm giống Tông Chỉ)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'views-desc' | 'views-asc'>('default');
  const [openingWpId, setOpeningWpId] = useState<string | null>(null);

  // 🌟 S3 File Explorer Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);
  const [activeArticleForMedia, setActiveArticleForMedia] = useState<{
    title: string;
    images: Array<{ imageUrl: string; title?: string }>;
  } | null>(null);

  // Trích xuất toàn bộ ảnh có sẵn trong bài viết (photoGallery, markdown, HTML, thumbnail, banner)
  const extractArticleImages = (post?: PostRecord | null): Array<{ imageUrl: string; title?: string }> => {
    if (!post) return [];
    const result: Array<{ imageUrl: string; title?: string }> = [];
    const seenUrls = new Set<string>();

    const addImg = (url?: string, title?: string) => {
      if (!url || typeof url !== 'string') return;
      const cleanUrl = url.trim();
      if (!cleanUrl || cleanUrl.startsWith('data:') || seenUrls.has(cleanUrl)) return;
      seenUrls.add(cleanUrl);
      result.push({ imageUrl: cleanUrl, title: title || '' });
    };

    // 1. Ảnh trong photoGallery
    if (Array.isArray(post.photoGallery)) {
      post.photoGallery.forEach((p, idx) => {
        addImg(p.imageUrl, p.title || p.noiDung || `Ảnh bộ sưu tập #${idx + 1}`);
      });
    }

    // 2. Ảnh trong content markdown (![alt](url))
    if (post.content) {
      const mdRegex = /!\[(.*?)\]\((.*?)\)/g;
      let match;
      while ((match = mdRegex.exec(post.content)) !== null) {
        addImg(match[2], match[1] || 'Ảnh trong bài');
      }
    }

    // 3. Ảnh trong contentHtml (<img src="...">)
    const htmlToScan = post.contentHtml || post.content || '';
    if (htmlToScan) {
      const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = htmlRegex.exec(htmlToScan)) !== null) {
        addImg(match[1], 'Ảnh trong bài viết');
      }
    }

    // 4. Banner & Thumbnail
    if (post.bannerUrl) addImg(post.bannerUrl, 'Banner hiện tại');
    if (post.thumbnailUrl) addImg(post.thumbnailUrl, 'Ảnh bìa (Thumbnail) hiện tại');

    return result;
  };

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

  // 🌟 Image Focal Positioner Modal State (Căn Tiêu Điểm Chống Mất Đầu/Mặt)
  const [focalModal, setFocalModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    imageUrl: string;
    initialPosition: string;
    field: 'thumbnailPosition' | 'bannerPosition';
    title: string;
  }>({
    isOpen: false,
    rowIndex: -1,
    imageUrl: '',
    initialPosition: '50% 20%',
    field: 'thumbnailPosition',
    title: '',
  });

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

  // 🌟 Kéo thả sắp xếp thứ tự ảnh (Trello-style Drag & Drop)
  const [draggedPhotoIdx, setDraggedPhotoIdx] = useState<number | null>(null);
  const [draggedOverPhotoIdx, setDraggedOverPhotoIdx] = useState<number | null>(null);

  // 🪷 Quản lý Kéo Thả Sắp Xếp Thứ Tự Bài Viết Trên Bảng Tính (Trello-style Table Drag & Drop)
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
    items: posts,
    setItems: setPosts,
    setIsDirty,
    onToast: showToast,
    getId: (p) => p.id,
  });

  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPhotoIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverPhotoIdx !== index) {
      setDraggedOverPhotoIdx(index);
    }
  };

  const handlePhotoDragLeave = (index: number) => {
    if (draggedOverPhotoIdx === index) {
      setDraggedOverPhotoIdx(null);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (mediaModal === null || draggedPhotoIdx === null || draggedPhotoIdx === targetIndex) {
      setDraggedPhotoIdx(null);
      setDraggedOverPhotoIdx(null);
      return;
    }

    const updated = [...posts];
    const gallery = [...(updated[mediaModal.rowIndex].photoGallery || [])];
    const [movedItem] = gallery.splice(draggedPhotoIdx, 1);
    gallery.splice(targetIndex, 0, movedItem);

    updated[mediaModal.rowIndex].photoGallery = gallery;
    setPosts(updated);
    setIsDirty(true);
    showToast(`✨ Đã đổi thứ tự ảnh: #${draggedPhotoIdx + 1} ➔ #${targetIndex + 1}!`);
    setDraggedPhotoIdx(null);
    setDraggedOverPhotoIdx(null);
  };

  const handlePhotoDragEnd = () => {
    setDraggedPhotoIdx(null);
    setDraggedOverPhotoIdx(null);
  };

  const handleMovePhoto = (fromIdx: number, toIdx: number) => {
    if (!mediaModal || toIdx < 0) return;
    const updated = [...posts];
    const gallery = [...(updated[mediaModal.rowIndex].photoGallery || [])];
    if (toIdx >= gallery.length) return;

    const [moved] = gallery.splice(fromIdx, 1);
    gallery.splice(toIdx, 0, moved);
    updated[mediaModal.rowIndex].photoGallery = gallery;
    setPosts(updated);
    setIsDirty(true);
  };

  // Fetch all posts from API
  // silent=true: chạy ngầm, không hiện spinner, không xóa trắng bảng (dùng khi quay lại từ tab Gutenberg)
  const fetchPosts = async (silent = false) => {
    // 🛡️ Nếu là silent refresh nền khi focus lại tab và người dùng đang sửa dở (isDirty): tuyệt đối không đè dữ liệu
    if (silent && isDirtyRef.current) {
      return;
    }

    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/admin/posts?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.posts) {
        // 🛡️ Phòng thủ: loại bỏ bản ghi trùng ID để React không báo "duplicate key"
        const uniqueMap = new Map<string, PostRecord>();
        for (const p of data.posts as PostRecord[]) {
          if (!uniqueMap.has(p.id)) uniqueMap.set(p.id, p);
        }
        const serverPosts = Array.from(uniqueMap.values());

        // 🛡️ Khôi phục bản nháp nếu trang vừa bị trình duyệt reload ngoài ý muốn
        try {
          const draftJson = typeof window !== 'undefined' ? localStorage.getItem('tunglam_admin_posts_draft') : null;
          if (draftJson && !silent) {
            const draft = JSON.parse(draftJson);
            if (draft && Array.isArray(draft.posts) && draft.posts.length > 0) {
              const serverIds = new Set(serverPosts.map((p) => p.id));
              const missingNewPosts = draft.posts.filter((p: any) => !serverIds.has(p.id));
              if (missingNewPosts.length > 0) {
                const merged = [...missingNewPosts, ...serverPosts];
                setPosts(merged);
                setIsDirty(true);
                isDirtyRef.current = true;
                showToast(`🛡️ Đã tự động khôi phục ${missingNewPosts.length} bài viết mới chưa lưu từ phiên trước!`);
                return;
              }
            }
          }
        } catch { }

        setPosts(serverPosts);
      }
    } catch {
      // Lỗi ngầm không hiện toast khi refresh nền
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const [syncingWp, setSyncingWp] = useState(false);

  // 🔄 Đồng bộ bài viết và phân loại ảnh từ WordPress tunglamhoaphuc.com
  const handleSyncWordPress = async () => {
    if (syncingWp) return;
    setSyncingWp(true);
    showToast('⚡ Đang đồng bộ bài viết & sao chép ảnh S3 từ WordPress tunglamhoaphuc.com...');
    try {
      const res = await fetch('/api/admin/sync-wp-posts', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Đã đồng bộ thành công ${data.syncedWpPosts} bài viết từ WordPress!`);
        await fetchPosts(true); // silent: không xóa bảng trong khi refresh
      } else {
        showToast(`❌ Lỗi đồng bộ: ${data.error}`);
      }
    } catch (err: any) {
      showToast(`❌ Lỗi kết nối: ${err.message}`);
    } finally {
      setSyncingWp(false);
    }
  };

  // Biến cờ ghi nhận khi người dùng vừa mở tab Gutenberg
  const hasOpenedGutenbergRef = useRef(false);

  useEffect(() => {
    fetchPosts();

    // 🌟 TỰ ĐỘNG CẬP NHẬT NGẦM THEO THỜI GIAN THỰC TỪ WORDPRESS:
    // 1. Khi quay lại cửa sổ (focus vào tab), tự động refresh ngầm nếu không có thay đổi chưa lưu
    const handleWindowFocus = () => {
      hasOpenedGutenbergRef.current = false;
      // 🛡️ CHỐNG MẤT BÀI: Nếu đang có thay đổi chưa lưu, tuyệt đối không tải đè từ máy chủ
      if (isDirtyRef.current) return;
      fetchPosts(true); // silent=true: không xóa bảng, không hiện spinner
    };

    // 2. Định kỳ mỗi 45 giây tự động đồng bộ ngầm để luôn hiển thị ngày và nội dung mới nhất từ WordPress
    const autoSyncInterval = setInterval(() => {
      if (!isDirtyRef.current) {
        fetchPosts(true);
      }
    }, 45000);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(autoSyncInterval);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Open S3 Library Helper
  const openS3Library = (
    callback: (url: string, caption?: string) => void,
    article?: PostRecord | null
  ) => {
    setTargetImageCallback(() => callback);
    if (article) {
      setActiveArticleForMedia({
        title: article.title,
        images: extractArticleImages(article),
      });
    } else {
      setActiveArticleForMedia(null);
    }
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

  // 💾 Core function lưu toàn bộ dữ liệu vào Backend (Tự động xuất bản 100%)
  const savePostsToBackend = async (postsToSave: PostRecord[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    // 🚀 Tối ưu: Loại bỏ contentHtml trước khi gửi lên server (tránh phình payload).
    // Giữ nguyên photoGallery có sẵn trên client để lưu cập nhật nếu có.
    const normalized = postsToSave.map(({ contentHtml: _ch, ...p }) => ({
      ...p,
      status: 'published' as const,
    }));

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(postsToSave); // Giữ nguyên state đầy đủ ở client (bao gồm photoGallery)
        setIsDirty(false);
        isDirtyRef.current = false;
        try { localStorage.removeItem('tunglam_admin_posts_draft'); } catch { }
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        if (!silent) showToast(`✅ Đã lưu thành công ${normalized.length} bài viết!`);
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi lưu bài viết');
      }
    } catch (err: any) {
      showToast(`Không thể kết nối đến máy chủ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 💾 Lưu riêng lẻ 1 dòng bài viết (PATCH /api/admin/posts/[id])
  const handleSaveRow = async (postId: string, rowData: PostRecord) => {
    if (savingRowId) return;
    setSavingRowId(postId);

    try {
      // 🚀 Tối ưu: Loại bỏ contentHtml trước khi gửi lên API để tránh payload quá lớn
      const { contentHtml: _ch, ...dataToSave } = rowData;

      const res = await fetch(`/api/admin/posts/${encodeURIComponent(postId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToSave,
          status: 'published',
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSavedRowId(postId);
        setTimeout(() => setSavedRowId((prev) => (prev === postId ? null : prev)), 2500);
        showToast(`✅ Đã lưu thành công bài viết: "${rowData.title || 'Không có tiêu đề'}"`);
      } else {
        showToast(`❌ Lỗi lưu bài viết: ${result.error || 'Thao tác thất bại'}`);
      }
    } catch (err: any) {
      showToast(`❌ Lỗi kết nối máy chủ: ${err.message}`);
    } finally {
      setSavingRowId(null);
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

  // 🌟 MỞ TRỰC TIẾP TRÌNH SOẠN THẢO WORDPRESS GUTENBERG (1-CLICK)
  const handleOpenGutenberg = async (row: PostRecord, index: number) => {
    // Luôn gọi qua API để xác minh bài có tồn tại trên admin.tunglamhoaphuc.com không.
    // Nếu wpPostId hợp lệ nhưng đã bị xóa trên WP → API sẽ tạo bài mới thay thế.
    // Không còn fast-path mở thẳng URL vì gây lỗi "mục không tồn tại".

    // Hiển thị trạng thái đang mở trong cell
    setOpeningWpId(row.id);
    const validWpId = row.wpPostId && !isNaN(Number(row.wpPostId)) && Number(row.wpPostId) > 0 ? Number(row.wpPostId) : null;
    showToast(validWpId
      ? `⚡ Đang xác minh bài viết #${validWpId} trên WordPress Gutenberg...`
      : '⚡ Đang khởi tạo bài viết mới trên WordPress Gutenberg...');

    // Mở tab với giao diện chờ trang nghiêm để chống popup blocker của trình duyệt
    const newTab = window.open('', '_blank');
    if (newTab) {
      try {
        newTab.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Khởi tạo WordPress Gutenberg...</title>
  <style>
    body {
      margin: 0;
      background: #140B05;
      color: #F2C14E;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .spin {
      width: 52px;
      height: 52px;
      border: 4px solid rgba(242,193,78,0.2);
      border-top-color: #F2C14E;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 24px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { margin: 0 0 10px; color: #ffde59; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    p { margin: 0; color: #d3c0ad; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="spin"></div>
  <h2>⚡ ĐANG KẾT NỐI WORDPRESS GUTENBERG...</h2>
  <p>Hệ thống đang chuẩn bị bài viết và phiên làm việc.<br>Trang soạn thảo sẽ tự động xuất hiện trong giây lát!</p>
</body>
</html>`);
        newTab.document.close();
      } catch (e) {
        // ignore
      }
    }

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.wpPostId,
          title: row.title || 'Bài viết mới',
          subtitle: row.subtitle || row.summary || '',
          content: (row as any).contentHtml || (row as any).content || row.summary || '',
          contentHtml: (row as any).contentHtml || '',
          summary: row.summary || row.subtitle || '',
          category: row.mainCategory || 'dong-chay-hoang-phap',
          postType: 'post',
          photoGallery: row.photoGallery || [],
        }),
      });
      const data = await res.json();
      const targetUrl = data.editUrl || 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';

      if (data.wpPostId && String(data.wpPostId) !== String(row.wpPostId)) {
        const updated = [...posts];
        updated[index].wpPostId = String(data.wpPostId);
        setPosts(updated);
        await savePostsToBackend(updated, true);
      }

      if (newTab && !newTab.closed) {
        newTab.location.replace(targetUrl);
      } else {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      hasOpenedGutenbergRef.current = true;
      showToast(
        data.success
          ? `✨ Đã mở bài viết #${data.wpPostId} trong WordPress Gutenberg!`
          : `⚠️ Đang mở trang soạn thảo WordPress Gutenberg...`
      );
    } catch (err: any) {
      const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
      if (newTab && !newTab.closed) {
        newTab.location.replace(fallbackUrl);
      } else {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
      showToast(`⚠️ Mở trang tạo bài mới WordPress Gutenberg...`);
    } finally {
      setOpeningWpId(null);
    }
  };

  // Thêm bài viết mới (Chuyên biệt cho Dòng Chảy Hoằng Pháp)
  const handleAddNewPost = async () => {
    const subCat = selectedCategory !== 'all' ? selectedCategory : 'cong-tu';
    const catName = HOANG_PHAP_CATEGORIES.find((c) => c.id === subCat)?.name.replace(/^\d+\.\s*/, '') || 'Cộng Tu';

    const newPost: PostRecord = {
      id: `post-${Date.now()}`,
      slug: `hoang-phap-${Date.now().toString().slice(-4)}`,
      title: 'Bài viết hoằng pháp mới',
      subtitle: 'Tùng Lâm Hòa Phúc',
      mainCategory: 'dong-chay-hoang-phap',
      subCategory: subCat,
      categoryName: catName,
      author: 'Ban Văn Hóa Tùng Lâm',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'published',
      viewsCount: 0,
      thumbnailUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: 'center 50%',
      bannerUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
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
    isDirtyRef.current = true;
    try {
      localStorage.setItem('tunglam_admin_posts_draft', JSON.stringify({
        timestamp: Date.now(),
        posts: updated.slice(0, 10),
      }));
    } catch { }

    showToast('⚡ Đang lưu bài viết mới vào hệ thống máy chủ...');

    // 🛡️ TỰ ĐỘNG LƯU TỨC THÌ LÊN MÁY CHỦ: Đảm bảo chuyển tab hoặc reload không bao giờ bị mất!
    try {
      await savePostsToBackend(updated, true);
      showToast('✨ Đã tạo và lưu bài viết mới thành công vào đầu bảng!');
    } catch {
      showToast('⚠️ Đã thêm bài mới, hãy nhấn nút Lưu (hoặc Ctrl+S)');
    }
  };

  // Xóa bài viết - Tức thời 0ms (Optimistic UI) + Đồng bộ ngầm máy chủ & S3 vĩnh viễn
  const handleDeletePost = async (target: PostRecord) => {
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${target.title}"?\n\nHành động này sẽ xóa vĩnh viễn khỏi hệ thống!`)) return;

    // ⚡ OPTIMISTIC UI: Xóa tức thì khỏi bảng tính trong 0ms ngay lần bấm đầu tiên
    setPosts((prev) => prev.filter((p) => p.id !== target.id));
    showToast(`🗑️ Đã xóa bài viết "${target.title}" thành công!`);

    try {
      let res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'DELETE',
      });
      let data = await res.json().catch(() => ({}));
      if (!data.success && res.status !== 404) {
        // Thử fallback sang query param nếu router dynamic param gặp sự cố
        res = await fetch(`/api/admin/posts?id=${encodeURIComponent(target.id)}`, {
          method: 'DELETE',
        });
        data = await res.json().catch(() => ({}));
      }

      // Nếu máy chủ báo lỗi thực sự (và không phải 404 do đã xóa xong), khôi phục lại bài viết
      if (!res.ok && res.status !== 404) {
        setPosts((prev) => [target, ...prev]);
        showToast(`❌ Không thể xóa trên máy chủ: ${data.error || 'Lỗi xử lý'}. Đã khôi phục.`);
      }
    } catch (err: any) {
      console.warn('Lỗi mạng khi xóa bài viết:', err);
      setPosts((prev) => [target, ...prev]);
      showToast(`❌ Không thể kết nối máy chủ: ${err.message}. Đã khôi phục.`);
    }
  };

  // Mở Media Modal - Tải ảnh tư liệu theo yêu cầu (on-demand 50ms) nếu bài viết chưa tải sẵn mảng photoGallery
  const handleOpenMediaModal = async (
    actualIdx: number,
    tab: 'banner' | 'video' | 'featured' | 'gallery' | 'editions' | 'events'
  ) => {
    const target = posts[actualIdx];
    if (!target) return;

    if ((tab === 'gallery' || tab === 'banner') && (!target.photoGallery || target.photoGallery.length === 0) && ((target as any).galleryCount || 0) > 0) {
      showToast(`⏳ Đang tải bộ sưu tập ảnh của "${target.title}"...`);
      try {
        const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`);
        const data = await res.json();
        if (data.success && data.post?.photoGallery) {
          setPosts((prev) => {
            const next = [...prev];
            next[actualIdx] = {
              ...next[actualIdx],
              photoGallery: data.post.photoGallery,
              galleryCount: data.post.photoGallery.length,
            };
            return next;
          });
        }
      } catch (err) {
        console.warn('Lỗi tải album ảnh:', err);
      }
    }

    setMediaModal({ isOpen: true, rowIndex: actualIdx, tab });
  };

  // Lưu Đa phương tiện tức thời (Banner, Thumbnail, Video, Album ảnh, v.v.)
  const handleSaveMediaModal = async (actualIdx: number) => {
    const target = posts[actualIdx];
    if (!target) return;
    showToast(`⏳ Đang lưu thiết lập ảnh bìa & đa phương tiện...`);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thumbnailUrl: target.thumbnailUrl,
          thumbnailPosition: target.thumbnailPosition,
          bannerUrl: target.bannerUrl,
          bannerPosition: target.bannerPosition,
          videoBlock: target.videoBlock,
          featuredArticle: target.featuredArticle,
          photoGallery: target.photoGallery,
          previousEditions: target.previousEditions,
          upcomingEvents: target.upcomingEvents,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Đã lưu thành công ảnh bìa & thumbnail của bài viết!`);
        setIsDirty(false);
      } else {
        showToast(`❌ Lỗi: ${data.error || 'Không xác định'}`);
      }
    } catch (e: any) {
      showToast(`❌ Lỗi kết nối: ${e.message}`);
    }
  };

  // Filtered Posts: Chỉ quản lý DÒNG CHẢY HOẰNG PHÁP
  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => {
      // 🌟 Chỉ hiển thị bài viết thuộc Dòng Chảy Hoằng Pháp
      if (p.mainCategory !== 'dong-chay-hoang-phap') return false;

      if (selectedCategory !== 'all') {
        if (p.subCategory !== selectedCategory) return false;
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

    if (sortBy === 'views-desc') {
      result = [...result].sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));
    } else if (sortBy === 'views-asc') {
      result = [...result].sort((a, b) => (Number(a.viewsCount) || 0) - (Number(b.viewsCount) || 0));
    }

    return result;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedPosts,
    startIndex,
    endIndex,
  } = useAdminPagination({
    items: filteredPosts,
    defaultPageSize: 20,
  });

  const hoangPhapCount = posts.filter((p) => p.mainCategory === 'dong-chay-hoang-phap').length;

  return (
    <div style={{ fontFamily: "'UTM Avo', sans-serif" }} className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] text-[#FFE5A3] font-bold text-xs shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-5 flex items-center gap-2.5 backdrop-blur-md">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header Toolbar (ICON-ONLY MINIMAL) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#25170E] p-4 rounded-2xl border border-[#F2C14E]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3A2718] border border-[#F2C14E]/50 flex items-center justify-center text-[#F2C14E] shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#ffde59] uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>Bảng Quản Trị Dòng Chảy Hoằng Pháp</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/40 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> S3 Sẵn Sàng
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#FFE5A3] text-[10px] font-bold border border-[#F2C14E]/40">
                {hoangPhapCount} Bài Viết
              </span>
            </h2>
            <p className="text-[11px] text-[#c9b896] flex items-center gap-1.5 flex-wrap">
              <span>Thời khóa cộng tu, khóa lễ truyền thống, đại lễ sự kiện &amp; tịnh độ nhân gian</span>
              <span>•</span>
              <span>Bấm ô &quot;Nội Dung&quot; mở Gutenberg</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                📐 Chuẩn thiết kế: Tiêu đề ≤ 80 kt | Sub ≤ 60 kt
              </span>
            </p>
          </div>
        </div>

        {/* ICON-ONLY BUTTONS */}
        <div className="flex items-center gap-2">
          {/* Nút 0: Quản Lý Tệp S3 Đám Mây */}
          <button
            type="button"
            onClick={() => {
              setTargetImageCallback(null);
              setActiveArticleForMedia(null);
              setImageLibraryOpen(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Mở Trình Quản Lý Tệp S3 Đám Mây (Cây Thư Mục & Quản Lý Ảnh)"
          >
            <Cloud className="w-5 h-5" />
          </button>

          {/* Nút 1: Thêm Bài Viết */}
          <button
            type="button"
            onClick={handleAddNewPost}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Thêm Bài Viết Mới vào Dòng Chảy Hoằng Pháp"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Nút 2: Tải lại */}
          <button
            type="button"
            onClick={() => fetchPosts()}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Tải lại dữ liệu bài viết"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Nút 2.5: Đồng bộ WordPress tunglamhoaphuc.com */}
          <button
            type="button"
            onClick={handleSyncWordPress}
            disabled={syncingWp}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Đồng bộ toàn bộ bài viết mới từ WordPress tunglamhoaphuc.com & sao chép ảnh S3"
          >
            {syncingWp ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
          </button>

          {/* Nút 3: Lưu Bảng Tính */}
          <button
            type="button"
            onClick={() => savePostsToBackend(posts, false)}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Lưu toàn bộ bài viết (Ctrl+S)"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề bài viết, tác giả hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-sm"
          />
        </div>

        {/* Dropdown Lọc Chuyên Mục Hoằng Pháp */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[220px]"
        >
          {HOANG_PHAP_CATEGORIES.map((c) => {
            const count =
              c.id === 'all'
                ? posts.filter((p) => p.mainCategory === 'dong-chay-hoang-phap').length
                : posts.filter((p) => p.mainCategory === 'dong-chay-hoang-phap' && p.subCategory === c.id).length;
            return (
              <option key={c.id} value={c.id}>
                {c.name} ({count})
              </option>
            );
          })}
        </select>

        {/* Dropdown Sắp Xếp Lượt Xem Đo Lường Thật */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[190px]"
        >
          <option value="default">Thứ tự mặc định (Kéo thả)</option>
          <option value="views-desc">👁️ Lượt xem cao nhất</option>
          <option value="views-asc">👁️ Lượt xem thấp nhất</option>
        </select>
      </div>

      {/* Excel Table Grid (Gọn Gàng Cốt Lõi) */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C120A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[78vh] custom-scrollbar">
          <table className="w-full border-collapse text-xs text-left min-w-[1100px] table-fixed">
            <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/40 select-none shadow-md">
              <tr>
                <th className="p-3 w-[55px] min-w-[55px] text-center border-r border-[#F2C14E]/20">#</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20 text-center">Chuyên Mục</th>
                <th className="p-3 w-[80px] min-w-[80px] text-center border-r border-[#F2C14E]/20">Ảnh Bìa</th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">
                  <div className="flex flex-col items-start gap-0.5">
                    <span>Tiêu Đề Bài Viết</span>
                    <span className="text-[9.5px] text-[#FFE5A3]/70 font-mono font-normal normal-case tracking-normal">Tối đa 80 ký tự</span>
                  </div>
                </th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">
                  <div className="flex flex-col items-start gap-0.5">
                    <span>Tiêu Đề Phụ</span>
                    <span className="text-[9.5px] text-[#FFE5A3]/70 font-mono font-normal normal-case tracking-normal">Tối đa 60 ký tự</span>
                  </div>
                </th>
                <th className="p-3 w-[190px] min-w-[190px] border-r border-[#F2C14E]/20">Tác Giả & Ngày</th>
                <th className="p-3 w-[110px] min-w-[110px] border-r border-[#F2C14E]/20 text-center" title="Lượt xem đo lường thực tế từ độc giả khi đọc bài">Lượt Xem</th>
                <th className="p-3 w-[140px] min-w-[140px] border-r border-[#F2C14E]/20 text-center">Đa Phương Tiện</th>
                <th
                  className="p-3 border-r border-[#F2C14E]/20 cursor-help"
                  title="Bấm vào từng ô để mở trực tiếp trong trình soạn thảo WordPress Gutenberg"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nội Dung Chi Tiết</span>
                    <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  </div>
                </th>
                <th className="p-3 w-[155px] min-w-[155px] text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/15">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[#c9b896]/70">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F2C14E]" />
                    <span>Đang tải dữ liệu bài viết...</span>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[#c9b896]/70">
                    Chưa có bài viết nào trong chuyên mục Hoằng Pháp này.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((row, filterIdx) => {
                  const targetIdx = posts.findIndex((p) => p.id === row.id);
                  const actualIdx = targetIdx !== -1 ? targetIdx : filterIdx;

                  const kwCount = row.keywords?.length || 0;
                  const galleryCount = (row as any).galleryCount ?? (row.photoGallery?.length || 0);
                  const hasVideo = Boolean(row.videoBlock?.videoUrl);
                  const hasBook = Boolean(row.sourceBook);
                  const hasFeatured = Boolean(row.featuredArticle?.title);
                  const publicUrl = `/dong-chay-hoang-phap/${row.slug}`;

                  const isDragged = String(row.id) === draggedId;
                  const isDragOver = String(row.id) === dragOverId;

                  return (
                    <tr
                      key={row.id || filterIdx}
                      onDragOver={(e) => handleDragOver(e, row.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, row.id)}
                      className={`transition-colors group focus-within:bg-[#2D1B0F] ${filterIdx % 2 === 0 ? 'bg-[#170E08]' : 'bg-[#120A05]'
                        } hover:bg-[#26160B] ${isDragged ? 'opacity-30 bg-[#352012] scale-[0.99]' : ''
                        } ${isDragOver && dropPosition === 'above'
                          ? 'border-t-2 border-[#ffde59] bg-[#321C0E] shadow-[0_-4px_12px_rgba(255,222,89,0.35)]'
                          : ''
                        } ${isDragOver && dropPosition === 'below'
                          ? 'border-b-2 border-[#ffde59] bg-[#321C0E] shadow-[0_4px_12px_rgba(255,222,89,0.35)]'
                          : ''
                        }`}
                    >
                      {/* 1. STT & KÉO THẢ SẮP XẾP */}
                      <td className="p-2 w-[55px] min-w-[55px] text-center font-mono font-bold text-[#F2C14E] border-r border-[#F2C14E]/15 bg-[#140D07]/60 align-middle select-none">
                        <div
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, row.id)}
                          onDragEnd={handleDragEnd}
                          title="Bấm giữ và kéo thả chuột để thay đổi vị trí bài viết (Trello-style)"
                          className="flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-[#3A2213] text-[#F2C14E]/70 hover:text-[#ffde59] transition-all hover:scale-105 group/grip"
                        >
                          <GripHandleIcon className="w-3.5 h-3.5 text-[#F2C14E]/60 group-hover/grip:text-[#ffde59] shrink-0" />
                          <span className="text-xs font-mono">{actualIdx + 1}</span>
                        </div>
                      </td>

                      {/* 2. Chuyên Mục Hoằng Pháp */}
                      <td className="p-2.5 w-[160px] min-w-[160px] border-r border-[#F2C14E]/15 align-middle">
                        <select
                          value={row.subCategory || 'cong-tu'}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[actualIdx].mainCategory = 'dong-chay-hoang-phap';
                            updated[actualIdx].subCategory = e.target.value;
                            const matched = HOANG_PHAP_CATEGORIES.find((c) => c.id === e.target.value);
                            if (matched) updated[actualIdx].categoryName = matched.name.replace(/^\d+\.\s*/, '');
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                          {HOANG_PHAP_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 3. Ảnh Bìa (Thumbnail & Hero) */}
                      <td className="p-2 w-[85px] min-w-[85px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="relative group/thumb inline-block">
                          <div
                            onClick={() => handleOpenMediaModal(actualIdx, 'banner')}
                            className="w-14 h-14 mx-auto rounded-xl overflow-hidden border border-[#52331C] hover:border-[#F2C14E] cursor-pointer bg-black/60 shadow-sm transition-all hover:scale-105 relative"
                            title="Bấm để mở cài đặt Ảnh Bìa Hero & Thumbnail bài viết"
                          >
                            <img
                              src={row.thumbnailUrl || row.bannerUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                              alt={row.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                              style={{ objectPosition: row.thumbnailPosition || row.bannerPosition || 'center 20%' }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-[#ffde59] font-bold">
                              Đổi
                            </div>
                          </div>

                          {/* 🎯 Nút Căn Chỉnh Tiêu Điểm Ảnh (Chống Mất Đầu/Mặt) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocalModal({
                                isOpen: true,
                                rowIndex: actualIdx,
                                imageUrl: row.thumbnailUrl || row.bannerUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
                                initialPosition: row.thumbnailPosition || '50% 20%',
                                field: 'thumbnailPosition',
                                title: `Căn Tiêu Điểm: ${row.title || 'Ảnh Thumbnail'}`,
                              });
                            }}
                            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#2A1810] border border-[#F2C14E] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-115 z-10"
                            title="🎯 Căn tiêu điểm ảnh Thumbnail (Chống mất đầu/mặt)"
                          >
                            <Crosshair className="w-3 h-3" />
                          </button>

                          {/* 📸 Nút Chọn Ảnh từ S3 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openS3Library((url) => {
                                const updated = [...posts];
                                updated[actualIdx].thumbnailUrl = url;
                                updated[actualIdx].bannerUrl = url;
                                setPosts(updated);
                                setIsDirty(true);
                                showToast('✨ Đã cập nhật ảnh từ S3!');
                              }, row);
                            }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F2C14E] text-black hover:bg-[#ffde59] flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-115 z-10"
                            title="Chọn nhanh từ Kho Ảnh S3"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 4. Tiêu Đề Bài Viết (Tối đa 80 ký tự - Chuẩn chống tràn Hero & Card) */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="w-full">
                          <textarea
                            rows={3}
                            maxLength={80}
                            value={row.title || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].title = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Nhập tiêu đề (tối đa 80 kt)..."
                            className={`w-full min-h-[64px] px-2.5 py-2 bg-[#22140A] border rounded-xl text-xs font-bold text-[#ffde59] uppercase focus:outline-none leading-snug transition-all resize-none shadow-sm flex items-center ${
                              (row.title?.length || 0) > 80
                                ? 'border-red-500 text-red-300 ring-1 ring-red-500'
                                : (row.title?.length || 0) >= 70
                                ? 'border-amber-400 focus:border-amber-400'
                                : 'border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E]'
                            }`}
                          />
                          <CharCounter
                            current={row.title?.length || 0}
                            max={80}
                            compact
                          />
                        </div>
                      </td>

                      {/* 5. Tiêu Đề Phụ (Tối đa 60 ký tự - Chuẩn 1 dòng duy nhất) */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="w-full">
                          <textarea
                            rows={3}
                            maxLength={60}
                            value={row.subtitle || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].subtitle = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Nhập lời tựa / phụ (tối đa 60 kt)..."
                            className={`w-full min-h-[64px] px-3 py-2 bg-[#22140A] border rounded-xl text-xs italic text-[#FFE5A3] focus:outline-none leading-relaxed transition-all resize-none shadow-sm flex items-center ${
                              (row.subtitle?.length || 0) > 60
                                ? 'border-red-500 text-red-300 ring-1 ring-red-500'
                                : (row.subtitle?.length || 0) >= 50
                                ? 'border-amber-400 focus:border-amber-400'
                                : 'border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E]'
                            }`}
                          />
                          <CharCounter
                            current={row.subtitle?.length || 0}
                            max={60}
                            compact
                          />
                        </div>
                      </td>

                      {/* 6. Tác Giả & Ngày Đăng */}
                      <td className="p-2.5 w-[200px] min-w-[200px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={row.author || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].author = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Tác giả / Người biên soạn..."
                            className="w-full px-2.5 py-1.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-medium focus:outline-none"
                          />
                          <input
                            type="text"
                            value={row.publishedDate || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].publishedDate = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Ngày đăng (VD: 07/10/2026)..."
                            className="w-full px-2.5 py-1.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-medium focus:outline-none transition-all"
                          />
                        </div>
                      </td>

                      {/* 6.5. Số Lượt Xem Thực Tế (Đo lường từ độc giả đọc bài) */}
                      <td className="p-2 w-[110px] min-w-[110px] border-r border-[#F2C14E]/15 align-middle text-center bg-[#170E08]/40">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span
                            title={`Lượt xem đo lường thực tế: ${typeof row.viewsCount === 'number' ? row.viewsCount.toLocaleString('vi-VN') : row.viewsCount || 0} lượt`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-mono text-xs font-bold shadow-sm group-hover:border-[#F2C14E]"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                            <span>
                              {typeof row.viewsCount === 'number'
                                ? row.viewsCount >= 10000
                                  ? `${(row.viewsCount / 1000).toFixed(1)}K`
                                  : row.viewsCount.toLocaleString('vi-VN')
                                : row.viewsCount || 0}
                            </span>
                          </span>
                          <span className="text-[10px] text-[#c9b896]/60 font-sans">
                            {typeof row.viewsCount === 'number' && row.viewsCount >= 10000
                              ? `(${row.viewsCount.toLocaleString('vi-VN')})`
                              : 'lượt đọc'}
                          </span>
                        </div>
                      </td>

                      {/* 6.6. Đa Phương Tiện */}
                      <td className="p-2.5 w-[140px] min-w-[140px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Video */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'video')}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${hasVideo
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                              }`}
                            title={hasVideo ? `Video: ${row.videoBlock?.title || 'Đã cài đặt video'}` : 'Quản lý Video Minh Họa'}
                          >
                            <Video className="w-4 h-4" />
                            {hasVideo && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                1
                              </span>
                            )}
                          </button>

                          {/* Nút Nổi Bật */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'featured')}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${hasFeatured
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                              }`}
                            title={hasFeatured ? `Nổi bật: ${row.featuredArticle?.title}` : 'Quản lý Bài Viết Nổi Bật'}
                          >
                            <Star className="w-4 h-4" />
                            {hasFeatured && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                1
                              </span>
                            )}
                          </button>

                          {/* Nút Album Ảnh */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'gallery')}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${galleryCount > 0
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

                      {/* 7. Nội Dung Chi Tiết (Soạn Thảo Trên Web hoặc Mở WordPress Gutenberg) */}
                      <td className="p-2.5 border-r border-[#F2C14E]/15 align-middle max-w-full overflow-hidden">
                        <div
                          className="w-full min-h-[72px] p-2.5 bg-[#22140A] hover:bg-[#2C1A0E] border border-[#52331C] hover:border-[#F2C14E] rounded-xl transition-all flex flex-col justify-between group/cell shadow-inner overflow-hidden relative"
                        >
                          <div
                            onClick={() => handleOpenGutenberg(row, actualIdx)}
                            className="cursor-pointer"
                            title="Bấm để mở trực tiếp trong trình soạn thảo WordPress Gutenberg"
                          >
                            <p className="text-xs text-[#F5EADB]/80 line-clamp-2 leading-relaxed truncate hover:text-[#ffde59] transition-colors">
                              {row.content
                                ? row.content.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                                : row.summary
                                  ? row.summary.slice(0, 140) + '...'
                                  : row.contentHtml
                                    ? row.contentHtml.replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                                    : 'Chưa có nội dung...'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#F2C14E]/15 text-[11px] text-[#F2C14E] overflow-hidden">
                            {/* Mở WordPress Gutenberg */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenGutenberg(row, actualIdx);
                              }}
                              className="flex items-center gap-1.5 font-bold text-[#F2C14E] hover:text-[#ffde59] px-2 py-0.5 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all cursor-pointer shadow-sm hover:scale-102"
                              title="Mở bài viết trực tiếp trong WordPress Gutenberg (1-Click)"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
                              <span className="text-[10px] font-semibold text-[#FFE5A3]">
                                {openingWpId === row.id
                                  ? 'Đang mở WP...'
                                  : row.wpPostId
                                    ? `Gutenberg #${row.wpPostId}`
                                    : 'Mở Gutenberg'}
                              </span>
                            </button>
                            <div className="flex items-center gap-1 text-[10px] text-[#c9b896]/75 shrink-0">
                              {kwCount > 0 && (
                                <span
                                  title={`${kwCount} chú thích từ khóa`}
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>{kwCount}</span>
                                </span>
                              )}
                              {hasBook && (
                                <span
                                  title="Nguồn sách tham khảo"
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>1</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 8. Thao Tác (Lưu dòng, Xem trước modal, Xem web tab mới, Xóa) */}
                      <td className="p-2 w-[155px] min-w-[155px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Lưu Riêng Từng Dòng */}
                          <button
                            type="button"
                            disabled={savingRowId === row.id}
                            onClick={() => handleSaveRow(row.id, row)}
                            className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 ${savedRowId === row.id
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : savingRowId === row.id
                                  ? 'bg-[#3A2718] border-[#F2C14E]/60 text-[#FFE5A3] opacity-80 cursor-wait'
                                  : 'bg-[#2A1D14] hover:bg-[#3A2718] border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#FFDE59]'
                              }`}
                            title={
                              savedRowId === row.id
                                ? 'Đã lưu bài viết thành công!'
                                : savingRowId === row.id
                                  ? 'Đang lưu bài viết...'
                                  : 'Lưu riêng bài viết này'
                            }
                          >
                            {savingRowId === row.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#F2C14E]" />
                            ) : savedRowId === row.id ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                          {/* Nút Xem Trước Modal */}
                          <button
                            type="button"
                            onClick={async () => {
                              let target = posts[actualIdx];
                              if ((!target.photoGallery || target.photoGallery.length === 0) && ((target as any).galleryCount || 0) > 0) {
                                try {
                                  const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`);
                                  const data = await res.json();
                                  if (data.success && data.post) {
                                    target = { ...target, ...data.post };
                                  }
                                } catch { }
                              }
                              setPreviewModal(target);
                            }}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xem trước bài viết (modal trực quan)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

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
                            onMouseDown={(e) => {
                              // Ngăn ngừa blur input/cell làm re-render hủy mất sự kiện click lần đầu
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(row);
                            }}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xóa bài viết này vĩnh viễn"
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

        {/* ── BẢNG ĐIỀU KHIỂN PHÂN TRANG (ADMIN PAGINATION BAR) ── */}
        <div className="mt-4 p-2">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50, 100, -1]}
            itemName="bài viết"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 4. TRÌNH SOẠN THẢO WYSIWYG TOÀN MÀN HÌNH (BIG EDITOR MODAL) */}
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
                  onOpenS3Explorer={() => {
                    openS3Library((url, caption) => {
                      insertImageToEditor(url, caption);
                    }, posts[bigEditor.rowIndex]);
                  }}
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
                { id: 'banner', label: '1. Banner Hero & Ảnh Bìa', icon: ImageIcon },
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${isActive
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
              {/* TAB 1: BANNER & THUMBNAIL */}
              {mediaModal.tab === 'banner' && (
                <div className="space-y-6">
                  {/* Khối Banner Hero Ngang */}
                  <div className="space-y-3 p-4 bg-[#21140B] rounded-2xl border border-[#F2C14E]/30">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#F2C14E]" />
                        <span>Ảnh Banner Hero Ngang (Tiêu Điểm Đầu Bài)</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        Vị trí: {posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                      </span>
                    </div>

                    {posts[mediaModal.rowIndex].bannerUrl ? (
                      <div className="space-y-3">
                        <InteractiveImageDrag
                          imageUrl={posts[mediaModal.rowIndex].bannerUrl!}
                          position={posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerPosition = pos;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full h-56"
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
                                  setIsDirty(true);
                                }, posts[mediaModal.rowIndex]);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer hover:scale-105"
                              title="Đổi ảnh từ S3"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Đổi từ S3</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].bannerUrl = '';
                                setPosts(updated);
                                setIsDirty(true);
                              }}
                              className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-800 text-red-200 shadow-md cursor-pointer hover:scale-105"
                              title="Gỡ ảnh Banner này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </InteractiveImageDrag>
                        <p className="text-[11px] text-[#c9b896]/70 italic text-center">
                          💡 Nhấp và kéo chuột trên ảnh để điều chỉnh trọng tâm hiển thị khung hình Banner
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerUrl = url;
                            setPosts(updated);
                            setIsDirty(true);
                          }, posts[mediaModal.rowIndex])
                        }
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f && f.type.startsWith('image/')) {
                            showToast('⏳ Đang tải ảnh Banner lên S3...');
                            const url = await uploadImageFileDirectly(f, '03-dong-chay-hoang-phap');
                            if (url) {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].bannerUrl = url;
                              setPosts(updated);
                              setIsDirty(true);
                            }
                          }
                        }}
                        className="border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all group"
                      >
                        <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 mx-auto mb-2" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Bấm vào đây để chọn ảnh Banner Hero từ S3 hoặc kéo thả file ảnh vào đây</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={posts[mediaModal.rowIndex].bannerUrl || ''}
                        onChange={(e) => {
                          const updated = [...posts];
                          updated[mediaModal.rowIndex].bannerUrl = e.target.value;
                          setPosts(updated);
                          setIsDirty(true);
                        }}
                        placeholder="Dán URL ảnh banner..."
                        className="flex-1 min-w-[200px] px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                      />
                      <label className="px-3 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Tải từ Máy Tính</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              showToast('⏳ Đang tải ảnh Banner lên S3...');
                              const url = await uploadImageFileDirectly(file, '03-dong-chay-hoang-phap');
                              if (url) {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].bannerUrl = url;
                                setPosts(updated);
                                setIsDirty(true);
                              }
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const banner = posts[mediaModal.rowIndex].bannerUrl;
                          if (banner) {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailUrl = banner;
                            updated[mediaModal.rowIndex].thumbnailPosition = posts[mediaModal.rowIndex].bannerPosition || 'center 50%';
                            setPosts(updated);
                            setIsDirty(true);
                            showToast('✅ Đã đồng bộ Banner sang Thumbnail!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-bold shrink-0 cursor-pointer"
                        title="Dùng luôn làm ảnh đại diện"
                      >
                        Dùng làm Thumbnail
                      </button>
                    </div>
                  </div>

                  {/* Khối Ảnh Đại Diện (Thumbnail) */}
                  <div className="space-y-3 p-4 bg-[#21140B] rounded-2xl border border-[#F2C14E]/30">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#F2C14E]" />
                        <span>Ảnh Đại Diện / Thumbnail (Hiển Thị Trong Danh Sách & Thẻ Bài Viết)</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        Vị trí: {posts[mediaModal.rowIndex].thumbnailPosition || 'center 50%'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-48 h-36 shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black relative shadow-lg">
                        <InteractiveImageDrag
                          imageUrl={posts[mediaModal.rowIndex].thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                          position={posts[mediaModal.rowIndex].thumbnailPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailPosition = pos;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={posts[mediaModal.rowIndex].thumbnailUrl || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailUrl = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Dán URL ảnh thumbnail..."
                          className="w-full px-3 py-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openS3Library((url) => {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].thumbnailUrl = url;
                                setPosts(updated);
                                setIsDirty(true);
                              }, posts[mediaModal.rowIndex])
                            }
                            className="px-3 py-2 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Chọn từ Kho S3</span>
                          </button>

                          {/* 🎯 Nút Căn Tiêu Điểm Thumbnail Nâng Cao */}
                          <button
                            type="button"
                            onClick={() => {
                              setFocalModal({
                                isOpen: true,
                                rowIndex: mediaModal.rowIndex,
                                imageUrl: posts[mediaModal.rowIndex].thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
                                initialPosition: posts[mediaModal.rowIndex].thumbnailPosition || '50% 20%',
                                field: 'thumbnailPosition',
                                title: `Căn Tiêu Điểm: ${posts[mediaModal.rowIndex].title || 'Ảnh Thumbnail'}`,
                              });
                            }}
                            className="px-3 py-2 rounded-xl bg-[#2A1810] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-black border border-[#F2C14E]/60 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                            title="Mở bộ căn chỉnh tiêu điểm nâng cao (Tránh mất đầu/mặt)"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                            <span>Căn Tiêu Điểm (Chống Mất Mặt)</span>
                          </button>

                          <label className="px-3 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                            <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
                            <span>Tải từ Máy Tính</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  showToast('⏳ Đang tải ảnh lên S3...');
                                  const url = await uploadImageFileDirectly(file, '03-dong-chay-hoang-phap');
                                  if (url) {
                                    const updated = [...posts];
                                    updated[mediaModal.rowIndex].thumbnailUrl = url;
                                    setPosts(updated);
                                    setIsDirty(true);
                                  }
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const thumb = posts[mediaModal.rowIndex].thumbnailUrl;
                              if (thumb) {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].bannerUrl = thumb;
                                updated[mediaModal.rowIndex].bannerPosition = posts[mediaModal.rowIndex].thumbnailPosition || 'center 50%';
                                setPosts(updated);
                                setIsDirty(true);
                                showToast('✅ Đã đồng bộ Thumbnail sang Banner!');
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-bold cursor-pointer"
                          >
                            Dùng làm Banner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút lưu riêng cho Banner & Thumbnail */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveMediaModal(mediaModal.rowIndex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-102"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Thiết Lập Ảnh Bìa</span>
                    </button>
                  </div>
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const target = posts[mediaModal.rowIndex];
                          if (!target) return;
                          showToast(`⏳ Đang lưu bộ ảnh "${target.title}"...`);
                          try {
                            const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                photoGallery: target.photoGallery || [],
                              }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              showToast(`✅ Đã lưu ${target.photoGallery?.length || 0} ảnh thành công!`);
                            } else {
                              showToast(`❌ Lỗi: ${data.error || 'Không xác định'}`);
                            }
                          } catch (e: any) {
                            showToast(`❌ Lỗi kết nối: ${e.message}`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#ffde59] text-[#1A120B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 cursor-pointer"
                        title="Lưu ngay thay đổi của bộ ảnh này"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Album</span>
                      </button>

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
                          }, posts[mediaModal.rowIndex])
                        }
                        className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md hover:scale-105"
                        title="Thêm ảnh mới từ S3 / Thư viện"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
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

                  {/* Thanh hướng dẫn Trello & Thống kê số lượng */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl text-[11px] text-[#FFE5A3]/90 shadow-inner">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-[#F2C14E] shrink-0" />
                      <span>Kéo thả từng thẻ ảnh để sắp xếp thứ tự hiển thị (Trello-style) hoặc bấm nút mũi tên nhanh.</span>
                    </div>
                    <span className="font-mono font-bold text-[#F2C14E] bg-[#2E1B10] px-2.5 py-0.5 rounded-lg border border-[#F2C14E]/35 shrink-0 self-start sm:self-auto">
                      Tổng số: {posts[mediaModal.rowIndex].photoGallery?.length || 0} ảnh
                    </span>
                  </div>

                  {/* Danh sách thẻ ảnh kéo thả (Trello-style Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                    {posts[mediaModal.rowIndex].photoGallery?.map((item, pIdx) => {
                      const gallery = posts[mediaModal.rowIndex].photoGallery || [];
                      const isDragging = draggedPhotoIdx === pIdx;
                      const isOver = draggedOverPhotoIdx === pIdx;

                      return (
                        <div
                          key={pIdx}
                          draggable
                          onDragStart={(e) => handlePhotoDragStart(e, pIdx)}
                          onDragOver={(e) => handlePhotoDragOver(e, pIdx)}
                          onDragLeave={() => handlePhotoDragLeave(pIdx)}
                          onDrop={(e) => handlePhotoDrop(e, pIdx)}
                          onDragEnd={handlePhotoDragEnd}
                          className={`p-3 bg-[#25170E] border rounded-2xl flex gap-3 relative group/card transition-all cursor-grab active:cursor-grabbing select-none ${isDragging
                              ? 'opacity-40 border-dashed border-[#F2C14E] scale-95'
                              : isOver
                                ? 'border-[#F2C14E] bg-[#382112] shadow-[0_0_15px_rgba(242,193,78,0.35)] ring-2 ring-[#F2C14E]/60 scale-[1.02]'
                                : 'border-[#F2C14E]/30 hover:border-[#F2C14E] hover:bg-[#2A1A10]'
                            }`}
                        >
                          {/* Nút tay cầm kéo thả & số thứ tự */}
                          <div className="flex flex-col items-center justify-between py-1 text-[#F2C14E]/60 hover:text-[#F2C14E] shrink-0">
                            <span
                              className="px-1.5 py-0.5 rounded-md bg-[#160D07] border border-[#F2C14E]/40 text-[#F2C14E] text-[10px] font-bold font-mono shadow-sm"
                              title={`Vị trí hiện tại: #${pIdx + 1}`}
                            >
                              #{pIdx + 1}
                            </span>

                            <span title="Giữ và kéo để đổi vị trí (Trello-style)">
                              <GripVertical className="w-4 h-4 my-auto cursor-grab active:cursor-grabbing" />
                            </span>

                            {/* Nút mũi tên dịch chuyển nhanh */}
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                disabled={pIdx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePhoto(pIdx, pIdx - 1);
                                }}
                                className="p-0.5 rounded bg-[#1A1009] hover:bg-[#3D2515] text-[#FFE5A3] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                title="Di chuyển lên trước"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={pIdx === gallery.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMovePhoto(pIdx, pIdx + 1);
                                }}
                                className="p-0.5 rounded bg-[#1A1009] hover:bg-[#3D2515] text-[#FFE5A3] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                title="Di chuyển ra sau"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Khung ảnh thumbnail */}
                          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black border border-[#F2C14E]/40 relative group/thumb">
                            <img src={item.imageUrl} alt={item.title || 'Ảnh'} className="w-full h-full object-cover pointer-events-none" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].photoGallery!.splice(pIdx, 1);
                                setPosts(updated);
                                setIsDirty(true);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-md bg-red-900/90 text-white hover:bg-red-700 transition-colors shadow-md"
                              title="Xóa ảnh này khỏi album"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Thông tin Tiêu đề & Mô tả ảnh */}
                          <div className="flex-1 space-y-1.5 text-xs">
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].photoGallery![pIdx].title = e.target.value;
                                setPosts(updated);
                                setIsDirty(true);
                              }}
                              placeholder="Tiêu đề ảnh..."
                              className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-[#F2C14E]"
                            />
                            <textarea
                              rows={2}
                              value={item.noiDung || ''}
                              onChange={(e) => {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].photoGallery![pIdx].noiDung = e.target.value;
                                setPosts(updated);
                                setIsDirty(true);
                              }}
                              placeholder="Chú thích ảnh chi tiết..."
                              className="w-full px-2.5 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs resize-none focus:outline-none focus:border-[#F2C14E]"
                            />
                          </div>
                        </div>
                      );
                    })}
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
                          thumbnailUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
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
                  <PhotoGallery photoGallery={previewModal.photoGallery} onSelectPhoto={() => { }} />
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
                      url: p.thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
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
          setActiveArticleForMedia(null);
        }}
        onSelectImage={(url, caption) => {
          if (targetImageCallback) {
            targetImageCallback(url, caption);
          } else {
            insertImageToEditor(url, caption);
          }
          setImageLibraryOpen(false);
          setTargetImageCallback(null);
          setActiveArticleForMedia(null);
        }}
        articleImages={activeArticleForMedia?.images}
        articleTitle={activeArticleForMedia?.title}
        initialPath="03-dong-chay-hoang-phap"
      />

      {/* 🎯 Image Focal Positioner Modal (Căn Tiêu Điểm Chống Mất Đầu/Mặt) */}
      <ImageFocalPositionerModal
        isOpen={focalModal.isOpen}
        imageUrl={focalModal.imageUrl}
        initialPosition={focalModal.initialPosition}
        title={focalModal.title}
        onSave={(newPos) => {
          if (focalModal.rowIndex >= 0) {
            const updated = [...posts];
            if (focalModal.field === 'thumbnailPosition') {
              updated[focalModal.rowIndex].thumbnailPosition = newPos;
            } else {
              updated[focalModal.rowIndex].bannerPosition = newPos;
            }
            setPosts(updated);
            setIsDirty(true);
            showToast(`🎯 Đã cập nhật tiêu điểm ảnh: ${newPos}. Bấm "Lưu Thay Đổi" để xuất bản!`);
          }
          setFocalModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setFocalModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
