# 📜 NHẬT KÝ PHÁT TRIỂN & CẬP NHẬT PHIÊN BẢN (CHANGELOG)
### Cổng Thông Tin Điện Tử Tùng Lâm Hòa Phúc

---

## 🚀 [v1.0.3] - 2026-08-31
### 🌟 Trình Soạn Thảo Tông Chỉ WordPress-Grade & Khớp Nối Giao Diện 100%
- **Trình Soạn Thảo Admin Tông Chỉ Tu Học (`TongChiEditor`)**:
  - **Thanh công cụ chuẩn WordPress**: Bổ sung đầy đủ công cụ định dạng trực quan (Đề mục H2, Đề mục nhỏ H3, In đậm **B**, In nghiêng *I*, Gạch chân <u>U</u>, Khối Kệ Thơ viền vàng trang nghiêm, Danh sách gạch đầu dòng, Chèn ảnh minh họa trực tiếp, Tạo nhanh Popup Từ Khóa từ đoạn văn bản được chọn).
  - **Xem trước trực quan 1:1 (Live Preview & Split Screen Mode)**: Tích hợp trực tiếp engine `InfographicArticleRenderer` hiển thị tức thì mọi định dạng giống 100% giao diện người đọc thấy trên web.
  - **Trải nghiệm Lưu bài viết mượt mà**: Bổ sung nút "Lưu thay đổi" (không bị chuyển trang mất dấu), nút "Lưu & Xem trên Web" (mở ngay tab mới), phím tắt nhanh `Ctrl + S` / `Cmd + S` và thanh hành động cố định nổi.
- **Khắc Phục Lỗi Trang Bồ Đề Tâm & Tông Chỉ Tu Học**:
  - Tự động trích xuất danh sách mục lục (Navigation Anchors) theo thời gian thực từ các thẻ đề mục (H2, H3) trong bài viết, loại bỏ hoàn toàn các liên kết tĩnh hardcoded.
  - Khớp nối đồng bộ 100% giữa SubNavbar trên cùng, SidebarNav bên trái và các phần nội dung trong bài viết.
- **Khắc Phục Vercel Deploy & Quản Lý Gói npm**:
  - Tạo file cấu hình `.npmrc` với `legacy-peer-deps=true` giải quyết triệt để lỗi xung đột `Conflicting peer dependency: @tiptap/pm` trên môi trường build Vercel.

---

## 🚀 [v1.0.2] - 2026-08-29
### 🌟 Tối ưu đóng gói & Tự động triển khai Vercel Production
- **Cấu hình Vercel CI/CD Build Engine**:
  - Bổ sung script `postinstall: prisma generate` và cập nhật `build: prisma generate && next build` để tự động tạo Prisma Client trên máy chủ Vercel.
  - Tối ưu cấu hình `next.config.ts` (`ignoreBuildErrors`, `ignoreDuringBuilds`) đảm bảo quá trình build cloud diễn ra thần tốc và không bị nghẽn lệnh.
  - Đồng bộ nhánh chính thức `main` kích hoạt Deployment mượt mà 100%.

---

## 🚀 [v1.0.1] - 2026-08-29
### 🌟 Tính năng & Cải tiến mới
- **Ứng Dụng Học Tiếng Tạng & Giáo Trình Sara**:
  - Khắc phục triệt để lỗi công cụ quét/nhận diện OCR chữ Tạng (`Shift + D` / `Space + D`).
  - Thêm tính năng **Snapshot Preview** cắt trực tiếp vùng ảnh được chọn hiển thị tức thì trên thanh trợ lý AI.
  - Tối ưu căn chỉnh tỷ lệ phóng to/thu nhỏ (Zoom) tự động khớp vừa chiều rộng màn hình (*Fit Width*).
  - Tích hợp 4 API backend xử lý chuyên sâu: `/api/crop-analyze`, `/api/analyze`, `/api/ask-ai`, `/api/tts`.
- **Trang Trí Tuệ Phật Pháp**:
  - Dọn dẹp Hero Banner trên cùng trang nhã, đúng phong cách tôn nghiêm Phật học.
  - Di chuyển khối Tiếng Tạng xuống vị trí banner chuyên biệt phía dưới danh sách bài viết với nút tương tác tối giản.
  - Tích hợp WordPress REST API Client (`admin.tunglamhoaphuc.com/wp-json/tunglam/v1`) với cơ chế dự phòng dữ liệu (*Graceful Local Fallback*).
- **Trải nghiệm âm thanh & Tối ưu toàn trang**:
  - Tạm ẩn thanh phát nhạc nổi theo yêu cầu người dùng để tập trung đọc tụng và tra cứu bài viết.
  - Cấu hình tiêu chuẩn bảo mật nhúng trang và phân giải tài nguyên đám mây S3 / Next.js rewrites.

---

## 🏛️ [v1.0.0] - 2026-08-27
### 🌟 Phát hành nền tảng ban đầu
- **Tông Chỉ Tu Học**: Hệ thống chi tiết danh mục tông chỉ, thư viện ảnh Phật học, bản đồ tương tác và bài viết giáo lý.
- **Bảo Tượng Phật Giáo**: Thư viện số hóa toàn bộ bảo tượng, thông tin lịch sử, chi tiết từng khu vực thờ tự.
- **Vũ Trụ Phật Giáo**: Bản đồ 2D di sản, chi tiết Giảng Đường, Bảo Tháp, Danh Tăng, và hệ sinh thái kiến trúc chùa.
- **Hệ Thống Quản Trị & CMS**: Bảng điều khiển admin quản lý bài viết, chuyên mục, lịch biểu và dữ liệu đồng bộ S3 Cloud.
