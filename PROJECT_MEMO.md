# BIEN BAN GHI NHO DU AN — TUNG LAM HOA PHUC WEB

> **Danh cho:** AI Agents, Developers, Content Team
> **Cap nhat lan cuoi:** 2026-09-30
> **Stack:** Next.js 15 (App Router) + TypeScript + Prisma + PostgreSQL (Vercel) + S3 (Backblaze B2)

---

## 1. KIEN TRUC TONG QUAN

```
tunglamhoaphuc.com
- Frontend: Next.js 15 (Static Export + ISR)
- Backend:  API Routes trong src/app/api/
- Database: Prisma ORM -> Vercel Postgres (Production)
            + JSON flat-files trong src/data/ (Backup/Static)
- Media:    Backblaze B2 S3 (qua rclone hoac API truc tiep)
- CMS:      WordPress Gutenberg (sync 2 chieu qua WP REST API)
```

### Moi truong:
| Moi truong | URL | Ghi chu |
|---|---|---|
| Production | https://tunglamhoaphuc.com | Domain chinh, **khong con dung beta** |
| Local Dev  | http://localhost:3000       | Chay `npm run dev` |
| WordPress  | https://wordpress.tunglamhoaphuc.com | WP Admin de soan Gutenberg |

---

## 2. CAU TRUC THU MUC QUAN TRONG

```
src/
+-- app/
|   +-- (admin)/          <- Route admin (yeu cau dang nhap)
|   +-- (public)/         <- Route public (trang chinh thuc)
|   +-- api/admin/        <- API routes cho admin dashboard
|   |   +-- posts/        <- CRUD bai viet (tong-chi)
|   |   +-- tong-chi/     <- Du lieu Tong Chi Tu Hoc
|   |   +-- gioi-thieu/   <- Du lieu Gioi Thieu
|   |   +-- danh-tang/    <- Du lieu Danh Tang
|   |   +-- bao-tuong/    <- Du lieu Bao Tuong
|   |   +-- sync-wp/      <- Dong bo WP -> Local JSON
|   |   +-- wp-post-create/ <- Tao bai tren WP tu Admin UI
|   +-- globals.css       <- CSS toan cuc (font, bien mau)
|
+-- components/
|   +-- admin/            <- Toan bo UI admin dashboard
|   |   +-- SpreadsheetPosts.tsx      <- Quan ly bai viet (~149KB - NANG)
|   |   +-- SpreadsheetTongChi.tsx    <- Quan ly Tong Chi (~222KB - NANG)
|   |   +-- SpreadsheetGioiThieu.tsx  <- Quan ly Gioi Thieu (~84KB)
|   |   +-- TongChiEditor.tsx         <- Editor inline cho Tong Chi (~94KB)
|   |   +-- PostFormEditor.tsx        <- Form editor bai viet (~29KB)
|   |   +-- ZenLotusBlockStudio.tsx   <- Custom block editor (~50KB)
|   |   +-- S3FileExplorerModal.tsx   <- Browser file S3 (~72KB)
|   +-- common/           <- Components dung chung (Header, Footer...)
|   +-- home/             <- Components trang chu
|   +-- tong-chi/         <- Components trang Tong Chi
|   +-- ui/               <- shadcn/ui components
|
+-- data/                 <- Flat JSON data files (CORE DATA - KHONG XOA)
|   +-- posts-database.json          <- Bai viet (~8.6MB - FILE LON NHAT)
|   +-- tong-chi-data.json           <- Noi dung Tong Chi (~207KB)
|   +-- memorial-data.json           <- Tuong niem (~508KB)
|   +-- sach-an-pham-data.json       <- Sach an pham (~2.3MB)
|   +-- statues-database.json        <- Du lieu bao tuong (~985KB)
|
+-- lib/                  <- Utilities va helpers
+-- types/                <- TypeScript type definitions
```

---

## 3. NGUYEN TAC QUAN TRONG

### TUYET DOI KHONG lam:
1. **Khong fallback `wpPostId` ve so thu tu cuc bo** (1, 2, 3...) - WP ID thuc te khac hoan toan (470, 401, 403, 385...)
2. **Khong xoa hoac reset `posts-database.json`** - day la nguon chan ly cho toan bo bai viet
3. **Khong commit `.env.local`** - chua API keys, S3 credentials
4. **Khong commit file `s3_keys.json`** hoac bat ky credential file nao
5. **Khong commit `rclone.exe`** hoac binary lon (>5MB)

### LUON lam:
1. Chay `npm run build` truoc khi deploy de kiem tra TypeScript errors
2. Khi them bai viet moi: **save ngay len server** (khong chi luu local state)
3. Khi dong bo WordPress: dung `wpPostId` tu database, khong tu suy luan
4. Backup `posts-database.json` truoc khi thao tac hang loat

---

## 4. LUONG DU LIEU (DATA FLOW)

### Bai viet Tong Chi:
```
WordPress Gutenberg
    | (REST API sync)
src/data/tong-chi-data.json
    | (Next.js static read)
/tong-chi/[slug] pages
```

### Bai viet Posts (blog):
```
Admin UI (SpreadsheetPosts.tsx)
    | PUT /api/admin/posts
src/data/posts-database.json  <-> Vercel Postgres
    |
/bai-viet/[slug] pages
```

### Dong bo WordPress <-> Local:
- **Pull tu WP:** `GET /api/admin/sync-wp` -> cap nhat local JSON
- **Push len WP:** `POST /api/admin/wp-post-create` -> tao/cap nhat WP post
- **Phat hien thay doi:** `SpreadsheetPosts.tsx` dung `hasOpenedGutenbergRef` de detect khi user quay lai tu WP

---

## 5. ADMIN DASHBOARD — CHUC NANG CHINH

| Tab Admin   | File Component              | Chuc nang                     |
|---|---|---|
| Bai Viet    | SpreadsheetPosts.tsx        | Quan ly toan bo blog posts, sync WP |
| Tong Chi    | SpreadsheetTongChi.tsx      | Noi dung Tong Chi Tu Hoc      |
| Gioi Thieu  | SpreadsheetGioiThieu.tsx    | Trang gioi thieu              |
| Tri Tue     | SpreadsheetTriTue.tsx       | Kho tri tue                   |
| Vu Tru      | SpreadsheetVuTru.tsx        | Vu tru Phat giao              |
| Danh Tang   | AdminDataTable.tsx          | Quan ly danh tang             |

### Auto-save Pattern (SpreadsheetPosts.tsx):
```typescript
// Khi tao bai moi -> save ngay len server (tranh mat du lieu)
handleAddNewPost() -> savePostsToBackend()

// Khi focus lai tu WordPress -> silent fetch (khong ghi de dirty state)
handleWindowFocus() -> if (!isDirtyRef.current) fetchPosts(true)

// Khi dong tab voi unsaved changes -> canh bao
handleBeforeUnload() -> event.preventDefault()
```

---

## 6. QUAN LY ANH (MEDIA)

- **Storage:** Backblaze B2 S3 bucket
- **Browser anh:** `S3FileExplorerModal.tsx` - duyet file S3 tu Admin UI
- **Focal Point:** `ImageFocalPositionerModal.tsx` - chon diem crop anh
- **CDN URL pattern:** `https://s3.tunglamhoaphuc.com/[path]/[filename]`
- **WordPress Media:** `WordPressMediaModal.tsx` - dung WP media library

### Convention dat ten file anh:
- WebP format duoc uu tien
- Dung slug tieng Viet khong dau, viet thuong, noi bang `-`
- Vi du: `phat-thich-ca-mau-ni.webp`, `dai-duc-thich-truc-thai-minh.webp`

---

## 7. PERFORMANCE & BUILD

### Lenh thuong dung:
```bash
npm run dev        # Dev local (localhost:3000) -- su dung Turbopack
npm run build      # Build kiem tra TypeScript (65 static pages)
npm run lint       # Kiem tra ESLint
```

### Thoi gian build:
- **Local build:** ~30-60 giay (65 static pages)
- **Vercel deploy:** ~2-3 phut
- Cache `.next/cache` khong commit (da trong .gitignore)

---

## 8. WORDPRESS INTEGRATION

### Cach hoat dong:
1. Content team soan bai tren WordPress Gutenberg
2. Admin UI co nut "Dong bo tu WP" -> pull ve local JSON
3. Du lieu quan trong: `wpPostId` phai duoc luu vinh vien

### WP Post ID mapping:
- Khong bao gio assume ID = thu tu cuc bo
- Luon lay tu field `wpPostId` trong database
- Vi du ID thuc te: bai "Bo De Tam" = 470, "Xin Su Chu" = 401...

### Admin UI co Dropdown chon bai WP:
- Khi gan wpPostId: dropdown hien danh sach bai WP thuc te tu API
- Khong bao gio phai tu nho so ID

---

## 9. BAO MAT

| File                    | Trang thai   | Ghi chu                        |
|---|---|---|
| `.env.local`            | Git ignored  | WP credentials, S3 keys, DB URL |
| `s3_keys.json`          | Git ignored  | Credential file, khong commit   |
| `rclone.exe`            | Da xoa       | Binary tool, dung rclone tu PATH |
| `src/data/*.bak`        | Git ignored  | Backup tu dong, khong can commit |

---

## 10. QUY TRINH KHI THEM TINH NANG MOI

### Checklist:
- [ ] Kiem tra co component tuong tu khong (tranh duplicate code)
- [ ] Them TypeScript types vao `src/types/`
- [ ] Neu co API route moi: them vao `src/app/api/admin/[feature]/route.ts`
- [ ] Neu co data moi: can nhac JSON file hay Prisma schema
- [ ] Chay `npm run build` de xac nhan khong co TypeScript error
- [ ] Test tren local truoc khi deploy Vercel

### Khi sua component admin lon (Spreadsheet*.tsx):
- File `SpreadsheetTongChi.tsx` (~222KB) va `SpreadsheetPosts.tsx` (~149KB) rat nang
- Uu tien sua logic nho, khong refactor toan bo tru khi thuc su can
- Neu can them feature: tao sub-component rieng va import vao

---

## 11. DEPLOY

### Quy trinh deploy Vercel:
```bash
# Chi push khi co chi thi tu user
git add .
git commit -m "feat: mo ta ngan gon"
git push origin main
# Vercel tu dong deploy sau ~2-3 phut
```

### Vercel Environment Variables can thiet:
- `DATABASE_URL` -- Vercel Postgres connection string
- `WP_ADMIN_USER` / `WP_ADMIN_PASS` -- WordPress credentials
- `S3_ACCESS_KEY` / `S3_SECRET_KEY` -- Backblaze B2
- `NEXTAUTH_SECRET` -- Auth.js secret

---

## 12. TAI NGUYEN THAM KHAO

- **Docs noi bo:** `docs/HUONG_DAN_SOAN_THAO_CHO_CONTENT.md`
- **Changelog:** `CHANGELOG.md`
- **Context AI:** `CONTEXT.md` (tong quan cho AI agents)
- **Rules AI:** `GEMINI.md` (quy tac cho AI)
- **WP Huong dan:** `docs/HUONG_DAN_GAN_O_S3_VAO_WINDOWS.md`

---
*Tai lieu nay duoc cap nhat boi AI/Developer khi co thay doi kien truc quan trong.*