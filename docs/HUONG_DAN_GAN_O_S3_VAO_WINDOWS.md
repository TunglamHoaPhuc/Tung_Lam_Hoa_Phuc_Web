# 🪷 HƯỚNG DẪN GẮN S3 THÀNH Ổ ĐĨA Z: TRÊN WINDOWS

Tài liệu này hướng dẫn cách gắn (mount) trực tiếp **S3 Bucket Đám Mây** của Tùng Lâm Hòa Phúc thành một **Ổ Đĩa Z:** trong `This PC (My Computer)` trên Windows để quản lý, kéo thả ảnh trực tiếp như USB/ổ cứng ngoài.

---

## 🛠️ CÁCH 1: DÙNG GIAO DIỆN S3 EXPLORER TRÊN TRANG ADMIN (KHÔNG CẦN CÀI ĐẶT)
1. Truy cập trang Quản trị Admin: `/admin/tong-chi`
2. Bấm vào biểu tượng đám mây **`[ ☁️ ]`** trên thanh công cụ hoặc bấm **`[ 🖼️ Thư Viện Ảnh S3 ]`** trong trình soạn thảo.
3. Giao diện Cây thư mục Windows Explorer sẽ mở ra:
   - Cột bên trái: Cây thư mục (`tong-chi-tu-hoc`, `bao-tuong-phat-giao`, `gioi-thieu`...).
   - Khu vực bên phải: Danh sách ảnh, tạo thư mục mới, kéo thả tải ảnh từ máy tính.
   - **Tất cả ảnh tải lên đều được tự động nén sang chuẩn WebP siêu nhẹ.**

---

## 💽 CÁCH 2: GẮN THÀNH Ổ ĐĨA Z: TRONG THIS PC (WINDOWS EXPLORER)

Sử dụng công cụ mã nguồn mở miễn phí **Rclone** để biến S3 thành ổ cứng thật:

### Bước 1: Tải Rclone và WinFsp
1. Tải **WinFsp** (Thư viện hỗ trợ ổ đĩa Windows): [https://winfsp.dev/rel/](https://winfsp.dev/rel/) (Tải file `.msi` và bấm Next cài đặt).
2. Tải **Rclone for Windows**: [https://rclone.org/downloads/](https://rclone.org/downloads/) (Giải nén file `rclone.exe` vào thư mục bất kỳ, ví dụ `C:\rclone\rclone.exe`).

### Bước 2: Cấu hình kết nối S3
Chạy file **`Ket_Noi_S3_Hoa_Phuc.bat`** (đã được tạo sẵn ở thư mục gốc dự án) hoặc chạy lệnh sau trong PowerShell / CMD:

```cmd
rclone config create s3hoaphuc s3 provider=Other env_auth=false access_key_id=005bc25330e1c1f0000000029 secret_access_key=K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA endpoint=https://s3.us-east-005.backblazeb2.com acl=public-read
```

### Bước 3: Mount S3 thành Ổ Đĩa Z:
Chạy lệnh:
```cmd
rclone mount s3hoaphuc:s2-cnv03 Z: --vfs-cache-mode full
```

👉 Mở **This PC** trên máy tính: Bạn sẽ thấy **Ổ Đĩa Z: (s2-cnv03)** xuất hiện sẵn sàng! Bạn có thể kéo thả, copy, paste ảnh vào S3 như ổ đĩa bình thường.
