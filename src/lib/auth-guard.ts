import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from './env-config';

/**
 * 🛡️ Helper bảo vệ API Quản Trị (Xác thực & Phân quyền)
 * Đảm bảo mọi thao tác CUD (Create, Update, Delete) đều bắt buộc phải có phiên đăng nhập hợp lệ.
 */

export interface AuthCheckResult {
  authorized: boolean;
  reason?: string;
}

export function checkAdminAuth(req: Request | NextRequest): AuthCheckResult {
  try {
    // 1. Kiểm tra Cookie admin_auth
    let hasAuthCookie = false;
    const cookieHeader = req.headers.get('cookie') || '';
    if (cookieHeader.includes('admin_auth=true')) {
      hasAuthCookie = true;
    }

    // Nếu là NextRequest có đối tượng cookies
    if (!hasAuthCookie && 'cookies' in req && typeof (req as NextRequest).cookies?.get === 'function') {
      const val = (req as NextRequest).cookies.get('admin_auth')?.value;
      if (val === 'true') {
        hasAuthCookie = true;
      }
    }

    if (hasAuthCookie) {
      return { authorized: true };
    }

    // 2. Kiểm tra Header Authorization (Bearer token) hoặc X-Admin-Key (dành cho API nội bộ/script)
    const authHeader = req.headers.get('authorization') || '';
    const adminKeyHeader = req.headers.get('x-admin-key') || '';
    const internalSecret = getEnv('WP_WEBHOOK_SECRET') || getEnv('NEXTAUTH_SECRET') || 'hoaphuc2026';

    if (authHeader.startsWith('Bearer ') && authHeader.slice(7).trim() === internalSecret) {
      return { authorized: true };
    }

    if (adminKeyHeader && adminKeyHeader === internalSecret) {
      return { authorized: true };
    }

    return {
      authorized: false,
      reason: 'Phiên đăng nhập quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    };
  } catch (err: any) {
    return {
      authorized: false,
      reason: 'Lỗi xác thực quyền truy cập.',
    };
  }
}

export function requireAdminAuth(req: Request | NextRequest): NextResponse | null {
  const result = checkAdminAuth(req);
  if (!result.authorized) {
    return NextResponse.json(
      {
        success: false,
        error: result.reason || 'Unauthorized: Vui lòng đăng nhập với tài khoản Quản trị viên',
      },
      { status: 401 }
    );
  }
  return null;
}
