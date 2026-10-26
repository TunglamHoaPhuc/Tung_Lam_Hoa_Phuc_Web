# TÙNG LÂM HÒA PHÚC - QUY TẮC PHÁT TRIỂN & TỐI ƯU HÓA DỰ ÁN

## ⚡ 1. TỐI ƯU HÓA HIỆU NĂNG PHẦN CỨNG (GPU & MULTI-CORE ACCELERATION)
Mỗi khi AI thực thi lệnh hoặc build/chạy dev cho dự án, BẮT BUỘC tuân thủ các nguyên tắc tăng tốc phần cứng tối đa:
- **Tận dụng Turbopack & Đa luồng**: Next.js 16 Turbopack phải được kích hoạt tối đa (`--turbopack`) với số lượng workers song song lớn nhất (tự động nhận diện 11-16 workers dựa trên CPU đa nhân).
- **Tăng tốc xử lý đồ họa & Image Optimization**: Tận dụng GPU / SIMD acceleration trong xử lý ảnh sắc nét, nén WebP, responsive srcset.
- **Tận dụng Cache Cục Bộ**: Giữ nguyên cache `.next/cache` và Prisma Client pre-generated để tốc độ biên dịch các trang tĩnh (54+ static pages) luôn đạt dưới 2 giây.
- **Tối ưu lệnh PowerShell/Node**: Tránh các vòng lặp polling không cần thiết; dùng stream và asynchronous batch processing khi đọc/ghi file hoặc fetch API.

---

## 🌉 2. ĐỒNG BỘ WORDPRESS GUTENBERG & QUẢN LÝ POST ID VĨNH VIỄN
- **Cố định Post ID**: Trường `wpPostId` của mỗi bài viết phải luôn được lưu vĩnh viễn vào database (`tong-chi-data.json`).
- **Tuyệt đối không gán mặc định**: Không bao giờ fallback `wpPostId` về số thứ tự `id` cục bộ (1, 2, 3, 7...) để tránh làm nhảy loạn ID thực tế của WordPress (470, 401, 403, 385...).
- **Hỗ trợ người soạn thảo sau**: Giao diện Admin phải luôn có Dropdown danh sách bài viết WordPress thực tế lấy từ API để người sau chỉ cần click chọn theo tiêu đề, không phải tự nhớ số ID.

---

## 📚 3. TỦ SÁCH TÀNG KINH CÁC & NGUỒN THAM KHẢO
- Toàn bộ nguồn sách tham khảo liên kết trực tiếp với kho 400+ ấn phẩm số của Tàng Kinh Các (`/vu-tru-phat-giao/tang-kinh-cac`).
- Khối Nguồn Tham Khảo hiển thị theo phong cách hoàng kim trang nghiêm: Thẻ bo góc viền vàng, ảnh bìa sắc nét, nút đọc Ebook/PDF 📖 dẫn vào Tàng Kinh Các.

---

## 🚀 4. QUY TRÌNH KIỂM THỬ & DEPLOY
- Luôn chạy `npm run build` để kiểm tra Type-safety và kết xuất tĩnh 100% trang không lỗi trước khi bàn giao.
- Chỉ push Git / Vercel khi có chỉ thị trực tiếp từ người dùng.

---

## 🛡️ 5. NGUYÊN TẮC BẢO MẬT DỮ LIỆU & AN TOÀN HỆ THỐNG TUYỆT ĐỐI
Được người dùng trao toàn quyền tự chủ thực thi, AI cam kết tuân thủ nghiêm ngặt các nguyên tắc bảo mật và an toàn dữ liệu:
- **Bảo Mật Thông Tin Bí Mật (Secrets & Credentials)**: Tuyệt đối không bao giờ làm lộ, log hoặc đẩy các file nhạy cảm (`.env.local`, API keys, S3/Backblaze credentials, DB passwords, Rclone tokens...) lên Git hoặc môi trường công khai.
- **Phòng Chống Mất Mát Dữ Liệu (Data Integrity)**: Khi cập nhật các file dữ liệu cốt lõi (`tong-chi-data.json`, `posts-database.json`, `sach-an-pham-data.json`, `memorial-data.json`...), luôn xử lý an toàn, bảo toàn toàn vẹn các trường dữ liệu và nội dung hiện có, tuyệt đối không chạy lệnh xóa hủy diệt.
- **Trách Nhiệm & Thận Trọng**: Sử dụng quyền tự chủ để tối ưu tốc độ và chất lượng cho dự án, luôn đặt tính ổn định, sự trang nghiêm và an toàn dữ liệu của Tùng Lâm Hòa Phúc lên hàng đầu.

---

## 🌐 6. QUY CHUẨN PHÁT TRIỂN FULLSTACK & QUALITY GATE
- **Bộ Quy Tắc Fullstack**: Tuân thủ tuyệt đối các quy chuẩn chuyên sâu tại [fullstack-rules.md](file:///c:/Users/MY%20PC/Tung_Lam_Hoa_Phuc_Web/.agents/rules/fullstack-rules.md) (Ranh giới Server vs Client Components, phòng chống Hydration Error, Next/Image CLS Guard, chuẩn hóa Response REST API, Atomic File Write cho JSON database).
- **Cổng Kiểm Soát Chất Lượng Bắt Buộc (Quality Gate)**: Sau mỗi lần thay đổi mã nguồn TypeScript/TSX, Agent BẮT BUỘC chạy `npx tsc --noEmit` để xác nhận 0 lỗi Type trước khi thông báo hoàn tất cho người dùng.

---

## 📜 7. QUY CHUẨN HIỂN THỊ BÀI THƠ VS. VĂN XUÔI (/learn)
- **Bài Thơ (Poem / Thi Kệ)**: Bắt buộc căn chính giữa (`text-center mx-auto`). Tuyệt đối KHÔNG dùng chữ hoa Drop Cap đầu bài, đồng nhất cỡ chữ, màu sắc và khoảng cách giữa các câu. Sử dụng đường gạch gradient 2 đầu mỏng tinh tế (`h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent`) chỉ hiện lên khi rê chuột vào khổ thơ (hover). Gạch chân từ khóa popup cũng chỉ hiện khi hover.
- **Văn Xuôi (Prose)**: Căn đều 2 bên (`text-justify [text-align-last:left]`), thụt lề từ đoạn 2 (`indent-6 md:indent-8`), có chữ hoa Drop Cap đầu bài (font `UTM_ClassizismAntiqua`, vàng kim, viền gạch chân) tương tự bản mô tả đầu trang Tông Chỉ Tu Học.

