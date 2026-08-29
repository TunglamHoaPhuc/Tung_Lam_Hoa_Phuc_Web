'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, Heart, BookOpen, ShieldCheck, ChevronRight, X, Clock, Eye } from 'lucide-react';

interface ChayArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  readTime: string;
  views: string;
}

const CHAY_ARTICLES: ChayArticle[] = [
  {
    id: 'art-01',
    category: 'TƯỢNG PHÁP CHAY ĐƯỜNG',
    title: 'Tôn Tượng Ngài Giám Trai Sứ Giả & Đức Phật A Di Đà Tiếp Dẫn',
    subtitle: 'Hộ trì trai soạn thanh tịnh và tiếp dẫn thiện tâm trước giờ thọ trai',
    excerpt: 'Tìm hiểu ý nghĩa tôn tượng Đại Thánh Khẩn Na La Vương (Giám Trai Sứ Giả) bảo hộ nhà bếp và Đức Phật A Di Đà phóng quang tiếp dẫn tâm an lạc.',
    content: [
      'Tại Trai đường Tùng Lâm Hòa Phúc, nơi chuẩn bị và thọ thực những bữa cơm thanh tịnh, tôn tượng Đức Giám Trai Sứ Giả (Đại Thánh Khẩn Na La Vương) được an vị trang nghiêm tại trung tâm gian bếp Hương Tích.',
      'Theo truyền thống Phật giáo Đại thừa, Ngài Giám Trai là vị Bồ Tát thị hiện làm thần hộ trì trai trạo, giám sát việc cung cấp ẩm thực thanh tịnh cho đại chúng tu học, xua tan chướng nạn và giữ gìn ngọn lửa từ bi luôn ấm áp.',
      'Phía ngoài Trai đường là tôn tượng Đức Từ Phụ A Di Đà tiếp dẫn với ánh mắt từ bi, nhắc nhở hành giả trước mỗi bữa ăn hãy giữ tâm niệm thanh tịnh, buông xả muộn phiền để tiếp nhận nguồn năng lượng an lành từ đất trời.',
    ],
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp',
    readTime: '5 phút đọc',
    views: '12.4K',
  },
  {
    id: 'art-02',
    category: 'DINH DƯỠNG DƯỠNG SINH',
    title: 'Nghệ Thuật Ẩm Thực Chay Dưỡng Sinh & Cân Bằng Ngũ Hành',
    subtitle: 'Chế độ ăn thực vật tươi sạch giúp thân thể nhẹ nhàng, tâm trí sáng suốt',
    excerpt: 'Phương pháp phối hợp ngũ sắc (Xanh, Đỏ, Vàng, Trắng, Đen) và ngũ vị từ các loại rau củ, nấm và hạt tự nhiên tốt cho sức khỏe tu tập.',
    content: [
      'Ăn chay tại Tùng Lâm Hòa Phúc không chỉ đơn thuần là không sử dụng thực phẩm từ động vật, mà là cả một nghệ thuật dưỡng sinh thuận theo tự nhiên.',
      'Bếp Hương Tích chú trọng phối hợp các nguyên liệu theo thuyết Ngũ Hành: Màu xanh (mộc - dưỡng gan), màu đỏ (hỏa - bổ tim), màu vàng (thổ - kiện tỳ vị), màu trắng (kim - nhuận phế), màu đen (thủy - ích thận).',
      'Thực phẩm hoàn toàn không sử dụng chất bảo quản, mì chính hóa học, mà lấy vị ngọt thanh tự nhiên từ củ cải, mía lau, nấm đông cô và các loại hạt dinh dưỡng như hạt sen, óc chó, hạnh nhân.',
    ],
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp',
    readTime: '6 phút đọc',
    views: '18.9K',
  },
  {
    id: 'art-03',
    category: 'BÀI THUỐC DÂN GIAN',
    title: 'Các Bài Thuốc Thảo Dược Dân Gian Bồi Bổ Thân Tâm Chốn Tùng Lâm',
    subtitle: 'Ứng dụng thảo mộc tự nhiên quanh vườn chùa phòng ngừa bệnh tật mùa vụ',
    excerpt: 'Những bài trà thảo dược như Trà Gừng Táo Đỏ, Nước La Hán Quả, Trà Hoa Cúc Kỷ Tử giúp thanh nhiệt, ấm tỳ vị và tăng cường sức đề kháng.',
    content: [
      'Từ nguồn thảo dược được trồng tự nhiên quanh khuôn viên chùa, chư Tăng Ni và ban Trai soạn thường xuyên nấu những ấm trà thảo mộc phục vụ đại chúng trong các khóa tu.',
      'Trà Gừng Táo Đỏ: Uống vào buổi sớm giúp làm ấm kinh mạch, tán hàn khí, kích hoạt tiêu hóa và giữ ấm cổ họng trong những ngày đông giá rét.',
      'Nước La Hán Quả Cúc Hoa: Giúp thanh nhiệt giải độc, mát gan sáng mắt, nhuận phế chỉ khái sau những giờ tụng kinh niệm Phật kéo dài.',
    ],
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp',
    readTime: '7 phút đọc',
    views: '24.1K',
  },
  {
    id: 'art-04',
    category: 'ĐẠO LÝ THỌ TRAI',
    title: 'Năm Phép Quán Tưởng Trước Bữa Ăn — Nuôi Dưỡng Tâm Tri Ân',
    subtitle: 'Năm điều quán niệm (Ngũ Quán) chuyển hóa bữa ăn thành thời khóa tu tập chánh niệm',
    excerpt: 'Xem thức ăn như vị thuốc chữa bệnh khô gầy, nhớ ơn người gieo trồng và xét đức hạnh của bản thân để xứng đáng thọ nhận.',
    content: [
      '1. Kể công nhiều ít, so chỗ kia đem đến: Quán tưởng công lao khó nhọc của người nông dân cày cấy, người vận chuyển và người nấu nướng.',
      '2. Xét đức hạnh của mình đủ hay thiếu mà thọ của cúng dường: Tự răn mình phải tinh tấn tu tập để không phụ lòng tin thí chủ.',
      '3. Ngừa tâm tham sân si, phòng ngừa các điều tội lỗi: Không khen ngon tham đắm, không chê dở nổi giận.',
      '4. Xem thức ăn như vị thuốc chữa bệnh khô gầy: Ăn để nuôi dưỡng thân mạng tu học, không phải để hưởng thụ khoái lạc.',
      '5. Vì muốn thành tựu đạo nghiệp nên mới thọ nhận thức ăn này: Quyết tâm hướng đến giác ngộ giải thoát và phụng sự chúng sinh.',
    ],
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp',
    readTime: '4 phút đọc',
    views: '15.7K',
  },
];

export const ChayDuongSection: FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ChayArticle | null>(null);

  return (
    <div className="w-full space-y-10">
      {/* ── 1. ARTICLE CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHAY_ARTICLES.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#2A180E] to-[#160B04] border border-[#F2C14E]/30 p-5 flex flex-col justify-between hover:border-[#F2C14E] hover:shadow-[0_12px_40px_rgba(242,193,78,0.25)] transition-all duration-300 cursor-pointer"
          >
            <div>
              {/* Thumbnail Image */}
              <div className="relative w-full h-[220px] rounded-xl overflow-hidden mb-4 bg-[#140B05] border border-[#F2C14E]/20">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Category badge */}
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-md text-[10px] font-bold text-[#FFE5A3] bg-[#8B1E0F]/90 border border-[#F2C14E]/50 uppercase tracking-wider backdrop-blur-sm"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {art.category}
                </span>

                {/* Read time */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-[#FFE5A3]/90 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-[#F2C14E]" />
                  <span>{art.readTime}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3
                className="text-2xl sm:text-3xl text-[#FFE5A3] group-hover:text-[#F2C14E] transition-colors leading-tight uppercase mb-1"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {art.title}
              </h3>
              <p className="text-xs text-[#F2C14E] font-bold mb-2 line-clamp-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {art.subtitle}
              </p>
              <p className="text-xs text-[#e3d2c1]/85 leading-relaxed line-clamp-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {art.excerpt}
              </p>
            </div>

            {/* Bottom action */}
            <div className="mt-4 pt-3 border-t border-[#F2C14E]/20 flex items-center justify-between text-xs text-[#F2C14E] font-bold">
              <span className="group-hover:underline flex items-center gap-1">
                Đọc toàn văn bài viết <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#c9b896]/70">
                <Eye className="w-3 h-3 text-[#F2C14E]" />
                <span>{art.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. FULL ARTICLE MODAL POP-UP ── */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl border-2 border-[#F2C14E] bg-gradient-to-b from-[#2C180E] via-[#1E1108] to-[#120904] p-6 sm:p-8 shadow-[0_0_60px_rgba(242,193,78,0.4)] text-white space-y-5 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="sticky top-0 float-right -mt-2 -mr-2 w-8 h-8 rounded-full bg-black/80 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center border border-[#F2C14E]/50 transition-all cursor-pointer z-30"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold text-[#FFE5A3] bg-[#8B1E0F] border border-[#F2C14E] uppercase"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedArticle.category}
                </span>
                <h2
                  className="text-3xl sm:text-4xl text-[#FFE5A3] uppercase leading-tight pt-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {selectedArticle.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#F2C14E] font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {selectedArticle.subtitle}
                </p>
              </div>

              {/* Cover Image inside modal */}
              <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-[#F2C14E]/40 my-3">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Article Content */}
              <div className="space-y-4 text-xs sm:text-sm text-[#e3d2c1] leading-relaxed text-justify" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {selectedArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="text-center pt-4 border-t border-[#F2C14E]/25">
                <span className="text-[11px] text-[#c9b896]/80 uppercase font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  ❖ HƯƠNG TÍCH BẾP • CHAY ĐƯỜNG TÙNG LÂM HÒA PHÚC ❖
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
