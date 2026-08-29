# 📜 NHẬT KÝ PHÁT TRIỂN & CẬP NHẬT PHIÊN BẢN (CHANGELOG)
### Cổng Thông Tin Điện Tử Tùng Lâm Hòa Phúc

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
