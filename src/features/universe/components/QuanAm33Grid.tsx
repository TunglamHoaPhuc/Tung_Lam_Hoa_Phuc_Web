'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, X, Flame, Eye, Scroll } from 'lucide-react';
import { QUAN_AM_33_DATA, QuanAm33Item } from '@/data/quan-am-33-data';

interface CardProps {
  item: QuanAm33Item;
  onSelect: (item: QuanAm33Item) => void;
}

const QuanAmCard = React.memo(({ item, onSelect }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative w-full h-[400px] cursor-pointer perspective-1000"
      onClick={() => onSelect(item)}
    >
      <motion.div
        className="w-full h-full relative transform-gpu transition-all duration-500 rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] shadow-xl hover:border-[#F2C14E] overflow-hidden flex flex-col justify-between"
        whileHover={{ y: -4 }}
      >
        {/* TOP IMAGE FRAME */}
        <div className="relative w-full h-[250px] bg-[#1A120B] overflow-hidden">
          <img
            src={item.imgUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=800&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#25170E] via-transparent to-black/40" />

          {/* Number Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1C130D]/90 border border-[#F2C14E]/50 backdrop-blur-md shadow-md">
            QUẺ SỐ {item.number}
          </div>
        </div>

        {/* BOTTOM CONTENT */}
        <div className="p-4 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#25170E] to-[#1C130D] text-center">
          <div>
            <h3
              className="text-[#F2C14E] text-xl font-bold leading-snug group-hover:text-white transition-colors mb-1 truncate"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {item.title}
            </h3>
            <p
              className="text-[#c9b896] text-xs line-clamp-2 italic"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              "{item.phatDay.split('\n')[0] || 'Phật dạy gieo nhân lành gặt quả ngọt...'}"
            </p>
          </div>

          <div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2" />
            <div
              className="flex items-center justify-between text-[11px] text-[#FFE5A3] font-bold px-1"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span className="flex items-center gap-1 text-[#F2C14E]">
                <Sparkles className="w-3 h-3" />
                <span>Xem quẻ &amp; Lời dạy</span>
              </span>
              <span className="text-[#F2C14E] group-hover:translate-x-1 transition-transform">
                Lật thẻ ➔
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

QuanAmCard.displayName = 'QuanAmCard';

export const QuanAm33Grid: FC = () => {
  const [selectedItem, setSelectedItem] = useState<QuanAm33Item | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleRandomDraw = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUAN_AM_33_DATA.length);
      setSelectedItem(QUAN_AM_33_DATA[randomIndex]);
      setIsShuffling(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
            >
              33 ỨNG HÓA THÂN ĐỨC QUAN THẾ ÂM BỒ TÁT
            </h2>
            <p
              className="text-xs md:text-sm text-[#c9b896]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Chiêm bái 33 diệu tướng ứng hóa thân &amp; Xốc quẻ cầu nguyện nhận lời chỉ dạy tâm linh
            </p>
          </div>

          {/* Xốc Quẻ Button */}
          <button
            type="button"
            onClick={handleRandomDraw}
            disabled={isShuffling}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#D4A017] text-[#1C130D] text-xs md:text-sm font-bold shadow-[0_0_25px_rgba(242,193,78,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto uppercase tracking-wider"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Sparkles className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? 'ĐANG XỐC QUẺ CẦU NGUYỆN...' : 'XỐC QUẺ CẦU NGUYỆN 🔮'}</span>
          </button>
        </div>

        {/* GRID OF CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {QUAN_AM_33_DATA.map((item) => (
            <QuanAmCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))}
        </div>
      </div>

      {/* POPUP MODAL SHOWING QUẺ DETAIL & 3D CARD FLIP */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateY: -90, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="relative w-full max-w-[650px] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1A120B 100%)',
                border: '2px solid rgba(242,193,78,0.6)',
                boxShadow: '0 0 80px rgba(242,193,78,0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 border border-[#c8aa6e]/40 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Header */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-center border-b border-[#c8aa6e]/30">
                <h3
                  className="text-lg md:text-xl font-normal text-[#F2C14E] uppercase tracking-widest text-center"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  QUẺ TÂM LINH SỐ {selectedItem.number} • {selectedItem.title}
                </h3>
              </div>

              {/* Popup Content */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Left: Image */}
                <div className="relative w-44 mx-auto sm:mx-0 shrink-0 rounded-xl overflow-hidden border-2 border-[#F2C14E]/60 shadow-2xl bg-[#1A120B] p-2 self-start">
                  <img
                    src={selectedItem.imgUrl}
                    alt={selectedItem.name}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                  <div className="mt-2 text-center text-[10px] text-[#F2C14E] font-bold uppercase tracking-wider">
                    Ứng Hóa Thân Quan Âm
                  </div>
                </div>

                {/* Right: Teaching & Verse */}
                <div className="flex-1 min-w-0 flex flex-col gap-3 text-left">
                  {/* Phật Dạy */}
                  {selectedItem.phatDay && (
                    <div>
                      <h4
                        className="text-xs text-[#F2C14E] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <Scroll className="w-4 h-4 text-[#F2C14E]" />
                        <span>PHẬT DẠY:</span>
                      </h4>
                      <blockquote
                        className="bg-[#3A2718]/80 p-3.5 rounded-xl border-l-2 border-[#F2C14E] text-xs md:text-sm text-[#FFE5A3] italic whitespace-pre-line leading-relaxed"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        "{selectedItem.phatDay}"
                      </blockquote>
                    </div>
                  )}

                  {/* Lời Bàn Giải Quẻ */}
                  {selectedItem.loiBan && (
                    <div className="mt-2">
                      <h4
                        className="text-xs text-[#F2C14E] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                        <span>LỜI BÀN GIẢI QUẺ:</span>
                      </h4>
                      <div
                        className="bg-[#1C130D] p-3.5 rounded-xl border border-[#F2C14E]/20 text-xs md:text-sm text-[#D3C0AD] whitespace-pre-line leading-relaxed"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedItem.loiBan}
                      </div>
                    </div>
                  )}

                  {/* Action Re-draw */}
                  <div className="mt-2 pt-2 border-t border-[#F2C14E]/20 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRandomDraw}
                      className="px-4 py-2 rounded-xl bg-[#2A1D14] border border-[#F2C14E]/40 text-xs font-bold text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C130D] transition-all cursor-pointer flex items-center gap-1.5"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Xốc quẻ khác</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
