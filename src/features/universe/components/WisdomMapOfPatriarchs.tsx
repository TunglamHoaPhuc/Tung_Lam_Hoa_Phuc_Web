'use client';

import { FC, useState } from "react";
import { Search, Filter, ZoomIn, X, Sparkles, BookOpen } from "lucide-react";
import { PATRIARCH_NODES, WISDOM_CLUSTERS, PatriarchNode } from "@/data/wisdom-map-data";

export const WisdomMapOfPatriarchs: FC = () => {
  // 5 Filter Bar States
  const [searchName, setSearchName] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedSect, setSelectedSect] = useState("all");
  const [searchQuote, setSearchQuote] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Selected Node for Modal
  const [selectedNode, setSelectedNode] = useState<PatriarchNode | null>(PATRIARCH_NODES[3]); // Default Thích Quảng Đức or null

  // Filter logic
  const filteredNodes = PATRIARCH_NODES.filter((node) => {
    if (searchName.trim() && !node.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }
    if (selectedPeriod !== "all" && node.period !== selectedPeriod) {
      return false;
    }
    if (selectedSect !== "all" && node.sect !== selectedSect) {
      return false;
    }
    if (searchQuote.trim() && !node.quote.toLowerCase().includes(searchQuote.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full relative overflow-hidden rounded-3xl border shadow-2xl"
      style={{
        background: "linear-gradient(160deg, #1A120B 0%, #0D0A06 100%)",
        borderColor: "rgba(242,193,78,0.4)",
        boxShadow: "0 16px 60px rgba(0,0,0,0.8), 0 0 32px rgba(242,193,78,0.15)",
      }}
    >
      {/* ── SECTION HEADER ── */}
      <div className="p-6 md:p-8 text-center border-b relative z-10" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#F2C14E] animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-[.3em] text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            HỆ THỐNG TRUYỀN THỪA TÂM LINH &amp; DANH TĂNG BẤT HỦ
          </span>
        </div>

        <h2
          className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-[#F2C14E]"
          style={{
            fontFamily: "'UTM Niagara', 'Playfair Display', serif",
            textShadow: "0 0 36px rgba(242,193,78,0.7), 0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          BẢN ĐỒ TUỆ GIÁC: DANH TĂNG VIỆT NAM VÀ THẾ GIỚI
        </h2>
      </div>

      {/* ── GIAO DIỆN TINH VÂN / NGÂN HÀ TƯƠNG TÁC (INTERACTIVE GALAXY MAP) ── */}
      <div
        className="relative w-full overflow-hidden transition-transform duration-300"
        style={{ minHeight: "580px", maxHeight: "720px" }}
      >
        {/* Background Galaxy & Ancient Map SVG */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&h=900&fit=crop"
            alt="Bản đồ Ngân hà Tuệ Giác Danh Tăng"
            className="w-full h-full object-cover opacity-35"
            style={{ minHeight: "580px" }}
          />

          {/* Starfield SVG overlays & constellation lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {/* Constellation connection lines between nodes */}
            <line x1="25%" y1="32%" x2="32%" y2="40%" stroke="#F2C14E" strokeWidth="1" strokeDasharray="4" />
            <line x1="32%" y1="40%" x2="22%" y2="48%" stroke="#F2C14E" strokeWidth="1" strokeDasharray="4" />
            <line x1="68%" y1="28%" x2="75%" y2="42%" stroke="#F2C14E" strokeWidth="1" strokeDasharray="4" />

            {/* Ambient stars */}
            {[...Array(30)].map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 47 + 15) % 100}%`}
                cy={`${(i * 31 + 10) % 100}%`}
                r={i % 4 === 0 ? 2 : 1}
                fill="#F2C14E"
                opacity={0.3 + (i % 5) * 0.15}
              />
            ))}
          </svg>

          {/* ── PATRIARCH STAR NODES ── */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all"
                style={{
                  left: `${node.pos.x}%`,
                  top: `${node.pos.y}%`,
                }}
                aria-label={`Vị Tổ Sư: ${node.name}`}
              >
                {/* Glowing Star Halo */}
                <div
                  className="w-12 h-12 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"
                  style={{
                    background: "radial-gradient(circle, rgba(242,193,78,0.4) 0%, transparent 70%)",
                    transform: isSelected ? "translate(-50%,-50%) scale(1.4)" : "translate(-50%,-50%) scale(1)",
                  }}
                />

                {/* Portrait Node Circle */}
                <div
                  className="w-10 h-10 rounded-full border-2 overflow-hidden relative z-10 transition-all group-hover:scale-125 shadow-xl"
                  style={{
                    borderColor: isSelected ? "#ffffff" : "#F2C14E",
                    boxShadow: isSelected
                      ? "0 0 24px #F2C14E, 0 0 48px rgba(242,193,78,0.6)"
                      : "0 0 12px rgba(242,193,78,0.3)",
                  }}
                >
                  <img src={node.portraitUrl} alt={node.name} className="w-full h-full object-cover" />
                </div>

                {/* Node Name Tag underneath */}
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap shadow-md transition-all group-hover:scale-105"
                  style={{
                    fontFamily: "'UTM Avo', sans-serif",
                    fontWeight: "bold",
                    background: isSelected ? "#F2C14E" : "rgba(26,18,11,0.85)",
                    color: isSelected ? "#2A1D14" : "#F2C14E",
                    border: "1px solid rgba(242,193,78,0.4)",
                  }}
                >
                  {node.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. THANH CÔNG CỤ TRA CỨU HỌC THUẬT 5 THÀNH PHẦN (BOTTOM BAR) ── */}
      <div
        className="p-5 md:p-6 border-t relative z-30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        style={{
          background: "linear-gradient(180deg, rgba(42,29,20,0.95) 0%, rgba(26,15,8,0.98) 100%)",
          borderColor: "rgba(242,193,78,0.3)",
        }}
      >
        {/* 1. Tên Input */}
        <div>
          <label className="text-[10px] uppercase font-bold text-[#F2C14E] tracking-wider block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            🔍 1. TÊN TỔ SƯ
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nhập tên vị Tổ Sư..."
            className="w-full py-2 px-3 rounded-lg text-xs focus:outline-none transition-all"
            style={{
              background: "rgba(26,15,8,0.8)",
              border: "1px solid rgba(242,193,78,0.3)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          />
        </div>

        {/* 2. Thời kỳ Dropdown */}
        <div>
          <label className="text-[10px] uppercase font-bold text-[#F2C14E] tracking-wider block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            ⏳ 2. THỜI KỲ
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full py-2 px-3 rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
            style={{
              background: "rgba(26,15,8,0.8)",
              border: "1px solid rgba(242,193,78,0.3)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <option value="all">Tất cả thời kỳ</option>
            <option value="Trần">Triều Trần</option>
            <option value="Lý">Triều Lý</option>
            <option value="Lê">Triều Lê</option>
            <option value="Nguyễn">Triều Nguyễn</option>
            <option value="Hiện đại">Hiện đại</option>
            <option value="Cổ đại">Cổ đại quốc tế</option>
          </select>
        </div>

        {/* 3. Hệ phái Dropdown */}
        <div>
          <label className="text-[10px] uppercase font-bold text-[#F2C14E] tracking-wider block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            ☸ 3. HỆ PHÁI / VÙNG MIỀN
          </label>
          <select
            value={selectedSect}
            onChange={(e) => setSelectedSect(e.target.value)}
            className="w-full py-2 px-3 rounded-lg text-xs focus:outline-none transition-all cursor-pointer"
            style={{
              background: "rgba(26,15,8,0.8)",
              border: "1px solid rgba(242,193,78,0.3)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <option value="all">Tất cả hệ phái</option>
            <option value="Trúc Lâm">Thiền phái Trúc Lâm</option>
            <option value="Lâm Tế">Tông Lâm Tế</option>
            <option value="Tào Động">Tông Tào Động</option>
            <option value="Khất Sĩ">Khất Sĩ Nam Bộ</option>
            <option value="Kim Cang">Mật Tông Kim Cang</option>
            <option value="Zen Nhật Bản">Zen Nhật Bản</option>
            <option value="Ấn Độ">Ấn Độ Cổ Đại</option>
          </select>
        </div>

        {/* 4. Quote chứa từ khóa Input */}
        <div>
          <label className="text-[10px] uppercase font-bold text-[#F2C14E] tracking-wider block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            📜 4. PHÁP NGỮ / TỪ KHÓA
          </label>
          <input
            type="text"
            value={searchQuote}
            onChange={(e) => setSearchQuote(e.target.value)}
            placeholder="Tìm theo câu pháp ngữ..."
            className="w-full py-2 px-3 rounded-lg text-xs focus:outline-none transition-all"
            style={{
              background: "rgba(26,15,8,0.8)",
              border: "1px solid rgba(242,193,78,0.3)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          />
        </div>

        {/* 5. Mức độ Zoom Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#F2C14E] mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
            <span>🔍 5. ĐỘ ZOOM BẢN ĐỒ</span>
            <span>{zoomLevel}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="140"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-full accent-[#F2C14E] cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* ── 4. MODAL POP-UP "THẺ TUỆ GIÁC" (Khi click vào một vị Tổ Sư) ── */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border transition-all animate-in zoom-in-95"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.96) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "#F2C14E",
              boxShadow: "0 0 60px rgba(242,193,78,0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Pop-up */}
            <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "rgba(242,193,78,0.2)", background: "rgba(42,29,20,0.6)" }}>
              <Sparkles className="w-5 h-5 text-[#F2C14E]" />
              <h3
                className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#F2C14E]"
                style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
              >
                THẺ TUỆ GIÁC: {selectedNode.name}
              </h3>
            </div>

            {/* Content: Left Portrait + Right Info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Portrait */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div
                  className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 shadow-2xl mb-3"
                  style={{ borderColor: "#F2C14E" }}
                >
                  <img src={selectedNode.portraitUrl} alt={selectedNode.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#F2C14E] tracking-widest" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                  {selectedNode.clusterName}
                </span>
                <span className="text-xs text-[#c9b896] mt-0.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  Triều đại: {selectedNode.period} · {selectedNode.sect}
                </span>
              </div>

              {/* Right Details */}
              <div className="md:col-span-7 space-y-4">
                {/* Quote phát sáng */}
                <div className="p-4 rounded-xl border" style={{ background: "rgba(242,193,78,0.08)", borderColor: "rgba(242,193,78,0.3)" }}>
                  <span className="text-[10px] uppercase font-bold text-[#F2C14E] block mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                    📜 CÂU PHÁP NGỮ BẤT HỦ:
                  </span>
                  <p
                    className="text-base md:text-lg font-bold leading-relaxed text-[#F2C14E] italic"
                    style={{
                      fontFamily: "'UTM ClassizismAntiqua', 'Playfair Display', serif",
                      textShadow: "0 0 12px rgba(242,193,78,0.4)",
                    }}
                  >
                    &ldquo;{selectedNode.quote}&rdquo;
                  </p>
                </div>

                {/* Biography & Virtue */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#F2C14E] mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                    TÍCH THUẬT &amp; CÔNG HẠNH:
                  </h4>
                  <p className="text-xs text-[#e3d2c1] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedNode.summary}
                  </p>
                </div>

                {/* Historical Marks */}
                {selectedNode.historicalMarks && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#F2C14E] mb-1" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                      DẤU ẤN LỊCH SỬ:
                    </h4>
                    <p className="text-xs text-[#c9b896] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                      {selectedNode.historicalMarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t text-center" style={{ borderColor: "rgba(242,193,78,0.2)", background: "rgba(42,29,20,0.6)" }}>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F2C14E] text-[#2A1D14]"
                style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}
              >
                ĐÃ HIỂU ✦
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
