"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    console.log({
      email,
      password,
    });

    alert("Auth module đang được triển khai");

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <span className="text-3xl">🪷</span>
          </div>

          <h1 className="text-2xl font-semibold text-neutral-800">
            Chùa Tùng Lâm Hòa Phúc
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Cổng quản trị hệ thống
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-neutral-800">
            Đăng nhập Admin
          </h2>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Email
              </label>

              <input
                type="email"
                placeholder="admin@example.com"
                className="
                  w-full
                  rounded-lg
                  border
                  border-neutral-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-amber-500
                  focus:ring-2
                  focus:ring-amber-200
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Mật khẩu
              </label>

              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="
                  w-full
                  rounded-lg
                  border
                  border-neutral-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-amber-500
                  focus:ring-2
                  focus:ring-amber-200
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-lg
                bg-amber-700
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-amber-800
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t pt-5 text-center">
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} Chùa Tùng Lâm Hòa Phúc
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              Hệ thống quản trị nội dung
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
