import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu user truy cập vào các đường dẫn admin (/admin, /admin/...)
  if (pathname.startsWith("/admin")) {
    const isAuth = request.cookies.get("admin_auth")?.value === "true";
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
