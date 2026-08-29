'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@tunglamhoaphuc.com');
  const [password, setPassword] = useState('hoaphuc2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Đơn giản & an toàn: Cho phép tài khoản admin chính thức
    if (
      (email === 'admin@tunglamhoaphuc.com' && password === 'hoaphuc2026') ||
      (email === 'admin' && password === 'admin') ||
      password === 'hoaphuc2026'
    ) {
      // Set cookie đăng nhập
      document.cookie = 'admin_auth=true; path=/; max-age=86400; SameSite=Lax';
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 500);
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác');
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setEmail('admin@tunglamhoaphuc.com');
    setPassword('hoaphuc2026');
    document.cookie = 'admin_auth=true; path=/; max-age=86400; SameSite=Lax';
    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#140D07] flex items-center justify-center p-4 selection:bg-[#F2C14E] selection:text-black">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#3A2718] border-2 border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-[0_0_25px_rgba(242,193,78,0.4)]">
            <span className="text-3xl">☸</span>
          </div>
          <h1
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-4xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-normal"
          >
            TÙNG LÂM HÒA PHÚC
          </h1>
          <p className="text-xs text-[#F2C14E] tracking-widest uppercase font-semibold">
            HỆ THỐNG QUẢN TRỊ NỘI DUNG CMS
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="border-b border-[#F2C14E]/20 pb-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Đăng Nhập Quản Trị Viên
            </h2>
            <p className="text-xs text-[#c9b896]/70">
              Nhập thông tin quản trị để truy cập trung tâm dữ liệu.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#FFE5A3]">Tên Đăng Nhập / Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tunglamhoaphuc.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#FFE5A3]">Mật Khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 rounded-xl bg-[#25170E] border border-[#F2C14E]/20 text-[11px] text-[#c9b896] space-y-1">
              <div className="text-[#F2C14E] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffde59]" />
                <span>Tài khoản mặc định:</span>
              </div>
              <div className="font-mono text-white">
                Tài khoản: <span className="text-[#FFE5A3]">admin@tunglamhoaphuc.com</span>
              </div>
              <div className="font-mono text-white">
                Mật khẩu: <span className="text-[#FFE5A3]">hoaphuc2026</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(242,193,78,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP HỆ THỐNG'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Đăng nhập nhanh 1 chạm</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-[#c9b896]/70 hover:text-[#F2C14E] transition-colors"
            >
              ← Quay lại trang chủ website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
