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
} from 'lucide-react';
import { KeywordTooltipModal } from '@/components/tong-chi-tu-hoc/KeywordTooltipModal';
import { UnsavedChangesModal } from '@/components/admin/UnsavedChangesModal';
import { ImageFocalPositionerModal } from '@/components/admin/ImageFocalPositionerModal';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';

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

export function TongChiEditor({ initialData, isEdit }: TongChiEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('editor');
  const [previewModal, setPreviewModal] = useState<any | null>(null);

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

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isDragOverBanner, setIsDragOverBanner] = useState(false);

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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Chuyên mục tu học</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setIsDirty(true);
                      setCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Đường dẫn tĩnh (Slug URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsDirty(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="Tự sinh từ tiêu đề nếu để trống"
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#FFE5A3]">Tác giả / Lời kệ</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => {
                      setIsDirty(true);
                      setAuthor(e.target.value);
                    }}
                    placeholder="Sa Môn Vô Trí (Thích Tâm Hòa)"
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
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

            {/* 2. TRÌNH SOẠN THẢO CHUYÊN NGHIỆP CÓ TOOLBAR WORDPRESS */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#F2C14E]/15 pb-2">
                <h2 className="text-xs sm:text-sm font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFDE59]" />
                  <span>2. Nội Dung &amp; Kệ Thơ Phật Học</span>
                </h2>
                <span className="text-[11px] text-[#c9b896]/70 hidden sm:inline">
                  Hỗ trợ Markdown &amp; HTML mượt mà chuẩn WordPress
                </span>
              </div>

              {/* WORDPRESS-STYLE WYSIWYG TOOLBAR */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl shadow-inner">
                {/* Heading 2 */}
                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '\n', 'TIÊU ĐỀ LỚN')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Tiêu đề đề mục lớn (H2)"
                >
                  <Heading2 className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>H2</span>
                </button>

                {/* Heading 3 */}
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '\n', 'TIÊU ĐỀ MỤC NHỎ')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Tiêu đề mục nhỏ (H3 - Tự tạo Anchor mục lục bên trái)"
                >
                  <Heading3 className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>H3</span>
                </button>

                <div className="w-[1px] h-5 bg-[#F2C14E]/30 mx-1" />

                {/* Bold */}
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'chữ in đậm')}
                  className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 transition-all cursor-pointer"
                  title="In đậm (Bold)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'chữ in nghiêng')}
                  className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 transition-all cursor-pointer"
                  title="In nghiêng (Italic)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>', 'chữ gạch chân')}
                  className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 transition-all cursor-pointer"
                  title="Gạch chân (Underline)"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-5 bg-[#F2C14E]/30 mx-1" />

                {/* Quote / Kệ thơ */}
                <button
                  type="button"
                  onClick={() =>
                    insertFormatting(
                      '\n> Con nguyện giữ tâm Bồ đề kiên cố\n> Con nguyện hành hạnh tự lợi, lợi tha\n> Đem an vui chan rải đến muôn nhà\n> Để tâm Phật chan hòa trong vũ trụ.\n\n*Vô Trí - Tâm Hòa*\n\n'
                    )
                  }
                  className="px-2 py-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 text-xs flex items-center gap-1 transition-all cursor-pointer"
                  title="Chèn Khối Kệ Thơ / Lời Thầy Viền Vàng Trang Nghiêm"
                >
                  <Quote className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Kệ Thơ</span>
                </button>

                {/* Danh sách List */}
                <button
                  type="button"
                  onClick={() => insertFormatting('\n- Điểm tu học 1\n- Điểm tu học 2\n- Điểm tu học 3\n')}
                  className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 transition-all cursor-pointer"
                  title="Danh sách gạch đầu dòng"
                >
                  <List className="w-3.5 h-3.5" />
                </button>

                {/* Chèn Hình Ảnh */}
                <label className="px-2 py-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] border border-[#F2C14E]/20 text-xs flex items-center gap-1 transition-all cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Chèn Ảnh</span>
                  <input
                    ref={inlineImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUpload(file, (url) => {
                          insertFormatting(`\n![Hình ảnh minh họa](${url})\n`);
                        });
                      }
                    }}
                  />
                </label>

                {/* NÚT TẠO NHANH TỪ KHÓA POPUP TỪ SELECTION */}
                <button
                  type="button"
                  onClick={handleCreateKeywordFromSelection}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#FFDE59] hover:text-[#1A120B] border border-[#F2C14E]/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto shadow-sm"
                  title="Bôi đen một từ trong văn bản rồi bấm nút này để tạo Popup Chú Thích"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Gán Popup Từ Khóa</span>
                </button>
              </div>

              {/* KHUNG SOẠN THẢO CHÍNH */}
              <textarea
                ref={contentTextareaRef}
                rows={16}
                value={content}
                onChange={(e) => {
                  setIsDirty(true);
                  setContent(e.target.value);
                }}
                placeholder="Nhập toàn văn bài thơ hoặc bài viết ở đây...&#10;&#10;Sử dụng:&#10;### TIÊU ĐỀ ĐỀ MỤC (Tự tạo mục lục cuộn trang)&#10;> Khối kệ thơ hoặc lời Thầy viền vàng...&#10;**Từ khóa in đậm** (Tự động gắn Popup nếu trùng tên từ khóa bên dưới)..."
                required
                style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
                className="w-full p-4 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] leading-relaxed shadow-inner"
              />
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
    </div>
  );
}
