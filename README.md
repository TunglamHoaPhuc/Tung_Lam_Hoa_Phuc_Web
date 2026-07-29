# Tung_Lam_Hoa_Phuc_Web

## Giới thiệu

Đây là dự án website sử dụng Vue.js.
Tài liệu này hướng dẫn cách tải source code, chuyển branch và chạy project trên môi trường local.

---

## Yêu cầu môi trường

Trước khi bắt đầu, cần cài đặt:

- [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS)
- npm (được cài kèm Node.js)
- Git

Kiểm tra phiên bản:

```bash
node -v
npm -v
git -v
```

---

## 1. Clone source code

Clone repository về máy:

```bash
git clone <repository-url>
```

Ví dụ:

```bash
git clone https://github.com/username/Tung_Lam_Hoa_Phuc_Web.git
```

Di chuyển vào thư mục dự án:

```bash
cd Tung_Lam_Hoa_Phuc_Web
```

---

## 2. Kiểm tra các branch hiện có

Xem danh sách branch:

```bash
git branch -a
```

Ví dụ:

```
* main
  remotes/origin/cap-nhat-noi-dung
  remotes/origin/cap-nhat-trang-cong-khai
  remotes/origin/feat/setup-production-base
```

---

## 3. Chuyển sang branch cần làm việc

Ví dụ chuyển sang branch:

```
cap-nhat-noi-dung
```

Chạy:

```bash
git switch -c cap-nhat-noi-dung origin/cap-nhat-noi-dung
```

Kiểm tra branch hiện tại:

```bash
git branch
```

Kết quả:

```
  main
* cap-nhat-noi-dung
```

Dấu `*` là branch hiện tại.

---

## 4. Cài đặt dependencies

Trong thư mục dự án chạy:

```bash
npm install
```

Sau khi cài đặt thành công, thư mục:

```
node_modules/
```

sẽ được tạo.

---

## 5. Chạy project

Khởi động môi trường development:

```bash
npm run dev
```

Nếu project sử dụng Vue CLI:

```bash
npm run serve
```

Sau khi chạy thành công, terminal sẽ hiển thị địa chỉ truy cập, ví dụ:

```
Local: http://localhost:8080/
```

Mở trình duyệt và truy cập địa chỉ đó.

---

## 6. Cập nhật code mới nhất

Trước khi bắt đầu làm việc:

```bash
git pull
```

Hoặc cập nhật branch cụ thể:

```bash
git pull origin cap-nhat-noi-dung
```

---

## 7. Quy trình làm việc đề xuất

### Kiểm tra branch

```bash
git branch
```

### Lấy code mới

```bash
git pull
```

### Sau khi chỉnh sửa code

Kiểm tra thay đổi:

```bash
git status
```

Thêm file thay đổi:

```bash
git add .
```

Commit:

```bash
git commit -m "Mô tả thay đổi"
```

Push lên server:

```bash
git push origin ten-branch
```

---

## Lưu ý

- Không commit thư mục `node_modules`.
- Không chạy `npm audit fix --force` nếu chưa kiểm tra vì có thể gây lỗi dependency.
- Nếu đổi branch và gặp lỗi package, nên chạy lại:

```bash
npm install
```

- Dự án hiện đang sử dụng Vue 2, nên một số cảnh báo về Vue 2 EOL có thể xuất hiện khi cài package. Đây không phải lỗi chạy ứng dụng.

---

## Các branch hiện có

| Branch                     | Mục đích                        |
| -------------------------- | ------------------------------- |
| main                       | Branch chính                    |
| cap-nhat-noi-dung          | Cập nhật nội dung               |
| cap-nhat-trang-cong-khai   | Cập nhật trang công khai        |
| feat/setup-production-base | Thiết lập môi trường production |
