'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Cloud,
  Eye,
  CheckCircle2,
  Loader2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  Layers,
  FileText,
  Crosshair,
} from 'lucide-react';
import Link from 'next/link';
import { S3FileExplorerModal } from './S3FileExplorerModal';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { ImageFocalPositionerModal } from './ImageFocalPositionerModal';
import { PostRecord } from '@/app/api/admin/posts/route';

interface PostFormEditorProps {
  initialData?: PostRecord;
  isEditing?: boolean;
}

const CATEGORY_STRUCTURE = [
  {
    id: 'dong-chay-hoang-phap',
    name: '1. Dòng Chảy Hoằng Pháp',
    subcategories: [
      { id: 'cong-tu', name: 'Cộng Tu Định Kỳ' },
      { id: 'khoa-le-truyen-thong', name: 'Khóa Lễ Truyền Thống' },
      { id: 'dai-le-su-kien', name: 'Đại Lễ Sự Kiện' },
      { id: 'tinh-do-nhan-gian', name: 'Tịnh Độ Nhân Gian' },
    ],
  },
  {
    id: 'tong-chi-tu-hoc',
    name: '2. Tông Chỉ Tu Học',
    subcategories: [
      { id: 'tong-phong-truyen-thua', name: 'Tông Phong Truyền Thừa' },
      { id: 'nen-tang-tu-hoc', name: 'Nền Tảng Tu Học' },
      { id: 'phuong-phap-hanh-tri', name: 'Phương Pháp Hành Trì' },
      { id: 'lo-trinh-tu-hoc', name: 'Lộ Trình Tu Học' },
      { id: 'nep-song-thien-gia', name: 'Nếp Sống Thiền Gia' },
    ],
  },
  {
    id: 'tri-tue-phat-phap',
    name: '3. Trí Tuệ Phật Pháp',
    subcategories: [
      { id: 'an-pham-phat-giao', name: 'Ấn Phẩm Phật Giáo & Sách' },
      { id: 'bai-viet-phap-thoai', name: 'Bài Viết & Pháp Thoại' },
    ],
  },
  {
    id: 'gioi-thieu',
    name: '4. Giới Thiệu Tông Phong',
    subcategories: [
      { id: 'lich-su-tung-lam-hoa-phuc', name: 'Lịch Sử Tùng Lâm Hòa Phúc' },
      { id: 'tieu-su-su-to', name: 'Tiểu Sử Sư Tổ Ngộ Chân Tử' },
      { id: 'su-ong-hoang-phap', name: 'Hòa Thượng Thích Chân Tính' },
      { id: 'su-phu-tru-tri', name: 'Thầy Viện Chủ Thích Tâm Hòa' },
      { id: 'van-hoa-ung-xu', name: 'Văn Hóa Ứng Xử Tùng Lâm' },
      { id: 'dai-su-lien-dang', name: 'Đại Sự Liên Đăng' },
    ],
  },
];

export function PostFormEditor({ initialData, isEditing = false }: PostFormEditorProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<PostRecord>>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    subtitle: initialData?.subtitle || '',
    mainCategory: initialData?.mainCategory || 'dong-chay-hoang-phap',
    subCategory: initialData?.subCategory || 'cong-tu',
    author: initialData?.author || 'Ban Văn Hóa Tùng Lâm',
    publishedDate: initialData?.publishedDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'published',
    thumbnailUrl:
      initialData?.thumbnailUrl ||
      'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
    bannerUrl:
      initialData?.bannerUrl ||
      'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
    summary: initialData?.summary || '',
    contentHtml: initialData?.contentHtml || '',
  });

  const [saving, setSaving] = useState(false);
  const [s3ModalOpen, setS3ModalOpen] = useState(false);
  const [activeImageTarget, setActiveImageTarget] = useState<'thumbnail' | 'banner' | 'content'>('thumbnail');
  const [focalModalOpen, setFocalModalOpen] = useState(false);
  const [focalTarget, setFocalTarget] = useState<'thumbnail' | 'banner'>('thumbnail');
  const [previewMode, setPreviewMode] = useState(false);

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

  const selectedCategoryObj = CATEGORY_STRUCTURE.find(
    (c) => c.id === formData.mainCategory
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug:
        !isEditing || !prev.slug
          ? val
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : prev.slug,
    }));
  };

  const handleSelectS3Image = (url: string) => {
    setIsDirty(true);
    if (activeImageTarget === 'thumbnail') {
      setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
    } else if (activeImageTarget === 'banner') {
      setFormData((prev) => ({ ...prev, bannerUrl: url }));
    } else if (activeImageTarget === 'content') {
      setFormData((prev) => ({
        ...prev,
        contentHtml:
          (prev.contentHtml || '') +
          `\n<p><img src="${url}" alt="Hình ảnh bài viết" class="rounded-xl shadow-lg my-4 max-w-full h-auto" /></p>\n`,
      }));
    }
    setS3ModalOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    try {
      setSaving(true);
      const url = isEditing && initialData?.id ? `/api/admin/posts/${initialData.id}` : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        alert(isEditing ? 'Đã cập nhật bài viết thành công!' : 'Đã đăng bài viết mới thành công!');
        router.push(pendingExitUrl || '/admin/posts');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi lưu bài viết');
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setSaving(false);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      setPendingExitUrl('/admin/posts');
      setUnsavedModalOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── 1. TOP ACTIONS BAR ── */}
      <div className="bg-[#25170E]/90 border border-[#F2C14E]/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky top-4 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            onClick={handleBackClick}
            className="w-10 h-10 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
            title="Quay lại danh sách bài viết"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wide font-normal"
            >
              {isEditing ? 'CHỈNH SỬA BÀI VIẾT' : 'SOẠN THẢO BÀI VIẾT MỚI'}
            </h1>
            <p className="text-[11px] text-[#FFE5A3]/70">
              Quản trị nội dung & hình ảnh đồng bộ từ S3 Cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 ${
              previewMode
                ? 'bg-[#F2C14E] text-[#1C120A] border-[#F2C14E]'
                : 'bg-[#1C120A] text-[#FFE5A3] border-[#F2C14E]/30 hover:border-[#F2C14E]'
            }`}
            title={previewMode ? 'Quay lại chế độ soạn thảo' : 'Xem trước bài viết'}
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1C120A] border border-[#F2C14E] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(242,193,78,0.4)] cursor-pointer disabled:opacity-50 hover:scale-105"
            title={saving ? 'Đang lưu bài viết...' : isEditing ? 'Lưu cập nhật bài viết' : 'Xuất bản bài viết mới'}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {previewMode ? (
        /* ── PREVIEW MODE ── */
        <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl p-6 md:p-10 space-y-6 shadow-2xl">
          <div className="space-y-2 text-center border-b border-[#F2C14E]/20 pb-6">
            <span className="px-3 py-1 rounded-full bg-[#25170E] border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase">
              {formData.mainCategory}
            </span>
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl sm:text-6xl text-[#FFE5A3] font-normal uppercase"
            >
              {formData.title || 'Tiêu đề bài viết'}
            </h1>
            {formData.subtitle && (
              <p className="text-sm text-[#FFE5A3]/80 italic">{formData.subtitle}</p>
            )}
            <div className="flex items-center justify-center gap-4 text-xs text-[#FFE5A3]/60 pt-2">
              <span>Tác giả: {formData.author}</span>
              <span>•</span>
              <span>Ngày đăng: {formData.publishedDate}</span>
            </div>
          </div>

          {formData.bannerUrl && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden bg-[#25170E] shadow-xl">
              <img
                src={formData.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {formData.summary && (
            <div className="p-4 rounded-xl bg-[#25170E]/80 border-l-4 border-[#F2C14E] text-[#FFE5A3] text-sm leading-relaxed">
              <strong>Tóm tắt:</strong> {formData.summary}
            </div>
          )}

          <div
            className="prose prose-invert prose-yellow max-w-none text-[#e3d2c1] leading-relaxed text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: formData.contentHtml || '<p>Chưa có nội dung chi tiết...</p>' }}
          />
        </div>
      ) : (
        /* ── EDITING MODE ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: MAIN CONTENT (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tiêu đề & Subtitle */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs text-[#F2C14E] font-bold mb-1.5">
                  Tiêu Đề Bài Viết *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                  className="w-full px-4 py-2.5 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-sm text-[#FFE5A3] placeholder-[#FFE5A3]/30 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F2C14E] font-bold mb-1.5">
                  Đường Dẫn Slug (Tự động tạo)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="duong-dan-bai-viet"
                  className="w-full px-4 py-2 bg-[#25170E] border border-[#F2C14E]/20 rounded-xl text-xs text-[#FFE5A3]/80 focus:outline-none focus:border-[#F2C14E] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F2C14E] font-bold mb-1.5">
                  Tiêu Đề Phụ / Trích Dẫn (Subtitle)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Câu chú thích hoặc trích yếu ngắn gọn..."
                  className="w-full px-4 py-2 bg-[#25170E] border border-[#F2C14E]/20 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#F2C14E] font-bold mb-1.5">
                  Tóm Tắt Ngắn Gọn (Summary)
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Đoạn văn ngắn hiển thị trên thẻ bài viết ở Trang Chủ và danh sách..."
                  className="w-full px-4 py-2.5 bg-[#25170E] border border-[#F2C14E]/20 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] leading-relaxed"
                />
              </div>
            </div>

            {/* Nội Dung Chi Tiết (Editor) */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#F2C14E] font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Nội Dung Chi Tiết (HTML / Văn Bản)</span>
                </label>

                {/* Chèn ảnh từ S3 vào nội dung */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageTarget('content');
                    setS3ModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1C120A] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Chèn ảnh từ Thư Viện S3 vào nội dung bài viết"
                >
                  <Cloud className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={16}
                value={formData.contentHtml}
                onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                placeholder="Nhập nội dung chi tiết bài viết (Hỗ trợ mã HTML: <p>, <h3>, <ul>, <li>, <strong>, <em>...)"
                className="w-full px-4 py-3 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#FFE5A3]/30 focus:outline-none focus:border-[#F2C14E] font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: TAXONOMY & MEDIA (1 Col) */}
          <div className="space-y-6">
            {/* Chuyên Mục & Xuất Bản */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-xs text-[#F2C14E] font-bold uppercase tracking-wider pb-2 border-b border-[#F2C14E]/20 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Phân Loại Chuyên Mục</span>
              </h3>

              <div>
                <label className="block text-xs text-[#FFE5A3]/90 font-medium mb-1.5">
                  Chuyên Mục Chính *
                </label>
                <select
                  value={formData.mainCategory}
                  onChange={(e) => {
                    const newMain = e.target.value;
                    const catObj = CATEGORY_STRUCTURE.find((c) => c.id === newMain);
                    setFormData({
                      ...formData,
                      mainCategory: newMain,
                      subCategory: catObj?.subcategories[0]?.id || '',
                    });
                  }}
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                >
                  {CATEGORY_STRUCTURE.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategoryObj && (
                <div>
                  <label className="block text-xs text-[#FFE5A3]/90 font-medium mb-1.5">
                    Tiểu Mục Con
                  </label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                  >
                    {selectedCategoryObj.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs text-[#FFE5A3]/90 font-medium mb-1.5">
                  Trạng Thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                >
                  <option value="published">Đã xuất bản (Công khai)</option>
                  <option value="draft">Bản nháp (Lưu trữ nội bộ)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-[#FFE5A3]/90 font-medium mb-1">
                    Tác Giả
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#25170E] border border-[#F2C14E]/20 rounded-lg text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#FFE5A3]/90 font-medium mb-1">
                    Ngày Đăng
                  </label>
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#25170E] border border-[#F2C14E]/20 rounded-lg text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                  />
                </div>
              </div>
            </div>

            {/* Ảnh Đại Diện (Thumbnail) */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2C14E]/20">
                <label className="text-xs text-[#F2C14E] font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Ảnh Đại Diện (Thumbnail)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFocalTarget('thumbnail');
                      setFocalModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1C120A] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                    title="Kéo thả căn chỉnh tiêu điểm trọng tâm ảnh (Focal Point)"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImageTarget('thumbnail');
                      setS3ModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1C120A] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                    title="Chọn ảnh đại diện từ Thư Viện S3"
                  >
                    <Cloud className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#25170E] border border-[#F2C14E]/20 relative">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ objectPosition: formData.thumbnailPosition || 'center center' }}
                />
              </div>

              <input
                type="text"
                value={formData.thumbnailUrl}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({ ...formData, thumbnailUrl: e.target.value });
                }}
                placeholder="https://s2-cnv03.s3..."
                className="w-full px-3 py-1.5 bg-[#25170E] border border-[#F2C14E]/20 rounded-lg text-[11px] text-[#FFE5A3]/80 font-mono focus:outline-none focus:border-[#F2C14E]"
              />
            </div>

            {/* Ảnh Bìa (Banner Lớn) */}
            <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2C14E]/20">
                <label className="text-xs text-[#F2C14E] font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Ảnh Bìa Bài Viết (Hero Banner)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFocalTarget('banner');
                      setFocalModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1C120A] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                    title="Kéo thả căn chỉnh tiêu điểm ảnh Banner (Focal Point)"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImageTarget('banner');
                      setS3ModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1C120A] border border-[#F2C14E]/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                    title="Chọn ảnh bìa banner từ Thư Viện S3"
                  >
                    <Cloud className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-[#25170E] border border-[#F2C14E]/20 relative">
                <img
                  src={formData.bannerUrl}
                  alt="Banner"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ objectPosition: formData.bannerPosition || 'center center' }}
                />
              </div>

              <input
                type="text"
                value={formData.bannerUrl}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({ ...formData, bannerUrl: e.target.value });
                }}
                placeholder="https://s2-cnv03.s3..."
                className="w-full px-3 py-1.5 bg-[#25170E] border border-[#F2C14E]/20 rounded-lg text-[11px] text-[#FFE5A3]/80 font-mono focus:outline-none focus:border-[#F2C14E]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── S3 FILE EXPLORER MODAL ── */}
      <S3FileExplorerModal
        isOpen={s3ModalOpen}
        onClose={() => setS3ModalOpen(false)}
        onSelectImage={handleSelectS3Image}
      />

      {/* ── IMAGE FOCAL POSITIONER MODAL ── */}
      <ImageFocalPositionerModal
        isOpen={focalModalOpen}
        imageUrl={focalTarget === 'thumbnail' ? (formData.thumbnailUrl || '') : (formData.bannerUrl || '')}
        initialPosition={
          focalTarget === 'thumbnail'
            ? (formData.thumbnailPosition || '50% 50%')
            : (formData.bannerPosition || '50% 50%')
        }
        title={`Căn Tiêu Điểm: ${focalTarget === 'thumbnail' ? 'Ảnh Đại Diện Thumbnail' : 'Ảnh Bìa Hero Banner'}`}
        onSave={(newPos) => {
          setIsDirty(true);
          if (focalTarget === 'thumbnail') {
            setFormData((prev) => ({ ...prev, thumbnailPosition: newPos }));
          } else {
            setFormData((prev) => ({ ...prev, bannerPosition: newPos }));
          }
        }}
        onClose={() => setFocalModalOpen(false)}
      />

      {/* ── UNSAVED CHANGES MODAL ── */}
      <UnsavedChangesModal
        isOpen={unsavedModalOpen}
        saving={saving}
        onSave={() => handleSubmit()}
        onDiscard={() => {
          setIsDirty(false);
          setUnsavedModalOpen(false);
          router.push(pendingExitUrl || '/admin/posts');
        }}
        onCancel={() => {
          setUnsavedModalOpen(false);
          setPendingExitUrl(null);
        }}
      />
    </form>
  );
}
