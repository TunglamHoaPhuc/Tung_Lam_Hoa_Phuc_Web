'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Loader2,
  Crosshair,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  List,
  FileText,
  BookmarkPlus,
  Columns,
  Edit3,
  BookOpen,
  Layers,
  Search,
  Check,
  RefreshCw,
} from 'lucide-react';
import { KeywordTooltipModal } from '@/components/tong-chi-tu-hoc/KeywordTooltipModal';
import { UnsavedChangesModal } from '@/components/admin/UnsavedChangesModal';
import { ImageFocalPositionerModal } from '@/components/admin/ImageFocalPositionerModal';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { WordPressMediaModal, WordPressMediaItem } from '@/components/admin/WordPressMediaModal';

interface KeywordItem {
  keyword: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  description: string;
  linkUrl?: string;
}

interface TongChiEditorProps {
  initialData?: any;
  isEdit?: boolean;
}

const CATEGORIES = [
  { id: 'tong-phong-truyen-thua', name: 'TÔNG PHONG TRUYỀN THỪA' },
  { id: 'nen-tang-tu-hoc', name: 'NỀN TẢNG TU HỌC' },
  { id: 'phuong-phap-hanh-tri', name: 'PHƯƠNG PHÁP HÀNH TRÌ' },
  { id: 'lo-trinh-tu-hoc', name: 'LỘ TRÌNH TU HỌC' },
  { id: 'nep-song-thien-gia', name: 'NẾP SỐNG THIỀN GIA' },
  { id: 'thanh-quy-thien-mon', name: 'THANH QUY THIỀN MÔN' },
  { id: 'kinh-ke-phap-bao', name: 'KINH KỆ & PHÁP BẢO' },
];

// 🪷 Parser biến mã HTML WordPress Gutenberg thành Markdown/Clean format chuẩn cho InfographicArticleRenderer
function convertWpHtmlToCleanContent(wpRawHtml: string): { cleanedContent: string; extractedSubtitle?: string } {
  if (!wpRawHtml) return { cleanedContent: '' };

  let html = wpRawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // 1. Bóc tách thẻ phụ (Subtitle)
  let extractedSubtitle: string | undefined = undefined;
  const firstP = html.match(/^<p[^>]*>(?:<em><strong>|<strong><em>|<em>|<strong>)([\s\S]*?)(?:<\/strong><\/em>|<\/em><\/strong>|<\/em>|<\/strong>)<\/p>/i);
  if (firstP) {
    const rawSub = firstP[1].replace(/<[^>]+>/g, '').trim();
    if (rawSub.length > 0 && rawSub.length < 80 && !rawSub.includes('“') && !rawSub.includes('”')) {
      extractedSubtitle = rawSub;
      html = html.replace(firstP[0], '');
    }
  }

  // 2. Headings
  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').trim();
    return `\n\n### ${cleanText}\n\n`;
  });

  // 3. Blockquotes chuẩn của WordPress Gutenberg
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l: string) => `> ${l}`);
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  // 4. Khối Hình Ảnh WordPress Gutenberg (<figure>...<img ...>...<figcaption>...</figcaption>...</figure>)
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const src = srcMatch ? srcMatch[1] : '';
    const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    if (!src) return '';
    return `\n\n![${caption}](${src})\n\n`;
  });

  // 5. Ảnh thông thường dạng standalone <img>
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // 6. HR (Loại bỏ hoàn toàn)
  html = html.replace(/<hr[^>]*\/?>/gi, '\n\n');

  // 7. Quotes dạng đoạn văn in đậm có ngoặc kép
  html = html.replace(/<p[^>]*><strong><em>[“"”]?([\s\S]*?)[”"”]?<\/em><\/strong><\/p>/gi, (_m, quoteText) => {
    const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
    const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  html = html.replace(/<p[^>]*><strong>[“"”]?([\s\S]*?)[”"”]?<\/strong><\/p>/gi, (_m, quoteText) => {
    if (quoteText.includes('“') || quoteText.includes('”') || quoteText.includes('Con nguyện') || quoteText.includes('Sống là cống hiến') || quoteText.includes('Sống Là Cống Hiến')) {
      const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
      const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
      return `\n\n${quoteLines.join('\n')}\n\n`;
    }
    return `\n\n**${quoteText.replace(/<[^>]+>/g, '').trim()}**\n\n`;
  });

  // 8. Tác giả
  html = html.replace(/<p[^>]*>(?:<em>)?(Vô Trí\s*[-–]\s*Tâm Hòa|Sa Môn Vô Trí[^\n<]*)(?:<\/em>)?<\/p>/gi, '\n\n*$1*\n\n');

  // 9. Paragraphs
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => {
    const cleanP = pText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
    if (!cleanP) return '';
    return `\n\n${cleanP}\n\n`;
  });

  // 10. Clean markdown & Loại bỏ các dòng ghi chú dàn bài thừa & đường gạch phân cách
  html = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');

  const cleanedLines = html
    .split('\n')
    .filter((l) => {
      const trimmed = l.trim();
      if (!trimmed) return true;
      if (/^(?:-{2,}|\*{2,}|_{2,}|\u2014{2,})$/.test(trimmed)) return false;
      if (/^Infographic\s*\d*\s*card/i.test(trimmed)) return false;
      if (/^\d*\s*Ngăn\s*kéo\s*card/i.test(trimmed)) return false;
      if (/^Click\s*ra\s*trang\s*chi\s*tiết/i.test(trimmed)) return false;
      if (/^QUOTE\s*CUỐI\s*TRANG/i.test(trimmed)) return false;
      if (/^TÀI\s*LIỆU\s*THAM\s*KHẢO/i.test(trimmed)) return false;
      if (trimmed === '↓' || trimmed === '->' || trimmed === '-->') return false;
      return true;
    })
    .join('\n');

  const finalHtml = cleanedLines.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanedContent: finalHtml, extractedSubtitle };
}

export function TongChiEditor({ initialData, isEdit }: TongChiEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('editor');
  const [previewModal, setPreviewModal] = useState<any | null>(null);

  // WordPress Sync Bridge State - Lưu cố định Post ID, không bị nhảy loạn
  const [wpPostId, setWpPostId] = useState<string>(() => {
    if (initialData?.wpPostId) return String(initialData.wpPostId);
    if (initialData?.id === 4 || initialData?.slug?.includes('bo-de-tam')) return '470';
    return '';
  });
  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [wpPostsList, setWpPostsList] = useState<Array<{ id: number; title: string; slug: string }>>([]);
  const [loadingWpList, setLoadingWpList] = useState(false);

  // Tải danh sách bài viết thực tế trên WordPress để người soạn thảo chọn nhanh 1 cú click
  useEffect(() => {
    async function loadWpList() {
      setLoadingWpList(true);
      try {
        const res = await fetch('/api/admin/fetch-wp-posts');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.posts)) {
            setWpPostsList(json.posts);
          }
        }
      } catch (err) {
        console.error('Error fetching WP posts list:', err);
      } finally {
        setLoadingWpList(false);
      }
    }
    loadWpList();
  }, []);

  // Quản lý hiển thị bảng kỹ thuật nâng cao & Trình soạn thảo WordPress Gutenberg
  const [showWpSyncPanel, setShowWpSyncPanel] = useState(false);
  const [showAdvancedSeo, setShowAdvancedSeo] = useState(false);
  const [showManualSourceCode, setShowManualSourceCode] = useState(false);
  const [showGutenbergIframe, setShowGutenbergIframe] = useState(false);
  const [autoSyncOnFocus, setAutoSyncOnFocus] = useState(true);
  const [isAutoCreatingWp, setIsAutoCreatingWp] = useState(false);

  // Modal Thư Viện Ảnh WordPress Dùng Chung
  const [wpMediaModalOpen, setWpMediaModalOpen] = useState(false);
  const [wpMediaTarget, setWpMediaTarget] = useState<'banner' | 'content'>('banner');

  // Quản lý trạng thái chưa lưu
  const [isDirty, setIsDirty] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingExitUrl, setPendingExitUrl] = useState<string | null>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);

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

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'tong-phong-truyen-thua');
  const [bannerImage, setBannerImage] = useState(
    initialData?.bannerImage || '/images/trang-chu/z5856417756187_3b9aa0f55b1ca50d9934ff24e27fdbad.jpg'
  );
  const [bannerPosition, setBannerPosition] = useState(initialData?.bannerPosition || '50% 50%');
  const [focalModalOpen, setFocalModalOpen] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [author, setAuthor] = useState(initialData?.author || 'Sa Môn Vô Trí (Thích Tâm Hòa)');
  const [authorLink, setAuthorLink] = useState(initialData?.authorLink || '/gioi-thieu/su-phu-tru-tri');
  const [keywords, setKeywords] = useState<KeywordItem[]>(initialData?.keywords || []);

  // 📚 Quản lý Tủ Sách Tham Khảo Tàng Kinh Các (Phương án 1 Dùng Chung)
  const [sourceBooks, setSourceBooks] = useState<any[]>(() => {
    if (Array.isArray(initialData?.sourceBook)) return initialData.sourceBook;
    if (initialData?.sourceBook && typeof initialData.sourceBook === 'object') return [initialData.sourceBook];
    return [
      {
        id: 'khuyen-phat-bo-de-tam-giang-luan',
        title: 'KHUYẾN PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN',
        author: 'Đại Đức Thích Tâm Hòa',
        description: 'Bộ sách giảng giải chi tiết về tầm quan trọng và phương pháp phát khởi Bồ Đề tâm của người học Phật.',
        coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp',
        pdfUrl: 'https://drive.google.com/file/d/1bIo3HRT7asCbIeVF_NTs5u4kqTGw3Ear/view?usp=sharing',
        linkUrl: '/vu-tru-phat-giao/tang-kinh-cac',
      },
      {
        id: 'di-qua-kho-vui-cuoc-doi',
        title: 'ĐI QUA KHỔ VUI CUỘC ĐỜI (QUYỂN 01, 02, 03)',
        author: 'Sa Môn Vô Trí (hiệu Tâm Hòa)',
        description: 'Những chia sẻ chân thật và sâu sắc về hành trình tu học, vượt qua nghịch cảnh và kiến tạo đời sống an lạc.',
        coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc_tong-phong-truyen-thua_tiep-buoc-thay-toi_thay_-chu-thich-popup-sach-dqkvcd-1787464550735.jpg',
        linkUrl: '/vu-tru-phat-giao/tang-kinh-cac',
      },
      {
        id: 'loi-duc-phat-day',
        title: 'LỜI ĐỨC PHẬT DẠY & CÁC BÀI GIẢNG',
        author: 'Tùng Lâm Hòa Phúc',
        description: 'Tập hợp các lời dạy căn bản của Đức Phật và các bài pháp thoại trong các khóa tu tại Tùng Lâm Hòa Phúc.',
        coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-hoang-phap--kien-an-tinh-hai-phong-1787463859334.jpg',
        linkUrl: 'https://www.youtube.com/playlist?list=PL2aRqXTU1nn456nh72vOF1W7Au764sTVN',
      },
    ];
  });

  const [allLibraryBooks, setAllLibraryBooks] = useState<any[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('Tất cả');
  const [isAddingNewBook, setIsAddingNewBook] = useState(false);
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: 'Sa Môn Vô Trí (Thích Tâm Hòa)',
    description: '',
    coverImage: '',
    pdfUrl: '',
    category: 'Phật Học Phổ Thông',
  });

  useEffect(() => {
    async function loadLibraryBooks() {
      try {
        const res = await fetch('/api/admin/reference-books');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && Array.isArray(resData.data)) {
            setAllLibraryBooks(resData.data);
          }
        }
      } catch (err) {
        console.error('Failed to load library books:', err);
      }
    }
    loadLibraryBooks();
  }, []);

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isDragOverBanner, setIsDragOverBanner] = useState(false);

  // Xử lý Đồng Bộ Tự Động Từ WordPress Gutenberg
  const handleSyncFromWordPress = async (silent = false) => {
    if (!wpPostId || !wpPostId.trim()) {
      if (!silent) alert('Vui lòng chọn hoặc nhập WordPress Post ID (ví dụ: 470, 480, 481...)');
      return;
    }
    setIsSyncingWp(true);
    if (!silent) setSyncMessage(null);
    try {
      const res = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi/${wpPostId.trim()}?_embed`, {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!res.ok) {
        if (!silent) {
          throw new Error(`WordPress API trả về mã lỗi HTTP ${res.status}. Vui lòng kiểm tra lại Post ID hoặc chắc chắn bài viết đã được bấm "Đăng (Publish)".`);
        }
        return;
      }
      const post = await res.json();
      const rawHtml = post.content?.rendered || '';
      const parsed = convertWpHtmlToCleanContent(rawHtml);

      if (post.title?.rendered) setTitle(post.title.rendered);
      if (post.acf?.tieu_de_phu || post.acf?.sub_title || parsed.extractedSubtitle) {
        setSubtitle(post.acf?.tieu_de_phu || post.acf?.sub_title || parsed.extractedSubtitle || '');
      }
      if (parsed.cleanedContent) setContent(parsed.cleanedContent);
      if (post.slug && (!slug || slug === 'new' || slug === '470')) {
        setSlug(post.slug);
      }

      const wpBanner = post.acf?.anh_nen || post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      if (wpBanner) setBannerImage(wpBanner);

      setIsDirty(true);
      setSyncMessage(`✅ Đã đồng bộ thành công nội dung bài viết #${wpPostId} từ WordPress!`);
      setTimeout(() => setSyncMessage(null), 6000);
    } catch (err: any) {
      if (!silent) {
        alert(err.message || 'Lỗi khi đồng bộ từ WordPress');
      }
    } finally {
      setIsSyncingWp(false);
    }
  };

  // Tự động kiểm tra và đồng bộ khi biên tập viên quay lại tab Next.js từ WordPress
  useEffect(() => {
    const handleWindowFocus = () => {
      if (autoSyncOnFocus && wpPostId && wpPostId.trim()) {
        handleSyncFromWordPress(true);
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [autoSyncOnFocus, wpPostId]);

  // Xử lý mở trình soạn thảo WordPress Gutenberg (Tự tạo bài nếu chưa có Post ID)
  const handleOpenGutenberg = async () => {
    setIsAutoCreatingWp(true);
    const newTab = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: wpPostId,
          title: title || 'Bài viết Tông Chỉ Mới',
          subtitle,
          content: content || excerpt || subtitle || '',
          excerpt: excerpt || subtitle || '',
          category,
          postType: 'tong-chi',
        }),
      });
      const data = await res.json();
      if (data.success && data.editUrl) {
        if (data.wpPostId) {
          setWpPostId(String(data.wpPostId));
          setIsDirty(true);
        }
        if (newTab) {
          newTab.location.href = data.editUrl;
        } else {
          window.open(data.editUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
        if (newTab) newTab.location.href = fallbackUrl;
        else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
      if (newTab) newTab.location.href = fallbackUrl;
      else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsAutoCreatingWp(false);
    }
  };

  // Xử lý chọn ảnh từ Thư Viện WordPress
  const handleSelectWpMedia = (url: string, item: WordPressMediaItem) => {
    if (wpMediaTarget === 'banner') {
      setBannerImage(url);
      setIsDirty(true);
    } else if (wpMediaTarget === 'content') {
      const imgTitle = item?.title ? item.title.replace(/[\[\]]/g, '') : 'Hình ảnh minh họa';
      insertFormatting(`\n![${imgTitle}](${url})\n`);
      setIsDirty(true);
    }
  };

  // Phím tắt Ctrl + S để lưu tức thì
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, subtitle, slug, category, bannerImage, bannerPosition, excerpt, author, authorLink, keywords]);

  // Upload Handler
  const handleUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploadingBanner(true);
    setIsDirty(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        callback(data.url);
      } else {
        alert(data.error || 'Lỗi tải ảnh');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi tải ảnh');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Helper chèn định dạng trực tiếp vào Textarea
  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = '') => {
    setIsDirty(true);
    const el = contentTextareaRef.current;
    if (!el) {
      setContent((prev: string) => prev + prefix + placeholder + suffix);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const textToInsert = selected || placeholder;
    const newText = el.value.substring(0, start) + prefix + textToInsert + suffix + el.value.substring(end);

    setContent(newText);
    setTimeout(() => {
      el.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + textToInsert.length;
      el.setSelectionRange(cursorStart, cursorEnd);
    }, 10);
  };

  // Gán từ khóa được bôi đen thành Keyword Popup
  const handleCreateKeywordFromSelection = () => {
    const el = contentTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end).trim();
    if (!selected) {
      handleAddKeyword();
      return;
    }

    setIsDirty(true);
    insertFormatting('**', '**');

    const cleanWord = selected.replace(/^\*+|\*+$/g, '').replace(/^[<>/b]+|[<>/b]+$/gi, '').trim();
    if (!keywords.some((k) => k.keyword.toLowerCase() === cleanWord.toLowerCase())) {
      setKeywords([
        ...keywords,
        {
          keyword: cleanWord,
          title: cleanWord.toUpperCase(),
          subtitle: 'Thuật ngữ Phật học',
          imageUrl: bannerImage,
          description: `Ý nghĩa giải thích cho thuật ngữ "${cleanWord}" trong kinh điển và pháp bảo.`,
          linkUrl: '',
        },
      ]);
    }
  };

  // Add Keyword Row
  const handleAddKeyword = () => {
    setIsDirty(true);
    setKeywords([
      ...keywords,
      {
        keyword: '',
        title: '',
        subtitle: '',
        imageUrl: '',
        description: '',
        linkUrl: '',
      },
    ]);
  };

  // Update Keyword Field
  const handleUpdateKeyword = (index: number, field: keyof KeywordItem, value: string) => {
    setIsDirty(true);
    const updated = [...keywords];
    updated[index] = { ...updated[index], [field]: value };
    setKeywords(updated);
  };

  // Remove Keyword
  const handleRemoveKeyword = (index: number) => {
    setIsDirty(true);
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Save Handler
  const handleSave = async (options?: { stay?: boolean; openPreview?: boolean }) => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền Tiêu đề và Nội dung bài viết');
      return;
    }

    setSaving(true);
    const catObj = CATEGORIES.find((c) => c.id === category);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: slug.trim() || undefined,
      category,
      categoryName: catObj?.name || 'TÔNG PHONG TRUYỀN THỪA',
      bannerImage,
      bannerPosition,
      excerpt: excerpt.trim() || content.replace(/<[^>]+>/g, '').replace(/^#+.*$/gm, '').slice(0, 160).trim() + '...',
      content,
      author,
      authorLink,
      keywords: keywords.filter((k) => k.keyword.trim()),
      sourceBook: sourceBooks,
      wpPostId: wpPostId ? wpPostId.trim() : undefined,
    };

    try {
      const endpoint = isEdit ? `/api/admin/tong-chi/${initialData.id || initialData.slug}` : '/api/admin/tong-chi';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        const savedSlug = data.data?.slug || slug;
        setSaveSuccessMessage('✅ Đã lưu bài viết thành công lúc ' + new Date().toLocaleTimeString('vi-VN'));
        setTimeout(() => setSaveSuccessMessage(null), 4000);

        if (options?.openPreview && savedSlug) {
          window.open(`/tong-chi-tu-hoc/${savedSlug}`, '_blank');
        }
      } else {
        alert(data.error || 'Có lỗi xảy ra khi lưu bài viết');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi lưu bài');
    } finally {
      setSaving(false);
    }
  };

  // ⌨️ Bắt phím tắt Ctrl+S / Cmd+S để lưu ngay lập tức
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave({ stay: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, subtitle, slug, category, bannerImage, bannerPosition, excerpt, content, author, authorLink, keywords, isEdit]);

  const handleBackClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      setPendingExitUrl('/admin/tong-chi');
      setUnsavedModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* ── TOP STICKY ACTION HEADER ── */}
      <div className="sticky top-2 z-40 bg-[#1C120A]/95 backdrop-blur-md border border-[#F2C14E]/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tong-chi"
            onClick={handleBackClick}
            className="w-10 h-10 rounded-xl bg-[#25170E] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
            title="Quay lại danh sách bài viết"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#FFDE59] uppercase tracking-wider flex items-center gap-2">
              <span>{isEdit ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Mới'}</span>
              {isDirty && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Chưa lưu
                </span>
              )}
            </h1>
            {saveSuccessMessage && (
              <p className="text-[11px] text-emerald-400 font-medium animate-pulse">
                {saveSuccessMessage}
              </p>
            )}
          </div>
        </div>

        {/* View Mode Tabs & Save Buttons */}
        <div className="flex items-center gap-2">
          {/* Tab Soạn thảo */}
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-md'
                : 'bg-[#25170E] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Soạn Thảo</span>
          </button>

          {/* Tab Xem Trước 1:1 */}
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-md'
                : 'bg-[#25170E] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]'
            }`}
            title="Xem trước giao diện chuẩn như người đọc thấy"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Xem Trước 1:1</span>
          </button>

          {/* Tab Chia đôi màn hình (Split) */}
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all hidden md:flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'split'
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-md'
                : 'bg-[#25170E] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]'
            }`}
            title="Soạn thảo bên trái, Xem trực quan bên phải"
          >
            <Columns className="w-4 h-4" />
            <span>Song Song</span>
          </button>

          {/* Nút Xem trên Web */}
          {slug && (
            <Link
              href={`/tong-chi-tu-hoc/${slug}`}
              target="_blank"
              className="w-10 h-10 rounded-xl bg-[#25170E] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
              title="Mở bài viết trên trang web chính thức (tab mới)"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* NÚT LƯU BÀI VIẾT CHÍNH */}
          <button
            type="button"
            onClick={() => handleSave({ stay: true })}
            disabled={saving}
            className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105"
            title="Phím tắt: Ctrl + S"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {/* ── NỘI DUNG CHÍNH (EDITOR / PREVIEW / SPLIT) ── */}
      {activeTab === 'preview' ? (
        /* FULL PREVIEW TAB 1:1 */
        <div className="bg-[#2C1C11] border-2 border-[#F2C14E]/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl text-left">
          <div className="border-b border-[#F2C14E]/20 pb-6 text-center">
            <span className="px-3.5 py-1 rounded-full bg-[#F2C14E]/15 text-[#F2C14E] text-xs font-bold border border-[#F2C14E]/30 uppercase tracking-widest">
              {CATEGORIES.find((c) => c.id === category)?.name || 'TÔNG CHỈ TU HỌC'}
            </span>
            <h1
              style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
              className="text-3xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-bold mt-4"
            >
              {title || 'Chưa có tiêu đề'}
            </h1>
            {subtitle && <p className="text-sm sm:text-base text-[#FFE5A3]/90 italic mt-2">{subtitle}</p>}
          </div>

          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/30 bg-black/40 shadow-xl">
            <img
              src={bannerImage}
              alt={title}
              className="w-full h-full object-cover"
              style={{ objectPosition: bannerPosition || 'center center' }}
            />
          </div>

          {/* Render chính xác bằng InfographicArticleRenderer */}
          <div className="pt-4">
            <InfographicArticleRenderer
              rawContent={content}
              title={title}
              subtitle={subtitle}
              author={author}
              authorLink={authorLink}
              popups={keywords.map((k) => ({
                keyword: k.keyword,
                title: k.title,
                subtitle: k.subtitle,
                description: k.description,
                imageUrl: k.imageUrl || bannerImage,
                linkUrl: k.linkUrl || '',
              }))}
              onKeywordClick={(kw) => {
                const match = keywords.find((k) => k.keyword.toLowerCase() === kw.toLowerCase());
                if (match) setPreviewModal(match);
              }}
            />
          </div>
        </div>
      ) : (
        /* SOẠN THẢO VÀ SPLIT SCREEN */
        <div className={`grid gap-6 ${activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* CỘT SOẠN THẢO */}
          <div className="space-y-6">
            {/* 1. THÔNG TIN CƠ BẢN */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h2 className="text-xs sm:text-sm font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-2 border-b border-[#F2C14E]/15 pb-2">
                <span>1. Thông Tin Tiêu Đề &amp; Chuyên Mục</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Tiêu đề bài viết / Kệ thơ *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setIsDirty(true);
                      setTitle(e.target.value);
                    }}
                    placeholder="Ví dụ: BỒ ĐỀ TÂM"
                    required
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Tiêu đề phụ / Lời tựa ngắn</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => {
                      setIsDirty(true);
                      setSubtitle(e.target.value);
                    }}
                    placeholder="Ví dụ: Cội nguồn thiện pháp"
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Chuyên mục tu học *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setIsDirty(true);
                      setCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#F2C14E]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Tác giả bài viết / Lời kệ</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => {
                      setIsDirty(true);
                      setAuthor(e.target.value);
                    }}
                    placeholder="Sa Môn Vô Trí (Thích Tâm Hòa)"
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
              </div>

              {/* Tùy chọn đường dẫn tĩnh Slug (Mặc định ẩn) */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSeo(!showAdvancedSeo)}
                  className="text-[11px] text-[#c9b896]/70 hover:text-[#F2C14E] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                >
                  <span>{showAdvancedSeo ? '▲ Thu gọn Tùy chỉnh Đường dẫn tĩnh (Slug)' : '⚙️ Tùy chỉnh Đường dẫn tĩnh (Slug URL) — Dành cho Kỹ thuật / SEO'}</span>
                </button>
                {showAdvancedSeo && (
                  <div className="mt-2 p-3 rounded-xl bg-[#25170E] border border-[#F2C14E]/30 space-y-2 animate-in fade-in">
                    <label className="text-xs font-semibold text-[#FFE5A3]">Đường dẫn tĩnh (Slug URL)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsDirty(true);
                        setSlug(e.target.value);
                      }}
                      placeholder="Mặc định hệ thống tự sinh từ tiêu đề (ví dụ: bo-de-tam-coi-nguon-thien-phap)"
                      className="w-full px-3 py-2 bg-[#1C120A] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                    />
                    <p className="text-[10px] text-[#c9b896]/60">
                      Ghi chú: Nếu để trống, hệ thống sẽ tự động tạo đường dẫn chuẩn SEO từ tiêu đề bài viết.
                    </p>
                  </div>
                )}
              </div>

              {/* Banner Image */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#FFE5A3]">
                  <span>Ảnh bìa Hero Banner (Kéo thả hoặc tải ảnh)</span>
                  <div className="flex items-center gap-2">
                    {bannerImage && (
                      <button
                        type="button"
                        onClick={() => setFocalModalOpen(true)}
                        className="text-[11px] text-[#F2C14E] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        title="Kéo thả căn tiêu điểm ảnh bìa"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Căn tiêu điểm ({bannerPosition})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setWpMediaTarget('banner');
                        setWpMediaModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 text-[#FFDE59] border border-[#F2C14E]/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      title="Chọn ảnh từ Thư viện WordPress dùng chung"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>🖼️ Thư Viện Ảnh WP</span>
                    </button>
                    <label className="cursor-pointer text-[11px] text-[#F2C14E] hover:underline flex items-center gap-1 font-bold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, setBannerImage);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    isDragOverBanner
                      ? 'border-2 border-dashed border-[#F2C14E] bg-[#F2C14E]/20 scale-[1.01]'
                      : 'border-[#F2C14E]/30 bg-[#25170E]'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOverBanner(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOverBanner(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOverBanner(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleUpload(file, setBannerImage);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {isUploadingBanner ? (
                      <div className="w-20 h-14 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center gap-1 text-[11px] text-[#ffde59]">
                        <Loader2 className="w-4 h-4 animate-spin text-[#F2C14E]" />
                      </div>
                    ) : bannerImage ? (
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-black/40 shrink-0 relative group/bthumb">
                        <img
                          src={bannerImage}
                          alt="Banner"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: bannerPosition || 'center center' }}
                        />
                        <button
                          type="button"
                          onClick={() => setFocalModalOpen(true)}
                          className="absolute inset-0 bg-black/60 text-[#ffde59] opacity-0 group-hover/bthumb:opacity-100 flex items-center justify-center transition-opacity"
                          title="Bấm để chỉnh tiêu điểm"
                        >
                          <Crosshair className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null}

                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => {
                        setIsDirty(true);
                        setBannerImage(e.target.value);
                      }}
                      placeholder="Dán link ảnh hoặc Kéo thả file ảnh vào khung này..."
                      className="flex-1 px-3 py-2 bg-[#1C120A] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. KHÔNG GIAN SOẠN THẢO VĂN BẢN LIỀN MẠCH (KHÔNG KHỐI) & KẾT NỐI WORDPRESS */}
            <div className="bg-[#1C120A] border-2 border-[#F2C14E]/35 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2C14E]/20 pb-3">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#FFDE59] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                    <span>2. Soạn Thảo Văn Bản &amp; Kệ Thơ Phật Học (Liền Mạch Không Khối)</span>
                  </h2>
                  <p className="text-[11px] text-[#c9b896]/80 mt-0.5">
                    Soạn thảo tự nhiên như văn bản Word. Dùng thanh công cụ hoàng kim 1-click để chèn Kệ Thơ viền vàng, Thư viện ảnh WordPress, và gán Popup Từ Khóa.
                  </p>
                </div>

                {/* Nút Kết Nối / Đồng Bộ WordPress */}
                <div className="flex items-center gap-2 flex-wrap">
                  {wpPostId ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Post WP #{wpPostId}</span>
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowWpSyncPanel(!showWpSyncPanel)}
                    className="px-3 py-1 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-xs font-bold text-[#FFE5A3] hover:text-[#FFDE59] flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    title="Mở công cụ liên kết & đồng bộ với WordPress Gutenberg"
                  >
                    <span>{showWpSyncPanel ? '▲ Thu Gọn WP' : '🌐 Kết Nối WP'}</span>
                  </button>
                </div>
              </div>

              {/* BẢNG CÔNG CỤ KẾT NỐI WORDPRESS (KHI BẬT) */}
              {showWpSyncPanel && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#2A1B10] via-[#21140B] to-[#170E08] border border-[#F2C14E]/30 space-y-3 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleOpenGutenberg}
                      disabled={isAutoCreatingWp}
                      className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] text-[#120A05] text-xs font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
                    >
                      {isAutoCreatingWp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#120A05]" />}
                      <span>{wpPostId ? `Mở Gutenberg (Post #${wpPostId})` : 'Tạo & Mở Gutenberg'}</span>
                      <ExternalLink className="w-3 h-3 text-[#120A05]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncFromWordPress(false)}
                      disabled={isSyncingWp || !wpPostId}
                      className="py-2 px-3 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {isSyncingWp ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F2C14E]" /> : <RefreshCw className="w-3.5 h-3.5 text-[#F2C14E]" />}
                      <span>Đồng Bộ Về Web</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGutenbergIframe(!showGutenbergIframe)}
                      className="py-2 px-3 rounded-xl bg-[#1C120A] border border-[#F2C14E]/30 text-xs font-semibold text-[#c9b896] hover:text-white cursor-pointer"
                    >
                      {showGutenbergIframe ? 'Đóng iframe' : 'Nhúng iframe'}
                    </button>
                  </div>

                  {/* KHUNG IFRAME NẾU BẬT */}
                  {showGutenbergIframe && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-[#F2C14E]/40 shadow-xl">
                      <iframe
                        src={`https://admin.tunglamhoaphuc.com/wp-admin/post.php?post=${wpPostId || '470'}&action=edit`}
                        className="w-full h-[600px] bg-white"
                        title="WordPress Gutenberg"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* THÔNG BÁO ĐỒNG BỘ NẾU CÓ */}
              {syncMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* THANH CÔNG CỤ HOÀNG KIM (GOLDEN BUDDHIST TOOLBAR - 1 CLICK) */}
              <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-[#23170F] border border-[#F2C14E]/30 rounded-xl shadow-inner">
                {/* Nhóm Tiêu đề Heading */}
                <div className="flex items-center gap-1 bg-[#170E08] p-1 rounded-lg border border-[#F2C14E]/20">
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n## ', '\n\n', 'TIÊU ĐỀ ĐỀ MỤC LỚN')}
                    className="px-2.5 py-1 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Tiêu đề đề mục lớn (Heading 2)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                    <span>H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n### ', '\n\n', 'Tiêu đề mục nhỏ')}
                    className="px-2.5 py-1 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Tiêu đề mục nhỏ (Heading 3)"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                    <span>H3</span>
                  </button>
                </div>

                {/* Nhóm Định dạng văn bản */}
                <div className="flex items-center gap-1 bg-[#170E08] p-1 rounded-lg border border-[#F2C14E]/20">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**', 'Chữ in đậm')}
                    className="p-1.5 px-2 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all cursor-pointer"
                    title="In đậm (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*', 'Chữ in nghiêng')}
                    className="p-1.5 px-2 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all cursor-pointer"
                    title="In nghiêng (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>', 'Chữ gạch chân')}
                    className="p-1.5 px-2 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all cursor-pointer"
                    title="Gạch chân (Underline)"
                  >
                    <UnderlineIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ', '\n', 'Nội dung danh sách')}
                    className="p-1.5 px-2 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all cursor-pointer"
                    title="Danh sách gạch đầu dòng"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Nhóm Phật Học Tùng Lâm Hòa Phúc Độc Bản */}
                <div className="flex items-center gap-1.5 bg-[#170E08] p-1 rounded-lg border border-[#F2C14E]/30">
                  <button
                    type="button"
                    onClick={() => {
                      insertFormatting(
                        '\n> Con nguyện giữ tâm Bồ đề kiên cố\n> Con nguyện hành hạnh tự lợi, lợi tha\n> Đem an vui chan rải đến muôn nhà\n> Để tâm Phật chan hòa trong vũ trụ.\n\n*Vô Trí - Tâm Hòa*\n\n'
                      );
                    }}
                    className="px-3 py-1 rounded bg-gradient-to-r from-[#8B5A2B]/40 to-[#CD853F]/40 hover:from-[#F2C14E] hover:to-[#FFDE59] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#F2C14E]/40 cursor-pointer shadow-sm"
                    title="Chèn mẫu Kệ Thơ Phật Học viền vàng trang nghiêm"
                  >
                    <Quote className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>📜 Chèn Kệ Thơ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWpMediaTarget('content');
                      setWpMediaModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#F2C14E]/40 cursor-pointer shadow-sm"
                    title="Chọn ảnh minh họa từ Thư viện WordPress dùng chung"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>🖼️ Thư Viện Ảnh WP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => inlineImageInputRef.current?.click()}
                    className="px-3 py-1 rounded bg-[#2A1B10] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#F2C14E]/40 cursor-pointer shadow-sm"
                    title="Tải ảnh trực tiếp từ máy tính lên"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>📷 Tải Ảnh Máy</span>
                  </button>

                  {/* Input file ẩn cho tải ảnh từ máy tính */}
                  <input
                    type="file"
                    ref={inlineImageInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await handleUpload(file, (uploadedUrl) => {
                        insertFormatting(`\n\n![${file.name.replace(/\.[^/.]+$/, '')}](${uploadedUrl})\n\n`);
                      });
                      if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Nút Tạo Popup Từ Khóa */}
                <button
                  type="button"
                  onClick={handleCreateKeywordFromSelection}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37]/30 to-[#F2C14E]/40 hover:from-[#F2C14E] hover:to-[#FFDE59] text-[#FFE5A3] hover:text-[#120A05] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#F2C14E]/50 cursor-pointer shadow ml-auto"
                  title="Bôi đen một từ ngữ trong bài rồi bấm nút này để tạo chú thích popup tức thì"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>✨ Gán Popup Từ Khóa</span>
                </button>
              </div>

              {/* KHUNG SOẠN THẢO VĂN BẢN PHẬT HỌC LIỀN MẠCH (KHÔNG CHIA KHỐI) */}
              <div className="relative rounded-xl overflow-hidden border border-[#F2C14E]/30 bg-[#140C07] focus-within:border-[#F2C14E] focus-within:ring-1 focus-within:ring-[#F2C14E]/50 transition-all shadow-inner">
                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => {
                    setIsDirty(true);
                    setContent(e.target.value);
                  }}
                  rows={24}
                  placeholder={`Soạn thảo bài viết liền mạch tại đây...\n\nVí dụ:\n## BÀI HỌC TÂM LINH\n\nĐây là đoạn văn xuôi giải thích giáo lý thanh tịnh của Tùng Lâm Hòa Phúc...\n\n> Con nguyện giữ tâm Bồ đề kiên cố\n> Con nguyện hành hạnh tự lợi, lợi tha\n> Đem an vui chan rải đến muôn nhà\n> Để tâm Phật chan hòa trong vũ trụ.\n\n*Vô Trí - Tâm Hòa*\n\nMẹo:\n- Dùng nút "📜 Chèn Kệ Thơ" trên thanh công cụ để chèn bài kệ viền vàng hoàng kim.\n- Dùng "🖼️ Thư Viện Ảnh WP" để chèn ảnh từ WordPress.\n- Bôi đen từ khóa bất kỳ rồi bấm "✨ Gán Popup Từ Khóa" để tạo chú thích popup.`}
                  className="w-full p-4 sm:p-5 bg-transparent text-[#FFF8EB] placeholder-[#c9b896]/35 text-[14px] sm:text-[15px] leading-relaxed font-sans resize-y focus:outline-none selection:bg-[#F2C14E]/30 selection:text-white"
                  style={{ minHeight: '560px' }}
                />

                {/* THANH THỐNG KÊ & TRẠNG THÁI CUỐI TRÌNH SOẠN THẢO */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#1C120A] border-t border-[#F2C14E]/20 text-[11px] text-[#c9b896]/80">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      Độ dài: <strong className="text-[#FFDE59]">{content.trim() ? content.trim().split(/\s+/).length : 0}</strong> từ • <strong className="text-[#FFDE59]">{content.length}</strong> ký tự
                    </span>
                    <span className="hidden md:inline text-[#c9b896]/50">•</span>
                    <span className="hidden md:inline text-[#c9b896]/70">
                      Phím tắt: <kbd className="px-1.5 py-0.5 rounded bg-[#2A1D14] border border-[#F2C14E]/30 text-[10px] text-[#FFE5A3] font-mono">Ctrl + S</kbd> để lưu tức thì
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#F2C14E]">
                    <span>📜 Bắt đầu dòng bằng <code className="px-1 py-0.5 rounded bg-[#2A1D14] text-[#FFDE59] font-mono">&gt;</code> để tạo Kệ Thơ viền vàng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BẢNG QUẢN LÝ POPUP CHÚ THÍCH TỪ KHÓA */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2C14E]/15 pb-3">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#ffde59] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                    <span>3. Bảng Quản Lý Popup Chú Thích Thuật Ngữ ({keywords.length} từ khóa)</span>
                  </h2>
                  <p className="text-[11px] text-[#c9b896]/80 mt-0.5">
                    Mỗi khi độc giả bấm vào từ khóa này trong bài thơ, popup ảnh và lời giải nghĩa sẽ bật lên trang nghiêm.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-3 py-1.5 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A120B] border border-[#F2C14E]/50 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Thêm từ khóa chú thích mới"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Từ Khóa</span>
                </button>
              </div>

              {keywords.length === 0 ? (
                <div className="p-8 text-center bg-[#25170E]/50 rounded-xl border border-dashed border-[#F2C14E]/30 text-xs text-[#c9b896]/60 space-y-2">
                  <p>Chưa có từ khóa chú thích nào.</p>
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="text-[#F2C14E] font-bold hover:underline cursor-pointer"
                  >
                    + Bấm vào đây để thêm từ khóa đầu tiên (ví dụ: Bồ Đề Tâm, Trúc Lâm, Liên Đăng...)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {keywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className="bg-[#25170E] border border-[#F2C14E]/30 rounded-xl p-4 space-y-3 relative hover:border-[#F2C14E]/60 transition-all shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#F2C14E]">
                          #Từ khóa {idx + 1}: {kw.keyword || 'Chưa đặt tên'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewModal(kw)}
                            className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A120B] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xem thử Popup chú thích"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(idx)}
                            className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-800/40 text-red-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                            title="Xóa từ khóa này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#FFE5A3]">
                            Từ khóa trong văn bản *
                          </label>
                          <input
                            type="text"
                            value={kw.keyword}
                            onChange={(e) => handleUpdateKeyword(idx, 'keyword', e.target.value)}
                            placeholder="Ví dụ: Bồ Đề Tâm"
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#FFE5A3]">
                            Tiêu đề hiển thị Popup
                          </label>
                          <input
                            type="text"
                            value={kw.title}
                            onChange={(e) => handleUpdateKeyword(idx, 'title', e.target.value)}
                            placeholder="BỒ ĐỀ TÂM"
                            className="w-full px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#FFE5A3]">
                            Ảnh minh họa Popup
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={kw.imageUrl}
                              onChange={(e) => handleUpdateKeyword(idx, 'imageUrl', e.target.value)}
                              placeholder="Dán link ảnh hoặc tải lên..."
                              className="flex-1 px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                            />
                            <label className="w-8 h-8 rounded-lg bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A120B] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUpload(file, (url) => handleUpdateKeyword(idx, 'imageUrl', url));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#FFE5A3]">
                          Nội dung lời giải nghĩa chú thích *
                        </label>
                        <textarea
                          rows={3}
                          value={kw.description}
                          onChange={(e) => handleUpdateKeyword(idx, 'description', e.target.value)}
                          placeholder="Nhập lời giải nghĩa tường tận, chân thực và trang nghiêm cho từ khóa..."
                          className="w-full p-3 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. NGUỒN TÀI LIỆU THAM KHẢO (TỦ SÁCH TÀNG KINH CÁC DÙNG CHUNG) */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2C14E]/15 pb-3">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#F2C14E]" />
                    <span>4. Nguồn Tài Liệu Tham Khảo (Tủ Sách Tàng Kinh Các)</span>
                  </h2>
                  <p className="text-[11px] text-[#c9b896]/70 mt-0.5">
                    Chọn nhanh các đầu sách từ kho 400+ ấn phẩm số Tàng Kinh Các để hiển thị dưới bài viết
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full bg-[#2A160C] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-semibold">
                    {sourceBooks.length} Tác phẩm đã chọn
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewBook(!isAddingNewBook)}
                    className="px-3 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>{isAddingNewBook ? 'Đóng Form' : '+ Thêm Sách Mới'}</span>
                  </button>
                </div>
              </div>

              {/* Form Thêm Sách Mới Nhanh */}
              {isAddingNewBook && (
                <div className="p-4 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold text-[#FFDE59] uppercase">Thêm ấn phẩm mới vào Tủ sách Tàng Kinh Các</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Tên sách (Ví dụ: KHUYẾN PHÁT BỒ ĐỀ TÂM...)"
                      value={newBookForm.title}
                      onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                      className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Tác giả (Sa Môn Vô Trí...)"
                      value={newBookForm.author}
                      onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                      className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Link ảnh bìa (hoặc upload)..."
                      value={newBookForm.coverImage}
                      onChange={(e) => setNewBookForm({ ...newBookForm, coverImage: e.target.value })}
                      className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Link đọc Ebook / Google Drive PDF..."
                      value={newBookForm.pdfUrl}
                      onChange={(e) => setNewBookForm({ ...newBookForm, pdfUrl: e.target.value })}
                      className="px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Mô tả ngắn gọn về tác phẩm..."
                    value={newBookForm.description}
                    onChange={(e) => setNewBookForm({ ...newBookForm, description: e.target.value })}
                    className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewBook(false)}
                      className="px-3 py-1 bg-black/40 text-[#FFE5A3] text-xs rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newBookForm.title.trim()) {
                          alert('Vui lòng nhập tên sách');
                          return;
                        }
                        try {
                          const res = await fetch('/api/admin/reference-books', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newBookForm),
                          });
                          const resData = await res.json();
                          if (resData.success && resData.data) {
                            setAllLibraryBooks((prev) => [resData.data, ...prev]);
                            setSourceBooks((prev) => [resData.data, ...prev]);
                            setIsDirty(true);
                            setIsAddingNewBook(false);
                            setNewBookForm({
                              title: '',
                              author: 'Sa Môn Vô Trí (Thích Tâm Hòa)',
                              description: '',
                              coverImage: '',
                              pdfUrl: '',
                              category: 'Phật Học Phổ Thông',
                            });
                          }
                        } catch (err) {
                          alert('Lỗi khi thêm sách vào thư viện');
                        }
                      }}
                      className="px-4 py-1 bg-[#F2C14E] text-[#1C120A] font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Lưu &amp; Thêm Vào Bài
                    </button>
                  </div>
                </div>
              )}

              {/* Danh sách sách đã chọn cho bài viết */}
              {sourceBooks.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#FFDE59] uppercase tracking-wider">
                    Các tác phẩm đang hiển thị trong bài viết này:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {sourceBooks.map((sb, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 rounded-xl bg-[#25170E] border border-[#F2C14E]/30 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={sb.coverImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp'}
                            alt={sb.bookTitle || sb.title}
                            className="w-9 h-11 rounded-lg object-cover border border-[#F2C14E]/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#FFDE59] uppercase truncate">
                              {sb.bookTitle || sb.title}
                            </p>
                            <p className="text-[11px] text-[#FFE5A3]/70 truncate">
                              {sb.author || 'Sa Môn Vô Trí'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsDirty(true);
                            setSourceBooks(sourceBooks.filter((_, i) => i !== sIdx));
                          }}
                          className="w-7 h-7 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800/40 text-red-300 flex items-center justify-center shrink-0 cursor-pointer"
                          title="Bỏ chọn tác phẩm này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bộ chọn sách nhanh từ Kho Tàng Kinh Các (400+ đầu sách) */}
              <div className="pt-3 border-t border-[#F2C14E]/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-[#FFE5A3]">
                    Kho Tủ Sách Tàng Kinh Các ({allLibraryBooks.length} đầu sách):
                  </label>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#F2C14E]/70 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      placeholder="Tìm theo tên sách, tác giả..."
                      className="w-full pl-8 pr-3 py-1 bg-[#25170E] border border-[#F2C14E]/30 rounded-lg text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 bg-[#120A05] border border-[#F2C14E]/20 rounded-xl">
                  {allLibraryBooks
                    .filter((b) => {
                      if (!librarySearch.trim()) return true;
                      const s = librarySearch.toLowerCase();
                      return (
                        b.title?.toLowerCase().includes(s) ||
                        b.author?.toLowerCase().includes(s) ||
                        b.description?.toLowerCase().includes(s)
                      );
                    })
                    .slice(0, 50)
                    .map((book) => {
                      const isSelected = sourceBooks.some(
                        (sb) =>
                          (sb.id && sb.id === book.id) ||
                          (sb.bookTitle && sb.bookTitle.toLowerCase() === book.title.toLowerCase()) ||
                          (sb.title && sb.title.toLowerCase() === book.title.toLowerCase())
                      );

                      return (
                        <div
                          key={book.id}
                          onClick={() => {
                            setIsDirty(true);
                            if (isSelected) {
                              setSourceBooks(
                                sourceBooks.filter(
                                  (sb) =>
                                    (sb.id !== book.id) &&
                                    (sb.bookTitle?.toLowerCase() !== book.title.toLowerCase()) &&
                                    (sb.title?.toLowerCase() !== book.title.toLowerCase())
                                )
                              );
                            } else {
                              setSourceBooks([
                                ...sourceBooks,
                                {
                                  id: book.id,
                                  title: book.title,
                                  bookTitle: book.title,
                                  author: book.author,
                                  description: book.description,
                                  coverImage: book.coverImage || book.coverUrl,
                                  pdfUrl: book.pdfUrl || '',
                                  linkUrl: book.linkUrl || `/vu-tru-phat-giao/tang-kinh-cac?sach=${book.id}`,
                                },
                              ]);
                            }
                          }}
                          className={`p-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#F2C14E]/20 border border-[#F2C14E]'
                              : 'bg-[#1C120A] border border-transparent hover:border-[#F2C14E]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-[#F2C14E] w-4 h-4 rounded"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#FFE5A3] truncate">{book.title}</p>
                              <p className="text-[10px] text-[#c9b896]/60 truncate">
                                {book.author} {book.category ? `• ${book.category}` : ''}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] text-[#F2C14E] shrink-0 font-medium">
                            {isSelected ? '✓ Đã chọn' : '+ Chọn'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT XEM TRƯỚC THỜI GIAN THỰC (SPLIT SCREEN MODE) */}
          {activeTab === 'split' && (
            <div className="bg-[#2C1C11] border-2 border-[#F2C14E]/40 rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[85vh] sticky top-20 text-left">
              <div className="flex items-center justify-between border-b border-[#F2C14E]/20 pb-3">
                <span className="text-xs font-bold text-[#FFDE59] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trực Quan Thời Gian Thực</span>
                </span>
                <span className="text-[10px] text-[#FFE5A3]/60 italic">Cập nhật ngay khi gõ</span>
              </div>

              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2C14E]/15 text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/30 uppercase">
                  {CATEGORIES.find((c) => c.id === category)?.name}
                </span>
                <h2
                  style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
                  className="text-2xl text-[#ffde59] uppercase tracking-wider font-bold mt-2"
                >
                  {title || 'Chưa có tiêu đề'}
                </h2>
              </div>

              <InfographicArticleRenderer
                rawContent={content}
                title={title}
                subtitle={subtitle}
                author={author}
                authorLink={authorLink}
                popups={keywords.map((k) => ({
                  keyword: k.keyword,
                  title: k.title,
                  subtitle: k.subtitle,
                  description: k.description,
                  imageUrl: k.imageUrl || bannerImage,
                  linkUrl: k.linkUrl || '',
                }))}
                onKeywordClick={(kw) => {
                  const match = keywords.find((k) => k.keyword.toLowerCase() === kw.toLowerCase());
                  if (match) setPreviewModal(match);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── FLOATING BOTTOM SAVE BAR ── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1C120A]/95 backdrop-blur-md border border-[#F2C14E]/50 rounded-2xl px-5 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-3">
        <span className="text-xs text-[#FFE5A3] font-medium hidden sm:inline">
          {isDirty ? '⚠️ Có thay đổi chưa lưu' : '✅ Đã lưu phiên bản mới nhất'}
        </span>

        <button
          type="button"
          onClick={() => handleSave({ stay: true })}
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
          <span>{saving ? 'Đang Lưu...' : 'Lưu Thay Đổi (Ctrl+S)'}</span>
        </button>

        {slug && (
          <button
            type="button"
            onClick={() => handleSave({ stay: true, openPreview: true })}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#25170E] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/40 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span>Lưu &amp; Xem Trên Web</span>
          </button>
        )}
      </div>

      {/* ── MODALS ── */}
      {previewModal && (
        <KeywordTooltipModal
          popup={{
            keyword: previewModal.keyword,
            title: previewModal.title || previewModal.keyword,
            subtitle: previewModal.subtitle,
            description: previewModal.description,
            imageUrl: previewModal.imageUrl || bannerImage,
            linkUrl: previewModal.linkUrl,
          }}
          onClose={() => setPreviewModal(null)}
        />
      )}

      <ImageFocalPositionerModal
        isOpen={focalModalOpen}
        imageUrl={bannerImage}
        initialPosition={bannerPosition}
        onSave={(pos: string) => {
          setIsDirty(true);
          setBannerPosition(pos);
        }}
        onClose={() => setFocalModalOpen(false)}
      />

      <UnsavedChangesModal
        isOpen={unsavedModalOpen}
        saving={saving}
        onSave={async () => {
          await handleSave({ stay: false });
          setUnsavedModalOpen(false);
          if (pendingExitUrl) router.push(pendingExitUrl);
        }}
        onDiscard={() => {
          setIsDirty(false);
          setUnsavedModalOpen(false);
          if (pendingExitUrl) router.push(pendingExitUrl);
        }}
        onCancel={() => setUnsavedModalOpen(false)}
      />

      {/* MODAL THƯ VIỆN ẢNH WORDPRESS DÙNG CHUNG */}
      <WordPressMediaModal
        isOpen={wpMediaModalOpen}
        onClose={() => setWpMediaModalOpen(false)}
        onSelectImage={handleSelectWpMedia}
        title={
          wpMediaTarget === 'banner'
            ? 'Chọn Ảnh Bìa Hero Banner từ WordPress'
            : 'Chèn Hình Ảnh Minh Họa từ WordPress'
        }
      />
    </div>
  );
}
