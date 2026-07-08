import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Nếu user cố tình truy cập vào các đường dẫn admin (/admin, /admin/posts, ...)
  if (pathname.startsWith("/admin")) {
    // Tạm thời chưa check session Supabase, cứ đá thẳng về trang login để test cấu trúc
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Cấu hình matcher quét tập trung nhưng loại trừ các file hệ thống và asset tĩnh
export const config = {
  matcher: [
    /*
     * Khớp với tất cả các request ngoại trừ:
     * - api (các tuyến API nội bộ)
     * - _next/static (file tĩnh của Next.js)
     * - _next/image (tối ưu hóa hình ảnh của Next.js)
     * - favicon.ico, sitemap.xml, robots.txt (file cấu hình public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
