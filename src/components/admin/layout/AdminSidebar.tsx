import Link from "next/link";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Bài viết",
    href: "/admin/posts",
  },
  {
    title: "Sự kiện",
    href: "/admin/events",
  },
  {
    title: "Media",
    href: "/admin/media",
  },
  {
    title: "Đăng ký",
    href: "/admin/registrations",
  },
  {
    title: "Tro cốt",
    href: "/admin/memorials",
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white min-h-screen p-5">
      <div className="mb-8">
        <h1 className="text-lg font-bold">Tùng Lâm Hòa Phúc</h1>

        <p className="text-sm text-gray-500">Admin CMS</p>
      </div>

      <nav className="space-y-2">
        {menus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              block
              rounded-lg
              px-3
              py-2
              text-sm
              hover:bg-gray-100
            "
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
