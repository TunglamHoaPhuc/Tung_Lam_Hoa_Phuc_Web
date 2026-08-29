'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit3, Image as ImageIcon, Save, X, Sparkles, Filter, CheckCircle2, Crosshair } from 'lucide-react';
import S3FileExplorerModal from '@/components/admin/S3FileExplorerModal';
import { ImageFocalPositionerModal } from '@/components/admin/ImageFocalPositionerModal';

interface Monk {
  id: string;
  name: string;
  lifespan: string;
  region: string;
  hoi_chung: string;
  sect: string;
  era: string;
  sub_era?: string;
  avatarUrl: string;
  avatarPosition?: string;
  bio?: string;
  phapNgu?: string;
}

export default function AdminDanhTangPage() {
  const [monks, setMonks] = useState<Monk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedAssembly, setSelectedAssembly] = useState('all');

  // Edit Modal State
  const [editingMonk, setEditingMonk] = useState<Monk | null>(null);
  const [isS3ModalOpen, setIsS3ModalOpen] = useState(false);
  const [s3TargetMonkId, setS3TargetMonkId] = useState<string | null>(null);
  const [focalModalOpen, setFocalModalOpen] = useState(false);
  const [focalTargetMonk, setFocalTargetMonk] = useState<Monk | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetchMonks();
  }, []);

  const fetchMonks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/danh-tang');
      const data = await res.json();
      if (data.success) {
        setMonks(data.data);
      }
    } catch (err) {
      console.error('Error fetching monks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMonk = async (monkToSave: Monk) => {
    try {
      const res = await fetch('/api/admin/danh-tang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monkToSave),
      });
      const data = await res.json();
      if (data.success) {
        setMonks((prev) => prev.map((m) => (m.id === monkToSave.id ? monkToSave : m)));
        setEditingMonk(null);
        showToast(`✨ Đã lưu thông tin: ${monkToSave.name}`);
      } else {
        alert(data.error || 'Lỗi khi lưu');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng');
    }
  };

  const handleSelectImageFromS3 = (url: string) => {
    if (s3TargetMonkId) {
      const monk = monks.find((m) => m.id === s3TargetMonkId);
      if (monk) {
        const updated = { ...monk, avatarUrl: url };
        handleSaveMonk(updated);
      }
    } else if (editingMonk) {
      setEditingMonk({ ...editingMonk, avatarUrl: url });
    }
    setIsS3ModalOpen(false);
    setS3TargetMonkId(null);
  };

  const filteredMonks = monks.filter((m) => {
    const matchName = !searchTerm.trim() || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.sect && m.sect.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRegion = selectedRegion === 'all' || m.region === selectedRegion;
    const matchAssembly = selectedAssembly === 'all' || m.hoi_chung === selectedAssembly;
    return matchName && matchRegion && matchAssembly;
  });

  return (
    <div className="min-h-screen bg-[#0D0805] text-[#F7E7CE] p-4 sm:p-8 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] text-[#FFE5A3] font-bold text-sm shadow-2xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#F2C14E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2C14E]/30 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#F2C14E]" />
            <span className="text-xs uppercase tracking-widest text-[#c9b896] font-bold">Hệ Thống Quản Lý Tùng Lâm Hòa Phúc</span>
          </div>
          <h1 style={{ fontFamily: "'UTM Niagara', serif" }} className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal">
            QUẢN LÝ DANH SÁCH DANH TĂNG & TỔ SƯ
          </h1>
          <p className="text-xs text-[#c9b896] mt-1">
            Quản lý thông tin, tiểu sử và hình ảnh chân dung thờ trên S3 của {monks.length} vị Danh Tăng.
          </p>
        </div>

        <button
          onClick={() => {
            setS3TargetMonkId(null);
            setIsS3ModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#2A1D14] hover:bg-[#38271B] border border-[#F2C14E] text-[#FFE5A3] hover:text-[#ffde59] font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#F2C14E]" />
          <span>Mở Kho Ảnh S3 (07-anh-tho-cao-tang)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#180E07] border border-[#F2C14E]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-[#F2C14E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên Danh Tăng, Tông phái, Niên đại..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE] placeholder-[#c9b896]/50 text-xs focus:outline-none focus:border-[#F2C14E]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#c9b896] flex items-center gap-1 font-bold">
            <Filter className="w-3.5 h-3.5 text-[#F2C14E]" /> Lọc:
          </span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-bold text-xs focus:outline-none"
          >
            <option value="all">Vùng miền: Tất cả</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Quốc tế">Quốc tế</option>
          </select>

          <select
            value={selectedAssembly}
            onChange={(e) => setSelectedAssembly(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-bold text-xs focus:outline-none"
          >
            <option value="all">Hội chúng: Tất cả</option>
            <option value="Tăng chúng">Tăng chúng</option>
            <option value="Ni chúng">Ni chúng</option>
          </select>
        </div>
      </div>

      {/* Monks Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-[#F2C14E] animate-pulse">Đang tải danh sách Danh Tăng...</div>
        ) : filteredMonks.length === 0 ? (
          <div className="text-center py-20 text-[#c9b896]">Không tìm thấy Danh Tăng phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMonks.map((monk) => (
              <div
                key={monk.id}
                className="bg-[#180E07] border border-[#F2C14E]/30 hover:border-[#F2C14E] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(242,193,78,0.2)] group"
              >
                <div>
                  {/* Avatar Frame */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-[#2A1D14] border border-[#F2C14E]/20">
                    <img
                      src={monk.avatarUrl}
                      alt={monk.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: monk.avatarPosition || 'center top' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/1.webp';
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/30">
                      {monk.region} • {monk.hoi_chung}
                    </div>

                    {/* Quick Focal Reticle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocalTargetMonk(monk);
                        setFocalModalOpen(true);
                      }}
                      className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-black/85 hover:bg-[#F2C14E] border border-[#F2C14E]/60 text-[#ffde59] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                      title="Kéo thả căn tiêu điểm chân dung"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 style={{ fontFamily: "'UTM Niagara', serif" }} className="text-xl text-[#ffde59] uppercase tracking-wider font-normal line-clamp-1">
                    {monk.name}
                  </h3>
                  <div className="text-xs text-[#c9b896] mt-0.5 mb-1 font-semibold">{monk.lifespan}</div>
                  <div className="text-[11px] text-[#FFE5A3]/80 line-clamp-1 italic">{monk.sect}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F2C14E]/20">
                  <button
                    onClick={() => {
                      setS3TargetMonkId(monk.id);
                      setIsS3ModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#2A1D14] hover:bg-[#38271B] border border-[#F2C14E]/50 text-[#FFE5A3] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                    title="Đổi ảnh từ kho S3"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span className="hidden sm:inline">Ảnh S3</span>
                  </button>
                  <button
                    onClick={() => setEditingMonk(monk)}
                    className="w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffe5a3] text-black font-bold flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 shrink-0"
                    title="Chỉnh sửa tiểu sử & thông tin"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMonk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#180E07] border-2 border-[#F2C14E] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F2C14E]/30 pb-3">
              <h3 style={{ fontFamily: "'UTM Niagara', serif" }} className="text-2xl text-[#ffde59] uppercase">
                CHỈNH SỬA THÔNG TIN DANH TĂNG
              </h3>
              <button onClick={() => setEditingMonk(null)} className="text-[#c9b896] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#c9b896] font-bold mb-1">Tên Danh Tăng</label>
                <input
                  type="text"
                  value={editingMonk.name}
                  onChange={(e) => setEditingMonk({ ...editingMonk, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="block text-[#c9b896] font-bold mb-1">Niên Đại / Năm Sinh - Mất</label>
                <input
                  type="text"
                  value={editingMonk.lifespan}
                  onChange={(e) => setEditingMonk({ ...editingMonk, lifespan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE]"
                />
              </div>

              <div>
                <label className="block text-[#c9b896] font-bold mb-1">Vùng Miền</label>
                <select
                  value={editingMonk.region}
                  onChange={(e) => setEditingMonk({ ...editingMonk, region: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-bold"
                >
                  <option value="Miền Bắc">Miền Bắc</option>
                  <option value="Miền Trung">Miền Trung</option>
                  <option value="Miền Nam">Miền Nam</option>
                  <option value="Quốc tế">Quốc tế</option>
                </select>
              </div>

              <div>
                <label className="block text-[#c9b896] font-bold mb-1">Tông Phái / Hệ Phái</label>
                <input
                  type="text"
                  value={editingMonk.sect}
                  onChange={(e) => setEditingMonk({ ...editingMonk, sect: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#c9b896] font-bold mb-1">Đường Dẫn Ảnh Chân Dung (S3 URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingMonk.avatarUrl}
                    onChange={(e) => setEditingMonk({ ...editingMonk, avatarUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setS3TargetMonkId(null);
                      setIsS3ModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#2A1D14] border border-[#F2C14E] text-[#FFE5A3] font-bold cursor-pointer hover:bg-[#38271B]"
                  >
                    Chọn Từ S3
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#c9b896] font-bold mb-1">Tiểu Sử / Công Hạnh</label>
                <textarea
                  rows={4}
                  value={editingMonk.bio || ''}
                  onChange={(e) => setEditingMonk({ ...editingMonk, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#F7E7CE]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F2C14E]/30">
              <button
                onClick={() => setEditingMonk(null)}
                className="px-4 py-2 rounded-xl hover:bg-[#25170E] text-[#c9b896] font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSaveMonk(editingMonk)}
                className="px-6 py-2.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffe5a3] text-black font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S3 File Explorer Modal */}
      <S3FileExplorerModal
        isOpen={isS3ModalOpen}
        onClose={() => {
          setIsS3ModalOpen(false);
          setS3TargetMonkId(null);
        }}
        initialPath="07-anh-tho-cac-vi-cao-tang"
        onSelectImage={handleSelectImageFromS3}
      />

      {/* Image Focal Positioner Modal */}
      {focalTargetMonk && (
        <ImageFocalPositionerModal
          isOpen={focalModalOpen}
          imageUrl={focalTargetMonk.avatarUrl}
          initialPosition={focalTargetMonk.avatarPosition || '50% 15%'}
          title={`Căn Tiêu Điểm: ${focalTargetMonk.name}`}
          onSave={(newPos) => {
            handleSaveMonk({ ...focalTargetMonk, avatarPosition: newPos });
            setFocalTargetMonk(null);
            setFocalModalOpen(false);
          }}
          onClose={() => {
            setFocalModalOpen(false);
            setFocalTargetMonk(null);
          }}
        />
      )}
    </div>
  );
}
