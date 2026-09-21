'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderOpen, 
  Cloud, 
  Upload, 
  RefreshCw, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Layers,
  Sparkles,
  HardDrive
} from 'lucide-react';
import S3FileExplorerModal from '@/components/admin/S3FileExplorerModal';

export default function AdminKhoAnhS3Page() {
  const [selectedFolder, setSelectedFolder] = useState<string>('03-dong-chay-hoang-phap/cong-tu');
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  return (
    <div 
      style={{ fontFamily: "'UTM Avo', sans-serif" }} 
      className="min-h-screen bg-[#140D07] text-[#e3d2c1] p-4 sm:p-6 flex flex-col"
    >
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#F2C14E]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A2718] to-[#25170E] border border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E] shadow-[0_0_20px_rgba(242,193,78,0.25)]">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal drop-shadow-sm"
              >
                KHO ẢNH S3 CLOUD BACKBLAZE B2
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/40 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" /> Ổ Z: Sẵn Sàng
              </span>
            </div>
            <p className="text-xs text-[#c9b896]">
              Quản lý toàn diện hình ảnh tư liệu, tự động nén WebP siêu nhẹ và đồng bộ liên thông với toàn bộ các chuyên mục
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="px-4 py-2.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Quản Trị Bài Viết</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsExplorerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(242,193,78,0.4)] cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Mở Cây Thư Mục S3</span>
          </button>
        </div>
      </div>

      {/* Quick Category Access Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Cộng Tu Định Kỳ', path: '03-dong-chay-hoang-phap/cong-tu', icon: '🪷' },
          { label: 'Khóa Lễ Truyền Thống', path: '03-dong-chay-hoang-phap/khoa-le-truyen-thong', icon: '🔔' },
          { label: 'Đại Lễ Sự Kiện', path: '03-dong-chay-hoang-phap/dai-le-su-kien', icon: '🏮' },
          { label: 'Tịnh Độ Nhân Gian', path: '03-dong-chay-hoang-phap/tinh-do-nhan-gian', icon: '🕊️' },
          { label: '1. Trang Chủ & Hoạt Động', path: '01-trang-chu', icon: '🏛️' },
          { label: '2. Tông Chỉ Tu Học', path: '02-tong-chi-tu-hoc', icon: '📜' },
          { label: '4. Vũ Trụ Phật Giáo', path: '04-vu-tru-phat-giao', icon: '🌌' },
          { label: '5. Bảo Tượng Phật Giáo', path: '05-bao-tuong-phat-giao', icon: '✨' },
          { label: '7. Ảnh Thờ Cao Tăng', path: '07-anh-tho-cac-vi-cao-tang', icon: '🙏' },
          { label: '10. Kho Tải Lên Chung', path: '10-uploads', icon: '📁' },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedFolder(item.path);
              setIsExplorerOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-[#1C120A] hover:bg-[#2A1D14] border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all text-left flex items-center gap-2.5 group cursor-pointer shadow-md"
          >
            <span className="text-xl">{item.icon}</span>
            <div className="truncate">
              <div className="text-xs font-bold text-[#FFE5A3] group-hover:text-[#ffde59] truncate">
                {item.label}
              </div>
              <div className="text-[10px] text-[#c9b896]/60 font-mono truncate">
                {item.path}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Image Banner Bar (nếu người dùng vừa chọn ảnh) */}
      {selectedImageUrl && (
        <div className="mb-4 p-4 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3 truncate">
            <img 
              src={selectedImageUrl} 
              alt="Selected" 
              className="w-12 h-12 rounded-xl object-cover border border-[#F2C14E]/60 shrink-0" 
            />
            <div className="truncate">
              <span className="text-xs font-bold text-[#F2C14E] block">Ảnh Đang Được Chọn:</span>
              <span className="text-xs text-[#FFE5A3] font-mono truncate block">{selectedImageUrl}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopyUrl(selectedImageUrl)}
              className="px-3.5 py-2 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedUrl ? <CheckCircle2 className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
              <span>{copiedUrl ? 'Đã Sao Chép!' : 'Sao Chép Link S3'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedImageUrl(null)}
              className="p-2 rounded-xl bg-[#1C120A] hover:bg-red-900/50 text-[#c9b896] hover:text-white transition-all text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Full-Feature S3 Explorer Modal (Mở sẵn mặc định để duyệt cây thư mục) */}
      <S3FileExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        initialPath={selectedFolder}
        onSelectImage={(url) => {
          setSelectedImageUrl(url);
          setIsExplorerOpen(false);
          handleCopyUrl(url);
        }}
      />
    </div>
  );
}
