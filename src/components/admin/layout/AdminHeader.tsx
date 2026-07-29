export default function AdminHeader() {
  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        bg-white
        px-6
      "
    >
      <h2 className="font-semibold">Quản trị hệ thống</h2>

      <button
        className="
          rounded-lg
          bg-gray-100
          px-4
          py-2
          text-sm
        "
      >
        Đăng xuất
      </button>
    </header>
  );
}
