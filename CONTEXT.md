# 📌 BỐI CẢNH DỰ ÁN & MASTER IMPLEMENTATION PLAN (CONTEXT.md)

## 1. Thông Tin Tổng Quan
- **Dự án:** Website Tùng Lâm Hòa Phúc (`Tung_Lam_Hoa_Phuc_Web`)
- **Backend:** WordPress Headless CMS + Vietnix S3 Cloud Storage
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + TypeScript + Prisma

## 2. Quy Tắc Code & Kỹ Thuật (Bắt buộc tuân thủ)
1. **Thương hiệu & Giao diện:** Luôn tuân thủ tông màu Phật giáo (vàng đồng, nâu ấm, sẫm màu). Dùng Tailwind CSS, tối ưu Responsive mượt mà.
2. **Xử lý Dữ liệu:** Đọc kĩ tài liệu trong `/docs` trước khi làm Component mới. Xử lý cẩn thận các trường hợp API WordPress trả về `null` / `undefined`.
3. **Chuẩn Async Params Next.js 16:**
   - Server Components: Phải `async` và `await params`, `await searchParams`.
   - Client Components (`'use client'`): Dùng `React.use(params)` hoặc hook `useParams()`, `useSearchParams()`.
4. **Typography & Font Fallback:**
   - Cấu hình Google Fonts fallback (như Playfair Display, Merriweather, Inter) nếu các font UTM local báo lỗi 404 ra Terminal.

---

## 🔤 3. Bộ Quy Chuẩn 5 Phông Chữ (Typography System)

| Phông chữ | Vị trí áp dụng |
|---|---|
| `UTM Niagara` | Tiêu đề lớn phát sáng chữ vàng (*GIẢNG ĐƯỜNG*, *BẢN ĐỒ TUỆ GIÁC*, *KHÁM PHÁ KHO TÀNG TRÍ TUỆ*) |
| `UTM Classizism Antiqua` | Phụ đề, slogan, tiêu đề bài viết (*PHÁP BẢO LƯU THÔNG*, *Những Pháp Thoại Nổi Bật*) |
| `UTM Avo` | Văn bản thân bài, mô tả ngắn, metadata thẻ (chủ đề, ngày, lượt xem) |
| `UTM Avo Bold` | Tooltip keyword nổi bật trong bài viết → mở Pop-up giải nghĩa |
| `UTM Avo Italic` | Chú thích ảnh (image captions) dưới ảnh minh họa |

---

## 🏛️ 4. Cấu Trúc Kiến Trúc Dự Án & Các Khu Vực

Mỗi khu vực trải nghiệm gồm **2 TẦNG (Layers)**:
- **Layer 1 — Tâm Linh & Tôn Nghiêm:** Hero Banner, Giới thiệu Drop Cap, Grid Bảo Tượng (`StatueCollectionGrid`), Không Gian Kiến Trúc (`ArchitectureSpaceGallery`), Khám Phá Khu Vực Khác.
- **Layer 2 — Tri Thức & Dữ Liệu Số Hóa:** (Tam Bảo → Lịch sử/Video, Tổ Đường → Bản Đồ Tuệ Giác, Giảng Đường → Pháp Thoại TED-style, Tứ Ân → Tro cốt Glide Page, Tàng Kinh Các → Thư Viện Số Native Web Text).

### 📺 C. GIẢNG ĐƯỜNG — KHO TÀNG PHÁP THOẠI (TED.com-inspired)
- **Route:** `/vu-tru-phat-giao/giang-duong` | **Component:** `GiangDuongPhapThoai.tsx`
- **Hero Section:** Drop Cap **K** + Giới thiệu giảng đường 700m².
- **Carousel Pháp Thoại Nổi Bật:** Thumbnail 16:9 + Waveform + Thư pháp + Giảng sư *Sa-môn Vô Trí* + Metadata.
- **TED.com Discovery Engine:**
  - *Thanh tìm kiếm cảm xúc:* 🔍 "Bạn đang cảm thấy như thế nào?"
  - *Smart Multi-Filter:* Dropdown Lục Chọn (Tâm lý, Chánh niệm, Tu tập...), Filter thời lượng (`60+ PHÚT`), Sắp xếp (`MỚI NHẤT`).
  - *Tag Cloud Cảm Xúc Nhanh (Quick-Tags):* Map với `seo_tags` & `phap_thoai_purpose_tags`.
  - *Grid Kết Quả:* Infinite scroll / Xem thêm.
- **Pre-footer:** *Những chủ đề bạn đang quan tâm* (Reference TED footer).

### 🌌 D. TỔ ĐƯỜNG — BẢN ĐỒ TUỆ GIÁC: DANH TĂNG
- **Component:** `WisdomMapOfPatriarchs.tsx`
- **Galaxy Map:** Dải ngân hà các Chòm Danh Tăng (Trúc Lâm, Tây Thiên, Zen, Himalaya...).
- **5 Bộ Lọc Học Thuật:** Tên Tổ Sư, Thời kỳ, Hệ phái/Vùng miền, Quote từ khóa, Thanh trượt Zoom Level.

### 📚 E. TÀNG KINH CÁC — THƯ VIỆN SỐ
- Native Web Text (Mục → Chương → Đoạn), Tìm kiếm trực tiếp, Tương tác chú thích, Tải PDF.

### 🤖 F. SMART SEARCH & TRỢ LÝ PHẬT HỌC AI
- **Route:** `/api/ai/ask` | **Component:** `SmartSearchAIBar.tsx` (RAG Knowledge Base).

### 🗺️ G. VŨ TRỤ PHẬT GIÁO (`/vu-tru-phat-giao`)
- **Chế độ 1:** Interactive Map UI (Sơ đồ 2D + 15 pin ghim + Sidebar Pop-up).
- **Chế độ 2:** Grid Mode (Filter 8 khu vực kiến trúc).

---

## 🚀 5. Lộ Trình & Nhiệm Vụ Thực Hiện (Ưu tiên hàng đầu)
1. **Nhiệm vụ 1 (Sửa lỗi nền tảng):** Refactor chuẩn async `params` / `searchParams` Next.js 16 và dọn triệt để lỗi Font 404 ra Terminal.
2. **Nhiệm vụ 2 (Trang Chủ):** Dựng hoàn thiện **Trang Chủ** đúng chuẩn thiết kế thực tế (sẽ cập nhật theo hình ảnh/yêu cầu cụ thể).
3. **Nhiệm vụ 3 (Trang Tông Chỉ Tu Học):** Dựng hoàn thiện trang **Tông Chỉ Tu Học** chuẩn giao diện và luồng nội dung.
4. **Nhiệm vụ 4 (Trang Giảng Đường):** Xây dựng Component Giảng Đường `/vu-tru-phat-giao/giang-duong` theo thiết kế TED.com-inspired.
5. **Nhiệm vụ 5 (Tổ Đường & AI):** Triển khai Bản Đồ Tuệ Giác Tổ Đường `WisdomMapOfPatriarchs.tsx` và Trợ Lý AI Phật Học.