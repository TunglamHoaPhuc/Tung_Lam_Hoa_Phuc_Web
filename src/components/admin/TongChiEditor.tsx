'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { KeywordTooltipModal } from '@/components/tong-chi-tu-hoc/KeywordTooltipModal';
import { UnsavedChangesModal } from '@/components/admin/UnsavedChangesModal';
import { ImageFocalPositionerModal } from '@/components/admin/ImageFocalPositionerModal';

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
  { id: 'phuong-phap-hanh-tri', name: 'PHƯƠNG PHÁP HÀNH TRÌ' },
  { id: 'thanh-quy-thien-mon', name: 'THANH QUY THIỀN MÔN' },
  { id: 'kinh-ke-phap-bao', name: 'KINH KỆ & PHÁP BẢO' },
];

export function TongChiEditor({ initialData, isEdit }: TongChiEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewModal, setPreviewModal] = useState<any | null>(null);

  // 🌟 Quản lý trạng thái chưa lưu
  const [isDirty, setIsDirty] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingExitUrl, setPendingExitUrl] = useState<string | null>(null);

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
  const [author, setAuthor] = useState(initialData?.author || 'Tùng Lâm Hòa Phúc');
  const [keywords, setKeywords] = useState<KeywordItem[]>(initialData?.keywords || []);

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isDragOverBanner, setIsDragOverBanner] = useState(false);

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
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền Tiêu đề và Nội dung bài viết');
      return;
    }

    setSaving(true);
    const catObj = CATEGORIES.find((c) => c.id === category);

    const payload = {
      title,
      subtitle,
      slug,
      category,
      categoryName: catObj?.name || 'TÔNG PHONG TRUYỀN THỪA',
      bannerImage,
      bannerPosition,
      excerpt: excerpt || content.slice(0, 160) + '...',
      content,
      author,
      keywords: keywords.filter((k) => k.keyword.trim() && k.title.trim()),
    };

    try {
      const endpoint = isEdit ? `/api/admin/tong-chi/${initialData.id}` : '/api/admin/tong-chi';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        alert(isEdit ? '✅ Đã cập nhật bài viết thành công!' : '✅ Đã tạo bài viết mới thành công!');
        router.push(pendingExitUrl || '/admin/tong-chi');
        router.refresh();
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

  // Render preview text with highlighted keywords
  const renderPreviewText = (text: string) => {
    if (!text) return null;
    let parts: Array<{ text: string; kw?: KeywordItem }> = [{ text }];

    keywords.forEach((kw) => {
      if (!kw.keyword.trim()) return;
      const newParts: typeof parts = [];
      const regex = new RegExp(`(${kw.keyword.trim()})`, 'gi');

      parts.forEach((p) => {
        if (p.kw) {
          newParts.push(p);
          return;
        }
        const splits = p.text.split(regex);
        splits.forEach((s) => {
          if (s.toLowerCase() === kw.keyword.trim().toLowerCase()) {
            newParts.push({ text: s, kw });
          } else if (s) {
            newParts.push({ text: s });
          }
        });
      });
      parts = newParts;
    });

    return (
      <div style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }} className="space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line text-[#FFE5A3]">
        {parts.map((p, idx) => {
          if (p.kw) {
            return (
              <span
                key={idx}
                onClick={() => setPreviewModal(p.kw)}
                className="cursor-pointer font-bold text-[#F2C14E] border-b-2 border-dashed border-[#F2C14E] hover:text-[#ffde59] hover:bg-[#F2C14E]/20 px-1 py-0.5 rounded transition-all inline-flex items-center gap-0.5"
                title={`Bấm để xem popup chú thích: ${p.kw.title}`}
              >
                <span>{p.text}</span>
                <Sparkles className="w-3 h-3 text-[#ffde59] inline" />
              </span>
            );
          }
          return <span key={idx}>{p.text}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F2C14E]/25">
        <Link
          href="/admin/tong-chi"
          onClick={handleBackClick}
          className="w-10 h-10 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
          title="Quay lại danh sách bài viết"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 ${
              activeTab === 'preview'
                ? 'bg-[#F2C14E] text-[#1C120A] border-[#F2C14E]'
                : 'bg-[#1C120A] text-[#FFE5A3] border-[#F2C14E]/30 hover:border-[#F2C14E]'
            }`}
            title={activeTab === 'editor' ? 'Xem trước tương tác (Preview)' : 'Quay lại soạn thảo'}
          >
            <Eye className="w-5 h-5 text-[#F2C14E]" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center cursor-pointer disabled:opacity-50 hover:scale-105"
            title={saving ? 'Đang lưu bài viết...' : isEdit ? 'Cập nhật bài viết' : 'Xuất bản bài viết'}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        /* LIVE PREVIEW TAB */
        <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#F2C14E]/20 pb-4">
            <span className="px-3 py-1 rounded-full bg-[#F2C14E]/15 text-[#F2C14E] text-xs font-bold border border-[#F2C14E]/30 uppercase">
              {CATEGORIES.find((c) => c.id === category)?.name}
            </span>
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl text-[#ffde59] uppercase tracking-wider font-normal mt-3"
            >
              {title || 'Chưa có tiêu đề'}
            </h1>
            {subtitle && <p className="text-sm text-[#FFE5A3]/80 italic mt-1">{subtitle}</p>}
          </div>

          <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#F2C14E]/20 bg-black/40">
            <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 rounded-2xl bg-[#25170E] border border-[#F2C14E]/20">
            <h3 className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider mb-4">
              Nội Dung &amp; Kệ Thơ (Bấm vào các từ in đậm viền vàng để thử Popup):
            </h3>
            {renderPreviewText(content)}
          </div>
        </div>
      ) : (
        /* EDITOR TAB */
        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. THÔNG TIN CƠ BẢN */}
          <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-2 border-b border-[#F2C14E]/15 pb-2">
              <span>1. Thông Tin Cơ Bản</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FFE5A3]">Tiêu đề bài viết / Kệ thơ *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: TÔNG PHONG TRUYỀN THỪA TRÚC LÂM ĐẠI ĐẠO"
                  required
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FFE5A3]">Tiêu đề phụ / Lời tựa ngắn</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ví dụ: Kế Thừa Ngọn Đèn Chánh Pháp Thiền Phái Trúc Lâm"
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FFE5A3]">Chuyên mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                <label className="text-xs font-semibold text-[#FFE5A3]">Đường dẫn tĩnh (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Tự sinh nếu để trống"
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#FFE5A3]">Tác giả / Ban biên soạn</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tùng Lâm Hòa Phúc"
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            </div>

            {/* Banner Image */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#FFE5A3]">
                <span>Ảnh bìa bài viết (Kéo thả ảnh trực tiếp vào ô bên dưới)</span>
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
                    <span>Tải ảnh từ máy tính</span>
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

          {/* 2. NỘI DUNG VÀ KỆ THƠ */}
          <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F2C14E]/15 pb-2">
              <h2 className="text-sm font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-2">
                <span>2. Nội Dung Bài Viết / Kệ Thơ</span>
              </h2>
              <span className="text-[11px] text-[#c9b896]/70 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#F2C14E]" />
                Các từ khóa khai báo bên dưới sẽ tự động được gán Popup chú thích
              </span>
            </div>

            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập toàn văn bài thơ hoặc bài viết ở đây...&#10;&#10;Ví dụ:&#10;Thiền phái Trúc Lâm do Phật Hoàng sáng lập...&#10;Tùng Lâm Hòa Phúc kế thừa mạng mạch Đại Sư Liên Đăng..."
              required
              style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
              className="w-full p-4 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] leading-relaxed"
            />
          </div>

          {/* 3. BẢNG QUẢN LÝ POPUP CHÚ THÍCH TỪ KHÓA */}
          <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2C14E]/15 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#ffde59] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                  <span>3. Bảng Quản Lý Popup Chú Thích Thuật Ngữ ({keywords.length} từ khóa)</span>
                </h2>
                <p className="text-[11px] text-[#c9b896]/80">
                  Mỗi khi độc giả bấm vào từ khóa này trong bài thơ, popup ảnh và lời giải nghĩa sẽ bật lên trang nghiêm.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddKeyword}
                className="w-9 h-9 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A120B] border border-[#F2C14E]/50 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Thêm từ khóa chú thích mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {keywords.length === 0 ? (
              <div className="p-8 text-center bg-[#25170E]/50 rounded-xl border border-dashed border-[#F2C14E]/30 text-xs text-[#c9b896]/60 space-y-2">
                <p>Chưa có từ khóa chú thích nào.</p>
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="text-[#F2C14E] font-bold hover:underline"
                >
                  + Bấm vào đây để thêm từ khóa đầu tiên (ví dụ: Trúc Lâm, Liên Đăng, Lục Hòa...)
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
                        #Từ khóa {idx + 1}
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
                          Từ khóa trong bài thơ *
                        </label>
                        <input
                          type="text"
                          value={kw.keyword}
                          onChange={(e) => handleUpdateKeyword(idx, 'keyword', e.target.value)}
                          placeholder="Ví dụ: Trúc Lâm"
                          className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-[#F2C14E] font-bold focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#FFE5A3]">
                          Tiêu đề Popup *
                        </label>
                        <input
                          type="text"
                          value={kw.title}
                          onChange={(e) => handleUpdateKeyword(idx, 'title', e.target.value)}
                          placeholder="Ví dụ: Thiền Phái Trúc Lâm Yên Tử"
                          className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#FFE5A3]">Tiêu đề phụ</label>
                        <input
                          type="text"
                          value={kw.subtitle || ''}
                          onChange={(e) => handleUpdateKeyword(idx, 'subtitle', e.target.value)}
                          placeholder="Ví dụ: Dòng Thiền Nhập Thế"
                          className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#FFE5A3]">
                        Nội dung giải thích thuật ngữ / Tích truyện *
                      </label>
                      <textarea
                        rows={3}
                        value={kw.description}
                        onChange={(e) => handleUpdateKeyword(idx, 'description', e.target.value)}
                        placeholder="Nhập lời giải nghĩa chi tiết cho thuật ngữ..."
                        className="w-full p-2.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#F2C14E] leading-relaxed"
                      />
                    </div>

                    {/* Image & Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#FFE5A3]">
                          <span>Ảnh minh họa Popup</span>
                          <label className="cursor-pointer text-[10px] text-[#F2C14E] hover:underline flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Tải ảnh lên</span>
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
                        <input
                          type="text"
                          value={kw.imageUrl || ''}
                          onChange={(e) => handleUpdateKeyword(idx, 'imageUrl', e.target.value)}
                          placeholder="/images/..."
                          className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-[#c9b896] focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#FFE5A3]">
                          Liên kết tìm hiểu thêm (Tùy chọn)
                        </label>
                        <input
                          type="text"
                          value={kw.linkUrl || ''}
                          onChange={(e) => handleUpdateKeyword(idx, 'linkUrl', e.target.value)}
                          placeholder="/gioi-thieu/dai-su-lien-dang"
                          className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs text-[#c9b896] focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      )}

      {/* Test Tooltip Modal */}
      {previewModal && (
        <KeywordTooltipModal
          popup={{
            keyword: previewModal.keyword || 'Từ khóa',
            title: previewModal.title || 'Tiêu đề Popup',
            subtitle: previewModal.subtitle,
            imageUrl: previewModal.imageUrl || '/images/toan-canh-chua.jpg',
            description: previewModal.description || '',
            linkUrl: previewModal.linkUrl,
          }}
          onClose={() => setPreviewModal(null)}
        />
      )}

      {/* ── IMAGE FOCAL POSITIONER MODAL ── */}
      <ImageFocalPositionerModal
        isOpen={focalModalOpen}
        imageUrl={bannerImage}
        initialPosition={bannerPosition || '50% 50%'}
        title="Căn Tiêu Điểm Ảnh Bìa Tông Chỉ"
        onSave={(newPos) => {
          setIsDirty(true);
          setBannerPosition(newPos);
        }}
        onClose={() => setFocalModalOpen(false)}
      />

      {/* ── UNSAVED CHANGES MODAL ── */}
      <UnsavedChangesModal
        isOpen={unsavedModalOpen}
        saving={saving}
        onSave={() => handleSave()}
        onDiscard={() => {
          setIsDirty(false);
          setUnsavedModalOpen(false);
          router.push(pendingExitUrl || '/admin/tong-chi');
        }}
        onCancel={() => {
          setUnsavedModalOpen(false);
          setPendingExitUrl(null);
        }}
      />
    </div>
  );
}
