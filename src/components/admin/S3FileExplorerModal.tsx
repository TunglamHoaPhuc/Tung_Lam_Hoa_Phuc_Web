'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Image as ImageIcon,
  Upload,
  UploadCloud,
  Search,
  Trash2,
  Copy,
  CheckCircle2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Loader2,
  Cloud,
  FileText,
  CornerLeftUp,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  ExternalLink,
} from 'lucide-react';

interface S3File {
  url: string;
  key: string;
  name: string;
  size?: number;
  lastModified?: string | Date;
}

interface S3FileExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string, caption?: string) => void;
  initialPath?: string;
}

interface NavTreeCategory {
  id: string;
  name: string;
  subfolders?: { id: string; name: string }[];
}

const FOLDER_NAMES_MAP: Record<string, string> = {
  '01-trang-chu': '1. Trang Chủ & Hoạt Động',
  'calendar_webp': 'Lịch Tháng Tổng Quan',
  '02-tong-chi-tu-hoc': '2. Tông Chỉ Tu Học',
  'tong-phong-truyen-thua': 'Tông Phong Truyền Thừa',
  'nen-tang-tu-hoc': 'Nền Tảng Tu Học',
  'phuong-phap-hanh-tri': 'Phương Pháp Hành Trì',
  'lo-trinh-tu-hoc': 'Lộ Trình Tu Học',
  'nep-song-thien-gia': 'Nếp Sống Thiền Gia',
  '03-dong-chay-hoang-phap': '3. Dòng Chảy Hoằng Pháp',
  'cong-tu': 'Cộng Tu Định Kỳ',
  'khoa-le-truyen-thong': 'Khóa Lễ Truyền Thống',
  'dai-le-su-kien': 'Đại Lễ Sự Kiện',
  'tinh-do-nhan-gian': 'Tịnh Độ Nhân Gian',
  '04-vu-tru-phat-giao': '4. Vũ Trụ Phật Giáo',
  'bao-thap': 'Bảo Tháp & Mandala 5 Tầng',
  'bao-tang': 'Bảo Tàng Triển Lãm & Đời Sống',
  'khong-gian-bao-tang': 'Không Gian Bảo Tàng',
  'doi-song': 'Đời Sống 3 Miền',
  'mien-bac': 'Đời Sống Miền Bắc Xưa',
  'mien-nam': 'Đời Sống Miền Nam Xưa',
  'mien-trung': 'Đời Sống Miền Trung Xưa',
  'phat-giao': 'Nhiếp Ảnh Phật Giáo Lịch Sử',
  'chua-viet-nam-xua': 'Chùa Cổ Việt Nam Xưa',
  'phat-giao-3-mien': 'Chư Tăng Phật Giáo 3 Miền',
  'tam-bao': 'Chính Điện Tam Bảo',
  'to-duong': 'Tổ Đường & Vãng Sinh',
  'giang-duong': 'Giảng Đường & Tàng Kinh Các',
  'tu-an': 'Tứ Ân Đường & Thư Viện',
  '05-bao-tuong-phat-giao': '5. Bảo Tượng Phật Giáo',
  'chu_phat_hai_hoi': 'Chư Phật Hải Hội',
  'thanh_tinh_dai_hai_chung': 'Thanh Tịnh Đại Hải Chúng (Bồ Tát)',
  'thanh_van_thanh_chung': 'Thanh Văn Thánh Chúng (18 La Hán & 10 Đệ Tử)',
  'chu_lich_dai_to_su': 'Chư Lịch Đại Tổ Sư',
  'ho_phap_than_vuong': 'Hộ Pháp Thần Vương & Bát Bộ Kim Cang',
  'linh_vat_phat_giao': 'Linh Vật & Ấn Rồng Triều Nguyễn',
  'cac_an_rong_trieu_dai_nha_nguyen_viet_nam': 'Ấn Rồng Triều Nguyễn',
  'chu_thanh_ho_quoc': 'Chư Thánh Hộ Quốc',
  'dai_thi_chu': 'Đại Thí Chủ',
  '06-33-ung-hoa-than-duc-quan-am': '6. 33 Ứng Hóa Thân Đức Quán Âm',
  '07-anh-tho-cac-vi-cao-tang': '7. Ảnh Thờ Các Vị Cao Tăng & Tổ Sư',
  'bac': 'Chư Tôn Đức Miền Bắc',
  'trung': 'Chư Tôn Đức Miền Trung',
  'nam': 'Chư Tôn Đức Miền Nam',
  'gioi-ni': 'Chư Tôn Đức Ni Giới',
  'anh-hoa-thuong-tong-hop': 'Ảnh Cao Tăng Tổng Hợp',
  '08-tu-an-book': '8. Tứ Ân Book & Ấn Phẩm',
  '09-icon-minh-hoa': '9. Icon & Logo Minh Họa',
  '10-uploads': '10. Kho Tải Lên Chung',
};

const WEBSITE_STRUCTURE: NavTreeCategory[] = [
  {
    id: '01-trang-chu',
    name: '1. Trang Chủ & Hoạt Động',
    subfolders: [
      { id: '01-trang-chu/calendar_webp', name: 'Lịch Tháng Tổng Quan' },
      { id: '01-trang-chu', name: 'Ảnh Nổi Bật Trang Chủ' },
    ],
  },
  {
    id: '02-tong-chi-tu-hoc',
    name: '2. Tông Chỉ Tu Học',
    subfolders: [
      { id: '02-tong-chi-tu-hoc/tong-phong-truyen-thua', name: 'Tông Phong Truyền Thừa' },
      { id: '02-tong-chi-tu-hoc/nen-tang-tu-hoc', name: 'Nền Tảng Tu Học' },
      { id: '02-tong-chi-tu-hoc/phuong-phap-hanh-tri', name: 'Phương Pháp Hành Trì' },
      { id: '02-tong-chi-tu-hoc/lo-trinh-tu-hoc', name: 'Lộ Trình Tu Học' },
      { id: '02-tong-chi-tu-hoc/nep-song-thien-gia', name: 'Nếp Sống Thiền Gia' },
    ],
  },
  {
    id: '03-dong-chay-hoang-phap',
    name: '3. Dòng Chảy Hoằng Pháp',
    subfolders: [
      { id: '03-dong-chay-hoang-phap/cong-tu', name: 'Cộng Tu Định Kỳ' },
      { id: '03-dong-chay-hoang-phap/khoa-le-truyen-thong', name: 'Khóa Lễ Truyền Thống' },
      { id: '03-dong-chay-hoang-phap/dai-le-su-kien', name: 'Đại Lễ Sự Kiện' },
      { id: '03-dong-chay-hoang-phap/tinh-do-nhan-gian', name: 'Tịnh Độ Nhân Gian' },
    ],
  },
  {
    id: '04-vu-tru-phat-giao',
    name: '4. Vũ Trụ Phật Giáo (Tùng Lâm Hòa Phúc)',
    subfolders: [
      { id: '04-vu-tru-phat-giao/bao-thap', name: 'Bảo Tháp & Mandala 5 Tầng' },
      { id: '04-vu-tru-phat-giao/bao-tang/khong-gian-bao-tang', name: 'Không Gian Bảo Tàng' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/doi-song/mien-bac', name: 'Triển Lãm Đời Sống Miền Bắc' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/doi-song/mien-nam', name: 'Triển Lãm Đời Sống Miền Nam' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/doi-song/mien-trung', name: 'Triển Lãm Đời Sống Miền Trung' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/phat-giao', name: 'Nhiếp Ảnh Phật Giáo Lịch Sử' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/phat-giao/chua-viet-nam-xua', name: 'Chùa Cổ Việt Nam Xưa' },
      { id: '04-vu-tru-phat-giao/bao-tang/trien-lam/phat-giao/phat-giao-3-mien', name: 'Chư Tăng Phật Giáo 3 Miền' },
    ],
  },
  {
    id: '05-bao-tuong-phat-giao',
    name: '5. Bảo Tượng Phật Giáo',
    subfolders: [
      { id: '05-bao-tuong-phat-giao/chu_phat_hai_hoi', name: 'Chư Phật Hải Hội' },
      { id: '05-bao-tuong-phat-giao/thanh_tinh_dai_hai_chung', name: 'Thanh Tịnh Đại Hải Chúng (Bồ Tát)' },
      { id: '05-bao-tuong-phat-giao/thanh_van_thanh_chung', name: 'Thanh Văn Thánh Chúng (18 La Hán & 10 Đệ Tử)' },
      { id: '05-bao-tuong-phat-giao/chu_lich_dai_to_su', name: 'Chư Lịch Đại Tổ Sư' },
      { id: '05-bao-tuong-phat-giao/ho_phap_than_vuong', name: 'Hộ Pháp Thần Vương & Bát Bộ Kim Cang' },
      { id: '05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam', name: 'Ấn Rồng Triều Nguyễn' },
      { id: '05-bao-tuong-phat-giao/chu_thanh_ho_quoc', name: 'Chư Thánh Hộ Quốc' },
      { id: '05-bao-tuong-phat-giao/dai_thi_chu', name: 'Đại Thí Chủ' },
    ],
  },
  {
    id: '06-33-ung-hoa-than-duc-quan-am',
    name: '6. 33 Ứng Hóa Thân Đức Quán Âm (64 Ảnh)',
  },
  {
    id: '07-anh-tho-cac-vi-cao-tang',
    name: '7. Ảnh Thờ Các Vị Cao Tăng & Tổ Sư',
    subfolders: [
      { id: '07-anh-tho-cac-vi-cao-tang/bac', name: 'Chư Tôn Đức Miền Bắc' },
      { id: '07-anh-tho-cac-vi-cao-tang/trung', name: 'Chư Tôn Đức Miền Trung' },
      { id: '07-anh-tho-cac-vi-cao-tang/nam', name: 'Chư Tôn Đức Miền Nam' },
      { id: '07-anh-tho-cac-vi-cao-tang/gioi-ni', name: 'Chư Tôn Đức Ni Giới' },
      { id: '07-anh-tho-cac-vi-cao-tang/anh-hoa-thuong-tong-hop', name: 'Ảnh Cao Tăng Tổng Hợp' },
    ],
  },
  {
    id: '08-tu-an-book',
    name: '8. Tứ Ân Book & Ấn Phẩm (30 Bìa Sách)',
  },
  {
    id: '09-icon-minh-hoa',
    name: '9. Icon & Logo Minh Họa (7 Icon)',
  },
  {
    id: '10-uploads',
    name: '10. Kho Tải Lên Chung',
  },
];

const normalizeSearchStr = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
};

const smartSearchMatch = (fileName: string, query: string): boolean => {
  if (!query || !query.trim()) return true;
  const normQuery = normalizeSearchStr(query);
  const normName = normalizeSearchStr(fileName);

  if (normName.includes(normQuery)) return true;

  const tokens = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .split(/[\s\-_]+/)
    .filter(Boolean);

  if (tokens.length > 0 && tokens.every((token) => normName.includes(token))) {
    return true;
  }

  let qIdx = 0;
  for (let i = 0; i < normName.length && qIdx < normQuery.length; i++) {
    if (normName[i] === normQuery[qIdx]) {
      qIdx++;
    }
  }
  return qIdx === normQuery.length;
};

export function S3FileExplorerModal({
  isOpen,
  onClose,
  onSelectImage,
  initialPath = '',
}: S3FileExplorerModalProps) {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'tong-chi-tu-hoc': true,
    'trang-chu': true,
  });
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Fetch directory content
  const loadDirectory = useCallback(async (folderPath: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/upload?path=${encodeURIComponent(folderPath)}`);
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders || []);
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error loading S3 directory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chỉ gọi loadDirectory khi mở modal hoặc khi currentPath thay đổi
  useEffect(() => {
    if (isOpen) {
      loadDirectory(currentPath);
    }
  }, [isOpen, currentPath, loadDirectory]);

  // Navigate into a folder
  const navigateTo = (subFolder: string) => {
    let nextPath = currentPath.replace(/\/+$/, '');
    if (nextPath) nextPath += `/${subFolder}`;
    else nextPath = subFolder;
    setCurrentPath(nextPath);
  };

  // State for repairing links
  const [isRepairing, setIsRepairing] = useState(false);

  const handleRepairLinks = async () => {
    setIsRepairing(true);
    try {
      const res = await fetch('/api/admin/repair-links', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`✨ ${data.message}`);
        loadDirectory(currentPath);
      } else {
        alert(data.error || 'Lỗi khi quét sửa link');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng');
    } finally {
      setIsRepairing(false);
    }
  };

  // Navigate up one level
  const navigateUp = () => {
    const parts = currentPath.replace(/\/+$/, '').split('/').filter(Boolean);
    parts.pop();
    const upPath = parts.join('/');
    setCurrentPath(upPath);
  };

  // Handle create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const targetPath = currentPath
      ? `${currentPath.replace(/\/+$/, '')}/${newFolderName.trim()}`
      : newFolderName.trim();

    try {
      const formData = new FormData();
      formData.append('action', 'create-folder');
      formData.append('folderPath', targetPath);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowNewFolderModal(false);
        setNewFolderName('');
        loadDirectory(currentPath);
        showToast(`Đã tạo thư mục: ${newFolderName}`);
      } else {
        alert(data.error || 'Lỗi khi tạo thư mục');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi tạo thư mục');
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // Reusable array upload function (used by file input and drag & drop)
  const uploadFilesArray = async (uploadFiles: File[]) => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', currentPath || '10-uploads');

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) successCount++;
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    setUploading(false);
    loadDirectory(currentPath);
    showToast(`Đã tải lên thành công ${successCount} ảnh vào "${currentPath || '10-uploads'}"!`);
  };

  // Handle upload files from input
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;
    await uploadFilesArray(Array.from(uploadFiles));
  };

  // Drag and drop event handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setIsDragging(false);
        return 0;
      }
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith('image/') || /\.(webp|jpg|jpeg|png|svg|gif|avif|bmp)$/i.test(f.name)
      );
      if (imageFiles.length > 0) {
        await uploadFilesArray(imageFiles);
      } else {
        showToast('Vui lòng chỉ thả các tệp hình ảnh (jpg, png, webp, svg...)');
      }
    }
  };

  const [previewImage, setPreviewImage] = useState<S3File | null>(null);
  const [renameTarget, setRenameTarget] = useState<S3File | null>(null);
  const [newFileNameInput, setNewFileNameInput] = useState<string>('');
  const [renaming, setRenaming] = useState<boolean>(false);

  // Handle rename file
  const handleRenameFile = async () => {
    if (!renameTarget || !newFileNameInput.trim()) return;
    setRenaming(true);
    try {
      const formData = new FormData();
      formData.append('action', 'rename');
      formData.append('oldKey', renameTarget.key);
      formData.append('newFileName', newFileNameInput.trim());

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const renamedName = newFileNameInput.trim();
        setRenameTarget(null);
        setNewFileNameInput('');
        if (previewImage && previewImage.key === renameTarget.key) {
          setPreviewImage(null);
        }
        loadDirectory(currentPath);
        showToast(`Đã đổi tên thành công: ${renamedName}`);
      } else {
        alert(data.error || 'Lỗi khi đổi tên file');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi đổi tên file');
    } finally {
      setRenaming(false);
    }
  };

  // Handle delete S3 object
  const handleDeleteObject = async (key: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa file "${name}" trên S3 không?`)) return;
    try {
      const res = await fetch(`/api/admin/upload?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (previewImage && previewImage.key === key) {
          setPreviewImage(null);
        }
        loadDirectory(currentPath);
        showToast(`Đã xóa: ${name}`);
      } else {
        alert(data.error || 'Lỗi khi xóa file');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi xóa');
    }
  };

  if (!isOpen) return null;

  // Breadcrumbs path split
  const pathParts = currentPath.replace(/\/+$/, '').split('/').filter(Boolean);

  const filteredFiles = files.filter((f) => smartSearchMatch(f.name, search));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in select-none">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[80] px-5 py-3 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] text-[#FFE5A3] font-bold text-xs shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-5 flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      <div
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className={`bg-[#180E07] border-2 border-[#F2C14E] flex flex-col shadow-[0_0_70px_rgba(242,193,78,0.35)] transition-all duration-200 ${
          isMaximized
            ? 'fixed inset-0 rounded-none w-screen h-screen max-w-none max-h-none p-4 sm:p-6'
            : 'rounded-3xl p-5 sm:p-6 w-full max-w-7xl max-h-[92vh]'
        }`}
      >
        {/* Top Header Bar (Tối Giản, Tinh Tế) */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A1D14] border border-[#F2C14E] flex items-center justify-center text-[#F2C14E] shrink-0 shadow-md">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal"
                >
                  THƯ MỤC HÌNH ẢNH S3
                </h3>
                {loading && (
                  <span className="flex items-center gap-1 text-[11px] text-[#F2C14E] animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang đồng bộ...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRepairLinks}
              disabled={isRepairing}
              className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#38271B] border border-[#F2C14E]/60 text-[#FFE5A3] hover:text-[#ffde59] transition-all flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50 hover:scale-105"
              title="Tự động quét và khớp lại tất cả link ảnh trong bài viết"
            >
              <RefreshCw className={`w-4 h-4 text-[#F2C14E] ${isRepairing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#38271B] border border-[#F2C14E]/40 text-[#FFE5A3] transition-all flex items-center justify-center cursor-pointer hover:scale-105"
              title={isMaximized ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-red-900/60 border border-red-800/40 text-[#c9b896] hover:text-white transition-all flex items-center justify-center cursor-pointer hover:scale-105"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Windows Explorer Main Body */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 py-3 min-h-0">
          {/* 1. CỘT TRÁI: CÂY THƯ MỤC PHÂN CẤP CHUẨN (HIERARCHICAL TREE VIEW) */}
          <div className="w-full md:w-80 bg-[#140B05] border border-[#F2C14E]/25 rounded-2xl p-3 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2C14E]/20 text-xs font-bold text-[#F2C14E]">
              <span className="flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-[#F2C14E]" />
                <span>CÂY THƯ MỤC S3 (Ổ Z:)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(true)}
                className="w-7 h-7 rounded-lg hover:bg-[#2A1D14] text-[#FFE5A3] transition-all flex items-center justify-center cursor-pointer"
                title="Tạo thư mục mới"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#F2C14E]" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {/* Website pages tree */}
              {WEBSITE_STRUCTURE.map((cat) => {
                const isDirectActive = currentPath === cat.id;
                const isChildActive = currentPath.startsWith(`${cat.id}/`);
                const isExpanded = !!expandedFolders[cat.id];
                const hasChildren = cat.subfolders && cat.subfolders.length > 0;

                return (
                  <div key={cat.id} className="space-y-0.5">
                    <div
                      onClick={() => {
                        setCurrentPath(cat.id);
                        if (hasChildren) {
                          setExpandedFolders((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }));
                        }
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all ${
                        isDirectActive
                          ? 'bg-[#F2C14E] text-[#1A120B] font-bold shadow-md'
                          : isChildActive
                          ? 'bg-[#2A1D14] text-[#ffde59] font-bold border border-[#F2C14E]/40'
                          : 'text-[#c9b896] hover:bg-[#25170E] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Folder className={`w-4 h-4 shrink-0 ${isDirectActive ? 'text-[#1A120B]' : 'text-[#F2C14E]'}`} />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedFolders((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }));
                          }}
                          className="p-1 hover:bg-black/20 rounded transition-colors"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Subfolders list */}
                    {hasChildren && isExpanded && (
                      <div className="pl-4 space-y-0.5 border-l border-[#F2C14E]/20 ml-3">
                        {cat.subfolders!.map((sub) => {
                          const isSubActive = currentPath === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => setCurrentPath(sub.id)}
                              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                                isSubActive
                                  ? 'bg-[#F2C14E] text-[#1A120B] font-bold shadow-sm'
                                  : 'text-[#c9b896] hover:bg-[#25170E] hover:text-white'
                              }`}
                            >
                              <Folder className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-[#1A120B]' : 'text-[#F2C14E]/70'}`} />
                              <span className="truncate text-[11px]">{sub.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. KHU VỰC PHẢI: BREADCRUMBS, TOOLBAR & DANH SÁCH FILE */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 flex flex-col bg-[#21140B] border relative transition-all duration-200 rounded-2xl p-4 min-h-0 overflow-hidden ${
              isDragging
                ? 'border-[#F2C14E] ring-4 ring-[#F2C14E]/40 bg-[#2C190D]'
                : 'border-[#F2C14E]/30'
            }`}
          >
            {/* Drag & Drop Visual Overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-40 bg-[#140B05]/92 backdrop-blur-md border-4 border-dashed border-[#F2C14E] rounded-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 pointer-events-none shadow-[0_0_50px_rgba(242,193,78,0.4)]">
                <div className="w-16 h-16 rounded-2xl bg-[#2A1D14] border-2 border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-[0_0_30px_rgba(242,193,78,0.6)] animate-bounce">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-center px-4">
                  <p className="text-base sm:text-lg font-bold text-[#ffde59] uppercase tracking-wider">
                    Thả ảnh vào đây để tải lên S3
                  </p>
                  <p className="text-xs text-[#FFE5A3] mt-1">
                    Ảnh sẽ được tự động nén chuẩn WebP vào thư mục: <strong>{currentPath || '10-uploads'}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Breadcrumb Path Bar & Toolbar */}
            <div className="flex items-center justify-between gap-3 bg-[#170D06] px-3.5 py-2 rounded-xl border border-[#F2C14E]/25 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-[#FFE5A3] overflow-x-auto custom-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setCurrentPath('')}
                  className="hover:underline text-[#F2C14E] font-bold flex items-center gap-1.5"
                >
                  <Cloud className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Kho S3</span>
                </button>
                {pathParts.map((part, idx) => {
                  const sub = pathParts.slice(0, idx + 1).join('/');
                  const displayName = FOLDER_NAMES_MAP[part] || part;
                  return (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3.5 h-3.5 text-[#c9b896]/50 shrink-0" />
                      <button
                        type="button"
                        onClick={() => setCurrentPath(sub)}
                        className={`hover:underline font-bold whitespace-nowrap ${
                          idx === pathParts.length - 1 ? 'text-[#ffde59]' : 'text-[#c9b896]'
                        }`}
                      >
                        {displayName}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Action Buttons (100% Vector SVG Icons) */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#F2C14E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm ảnh..."
                    className="pl-7 pr-2.5 py-1.5 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] w-32 sm:w-40"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(true)}
                  className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Tạo thư mục mới"
                >
                  <FolderPlus className="w-4 h-4 text-[#F2C14E]" />
                </button>

                <label className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all flex items-center justify-center cursor-pointer shadow-md hover:scale-105" title="Tải ảnh mới từ máy tính lên S3">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 stroke-[2.5]" />}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={handleUploadFiles}
                  />
                </label>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={() => loadDirectory(currentPath)}
                  className="p-1.5 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] cursor-pointer"
                  title="Làm mới thư mục"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Folder & Files Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="space-y-4">
                {/* 1. DANH SÁCH THƯ MỤC CON */}
                {folders.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-[#F2C14E]/80 uppercase tracking-wider mb-2">
                      Thư mục con ({folders.length}):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {folders.map((f, i) => (
                        <div
                          key={i}
                          onClick={() => navigateTo(f)}
                          className="flex items-center gap-2 p-2.5 bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 hover:border-[#F2C14E] rounded-xl cursor-pointer transition-all shadow-sm group hover:scale-[1.02]"
                        >
                          <Folder className="w-5 h-5 text-[#F2C14E] shrink-0 group-hover:fill-[#F2C14E]" />
                          <span className="text-xs font-bold text-[#FFE5A3] truncate" title={f}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. DANH SÁCH FILE ẢNH */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#F2C14E]/80 uppercase tracking-wider mb-2">
                    Hình ảnh ({filteredFiles.length} file):
                  </h4>
                  {filteredFiles.length === 0 ? (
                    <div className="p-12 text-center text-[#c9b896]/50 border border-dashed border-[#F2C14E]/20 rounded-2xl">
                      {search ? 'Không tìm thấy hình ảnh phù hợp.' : 'Thư mục này chưa có file ảnh nào.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                      {filteredFiles.map((file, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-[#28180E] hover:bg-[#352012] border border-[#F2C14E]/30 hover:border-[#F2C14E] rounded-2xl transition-all shadow-md group flex flex-col justify-between hover:scale-[1.01]"
                        >
                          <div>
                            {/* Thumbnail with overlay buttons */}
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-[#F2C14E]/20 mb-2 cursor-pointer relative group/thumb">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                                loading="lazy"
                                onClick={() => setPreviewImage(file)}
                              />
                              {/* Quick overlay button */}
                              <div
                                onClick={() => setPreviewImage(file)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2"
                              >
                                <span className="p-2 rounded-full bg-[#F2C14E] text-[#1A120B] shadow-lg hover:scale-110 transition-transform">
                                  <Eye className="w-4 h-4" />
                                </span>
                              </div>
                            </div>

                            <p
                              onClick={() => setPreviewImage(file)}
                              className="text-xs font-bold text-[#FFE5A3] hover:text-[#ffde59] truncate cursor-pointer transition-colors"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-[10px] text-[#c9b896]/60 font-mono mt-0.5">
                              {file.size ? `${Math.round(file.size / 1024)} KB` : 'WebP'}
                            </p>
                          </div>

                          {/* Actions bar (100% Vector SVG Icons) */}
                          <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-[#F2C14E]/15">
                            {onSelectImage ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectImage(file.url, file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '));
                                  onClose();
                                }}
                                className="flex-1 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-105"
                                title="Chọn ảnh này vào bài viết"
                              >
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(file.url);
                                  showToast('Đã sao chép link ảnh S3!');
                                }}
                                className="flex-1 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                                title="Sao chép đường dẫn (URL) ảnh này"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Rename Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setRenameTarget(file);
                                setNewFileNameInput(file.name.replace(/\.[^/.]+$/, ''));
                              }}
                              className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/20 text-[#FFE5A3] hover:text-[#ffde59] transition-all flex items-center justify-center cursor-pointer hover:scale-105 shrink-0"
                              title="Đổi tên file này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteObject(file.key, file.name)}
                              className="w-8 h-8 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-800/30 text-red-200 hover:text-white transition-all flex items-center justify-center cursor-pointer hover:scale-105 shrink-0"
                              title="Xóa file này khỏi S3"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Modal Xem Ảnh Chi Tiết (Lightbox Preview) */}
      {previewImage && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(242,193,78,0.4)]">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F2C14E]/30">
              <div className="truncate min-w-0">
                <h4 className="text-base font-bold text-[#ffde59] truncate">{previewImage.name}</h4>
                <p className="text-xs text-[#c9b896]/70 mt-0.5">
                  Dung lượng: {previewImage.size ? `${Math.round(previewImage.size / 1024)} KB` : 'Chuẩn WebP'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-9 h-9 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
                title="Đóng xem trước"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image display */}
            <div className="flex-1 min-h-0 bg-black/80 rounded-2xl border border-[#F2C14E]/20 overflow-hidden flex items-center justify-center p-2 mb-4 relative">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Action buttons inside Lightbox */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewImage.url);
                    showToast('Đã sao chép link ảnh S3!');
                  }}
                  className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Sao chép đường dẫn (URL) ảnh"
                >
                  <Copy className="w-4 h-4 text-[#F2C14E]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRenameTarget(previewImage);
                    setNewFileNameInput(previewImage.name.replace(/\.[^/.]+$/, ''));
                  }}
                  className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                  title="Đổi tên file ảnh"
                >
                  <Edit3 className="w-4 h-4 text-[#F2C14E]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteObject(previewImage.key, previewImage.name)}
                  className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-red-950 border border-red-800/40 text-red-300 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  title="Xóa ảnh này vĩnh viễn khỏi S3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {onSelectImage && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectImage(previewImage.url, previewImage.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '));
                    setPreviewImage(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black border border-[#F2C14E] transition-all shadow-[0_0_20px_rgba(242,193,78,0.4)] flex items-center justify-center cursor-pointer hover:scale-105"
                  title="Chọn ảnh này chèn vào bài viết"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Đổi Tên File */}
      {renameTarget && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="text-base font-bold text-[#ffde59] mb-1 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#F2C14E]" />
              <span>Đổi Tên File Ảnh</span>
            </h4>
            <p className="text-xs text-[#c9b896] mb-3 truncate">
              Tên hiện tại: <strong>{renameTarget.name}</strong>
            </p>

            <input
              type="text"
              value={newFileNameInput}
              onChange={(e) => setNewFileNameInput(e.target.value)}
              placeholder="Nhập tên file mới..."
              className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] mb-4"
              autoFocus
            />

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F2C14E]/20">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Hủy bỏ"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRenameFile}
                disabled={renaming || !newFileNameInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black border border-[#F2C14E] disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-all"
                title="Lưu tên file mới"
              >
                {renaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Tạo Thư Mục Mới */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h4 className="text-base font-bold text-[#ffde59] mb-1 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#F2C14E]" />
              <span>Tạo Thư Mục Mới</span>
            </h4>
            <p className="text-xs text-[#c9b896] mb-4">
              Vị trí: <strong>{currentPath || 'Thư mục Gốc'}</strong>
            </p>

            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nhập tên thư mục (ví dụ: tam-giac-tam-bao)..."
              className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] mb-4"
              autoFocus
            />

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F2C14E]/20">
              <button
                type="button"
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Hủy bỏ"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black border border-[#F2C14E] disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-all"
                title="Tạo thư mục mới"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default S3FileExplorerModal;

