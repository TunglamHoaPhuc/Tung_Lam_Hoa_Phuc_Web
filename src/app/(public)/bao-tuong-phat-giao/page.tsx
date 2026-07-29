export default function Page() {
  const categories = [
    {
      label: "Tam Bảo",
      image:
        "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=300&fit=crop",
    },
    {
      label: "Bảo tượng",
      image:
        "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=300&fit=crop",
    },
    {
      label: "Tam Quan",
      image:
        "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=600&h=300&fit=crop",
    },
    {
      label: "Vườn Thiền",
      image:
        "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=600&h=300&fit=crop",
    },
    {
      label: "Hành Lang",
      image:
        "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=600&h=300&fit=crop",
    },
    {
      label: "Kinh Tạng",
      image:
        "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=300&fit=crop",
    },
    {
      label: "Toàn Cảnh",
      image:
        "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=300&fit=crop",
    },
    {
      label: "Pháp Khí",
      image:
        "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=600&h=300&fit=crop",
    },
  ];

  const statues = [
    {
      image:
        "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=800&h=600&fit=crop",
      name: "Tượng Thích Ca Sơ Sinh",
      location: "Chánh điện Tam Bảo",
      category: "Đồng thếp vàng · Thế kỷ XVIII",
    },
    {
      image:
        "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=600&fit=crop",
      name: "Tượng Quán Thế Âm",
      location: "Vườn Lộc Uyển",
      category: "Bạch ngọc · Thế kỷ XX",
    },
    {
      image:
        "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=800&h=600&fit=crop",
      name: "Tượng La Hán Tọa Thiền",
      location: "Nhà Tổ",
      category: "Gỗ mít sơn son · Thế kỷ XVII",
    },
    {
      image:
        "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=800&h=600&fit=crop",
      name: "Tượng Niết Bàn",
      location: "Điện Cực Lạc",
      category: "Thếp vàng · Thế kỷ XIX",
    },
    {
      image:
        "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=600&fit=crop",
      name: "Đại Hồng Chung",
      location: "Gác Chuông",
      category: "Đồng đúc · Niên hiệu Gia Long",
    },
    {
      image:
        "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=800&h=600&fit=crop",
      name: "Tượng Tam Thế Phật",
      location: "Thượng điện",
      category: "Đồng thếp vàng · Thế kỷ XVIII",
    },
  ];

  const articles = [
    {
      image:
        "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=500&fit=crop",
      label: "Tư liệu",
      title: "Mộc bản kinh tạng Hòa Phúc",
      text: "Bộ mộc bản khắc kinh còn lưu tại tàng kinh các, ghi dấu công phu khắc chữ của nhiều thế hệ tăng chúng.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=800&h=500&fit=crop",
      label: "Kiến trúc",
      title: "Hành lang La Hán và nghệ thuật sơn son",
      text: "Hệ cột gỗ lim sơn son thếp vàng chạy dọc hai bên chánh điện, tạo nên nhịp điệu ánh sáng đặc trưng.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=800&h=500&fit=crop",
      label: "Không gian",
      title: "Hồ sen và vườn thiền phía Đông",
      text: "Không gian tĩnh lặng dành cho hành giả kinh hành, nơi mặt nước phản chiếu mái ngói cổ mỗi buổi chiều.",
    },
  ];

  const locations = [
    {
      image:
        "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=900&h=600&fit=crop",
      name: "Tam Quan Ngoại",
      text: "Cổng tam quan ba lối, biểu tượng của Không — Vô Tướng — Vô Tác.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=900&h=600&fit=crop",
      name: "Chánh Điện Tam Bảo",
      text: "Trung tâm hành lễ của tùng lâm, nơi tôn trí Tam Thế Phật.",
    },
  ];

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1200&h=700&fit=crop",
      title: "TOÀN CẢNH TÙNG LÂM",
      description:
        "Quần thể tùng lâm tọa lạc giữa vùng núi sương phủ, bố cục theo trục thần đạo truyền thống với chánh điện làm trung tâm.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1200&h=700&fit=crop",
      title: "HÀNH LANG LA HÁN",
      description:
        "Dãy hành lang gỗ với hệ đèn lồng, dẫn hành giả từ ngoại viện vào không gian nội điện thanh tịnh.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=1200&h=700&fit=crop",
      title: "VƯỜN THIỀN LỘC UYỂN",
      description:
        "Vườn cảnh với hồ sen, đá tảng và cây thế, được chăm sóc theo nếp thiền môn qua nhiều thế hệ.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a120c] text-[#f5e6c8]">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1920&h=1080&fit=crop"
          alt="Tùng Lâm Hòa Phúc"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#1a120c]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Kho tàng văn hóa Phật giáo Việt Nam
          </p>
          <div className="mt-6 h-px w-[120px] bg-[#d4a94a]" />
          <h1 className="mt-6 text-4xl font-bold tracking-[0.08em] text-[#f0d78c] md:text-6xl lg:text-7xl">
            TÙNG LÂM HÒA PHÚC
          </h1>
          <p className="mt-6 max-w-[600px] text-base leading-relaxed text-white/90">
            Không gian lưu trữ số về bảo tượng, kiến trúc và tư liệu của một
            tùng lâm cổ — nơi mỗi pho tượng, mỗi mái ngói đều mang theo ký ức
            của nhiều thế kỷ tu tập.
          </p>
          <a
            href="#bo-suu-tap"
            className="mt-10 inline-flex h-12 items-center border border-[#d4a94a] px-8 text-[12px] uppercase tracking-[0.2em] text-[#f0d78c] transition hover:bg-[#d4a94a]/15"
          >
            Bắt đầu chiêm bái
          </a>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section
        id="bo-suu-tap"
        className="mx-auto max-w-[1280px] px-6 py-20 md:px-10"
      >
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Bộ sưu tập
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c]">
            CÁC CHUYÊN MỤC
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((c) => (
            <a
              key={c.label}
              href="#"
              className="group relative block h-[110px] overflow-hidden border border-[#3d2e22] transition hover:border-[#d4a94a]"
            >
              <img
                src={c.image}
                alt={c.label}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/55" />
              <span className="absolute bottom-3 left-3 text-[13px] tracking-[0.16em] text-[#f0d78c]">
                {c.label.toUpperCase()}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* TAM BAO */}
      <section className="py-12">
        <div className="relative h-[420px] w-full overflow-hidden md:h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1920&h=1000&fit=crop"
            alt="Chánh điện Tam Bảo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="mx-auto mt-12 flex max-w-[1280px] flex-col items-center px-6 text-center md:px-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Không gian tiêu biểu
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[0.1em] text-[#f0d78c] md:text-6xl">
            TAM BẢO
          </h2>
          <div className="mt-6 h-px w-[160px] bg-[#d4a94a]" />
          <p className="mt-8 max-w-[700px] text-base leading-[2] text-white/90">
            Chánh điện Tam Bảo là trung tâm của tùng lâm, nơi tôn trí Tam Thế
            Phật trên bệ sen chạm khắc. Ánh nến hắt lên lớp sơn son thếp vàng
            của hệ vì kèo gỗ lim, tạo nên bầu không khí trầm mặc mà nhiều thế hệ
            tăng chúng đã gìn giữ nguyên vẹn.
          </p>
        </div>
      </section>

      {/* STATUES */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Di sản tôn tượng
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c] md:text-4xl">
            BẢO TƯỢNG TỊNH TU
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statues.map((s) => (
            <article
              key={s.name}
              className="group flex h-[320px] flex-col overflow-hidden border border-[#3d2e22] bg-[#2a1d14]"
            >
              <div className="h-[75%] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center border-t border-[#3d2e22] px-5">
                <h3 className="text-[15px] tracking-[0.12em] text-[#f0d78c]">
                  {s.name}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#a89070]">
                  {s.location} · {s.category}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Tư liệu liên quan
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c]">
            KHẢO CỨU & GHI CHÉP
          </h2>
        </div>
        <div className="flex flex-col">
          {articles.map((a) => (
            <a
              key={a.title}
              href="#"
              className="group grid grid-cols-1 gap-6 border-t border-[#3d2e22] py-8 last:border-b md:grid-cols-[40%_1fr] md:gap-8"
            >
              <div className="h-[200px] overflow-hidden border border-[#3d2e22] md:h-[220px]">
                <img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
                  {a.label}
                </p>
                <h3 className="mt-3 text-2xl text-[#f0d78c] transition group-hover:text-[#d4a94a]">
                  {a.title}
                </h3>
                <p className="mt-3 max-w-[560px] text-base leading-relaxed text-[#a89070]">
                  {a.text}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Tham quan kiến trúc
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c]">
            KHÔNG GIAN TÙNG LÂM
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-6">
          <figure className="relative overflow-hidden border border-[#3d2e22] md:col-span-2 md:row-span-2 md:h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1200&h=800&fit=crop"
              alt="Toàn cảnh tùng lâm"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <figcaption className="absolute bottom-6 left-6 text-xl tracking-[0.16em] text-[#f0d78c]">
              TOÀN CẢNH TÙNG LÂM
            </figcaption>
          </figure>
          {[
            {
              image:
                "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=800&h=400&fit=crop",
              title: "VƯỜN THIỀN",
            },
            {
              image:
                "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=800&h=400&fit=crop",
              title: "HÀNH LANG",
            },
          ].map((g) => (
            <figure
              key={g.title}
              className="relative h-[220px] overflow-hidden border border-[#3d2e22] md:h-[268px]"
            >
              <img
                src={g.image}
                alt={g.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <figcaption className="absolute bottom-5 left-5 text-[15px] tracking-[0.16em] text-[#f0d78c]">
                {g.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Địa điểm quan trọng
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c]">
            CHIÊM BÁI THEO TRỤC THẦN ĐẠO
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((l) => (
            <article
              key={l.name}
              className="group relative h-[380px] overflow-hidden border border-[#3d2e22] md:h-[420px]"
            >
              <img
                src={l.image}
                alt={l.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <h3 className="text-2xl tracking-[0.12em] text-[#f0d78c]">
                  {l.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                  {l.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SLIDES */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4a94a]">
            Hành trình hình ảnh
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#f0d78c]">
            THƯ VIỆN CHIÊM BÁI
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {slides.map((s) => (
            <article
              key={s.title}
              className="overflow-hidden border border-[#3d2e22] bg-[#2a1d14]"
            >
              <div className="h-[220px] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-[15px] tracking-[0.14em] text-[#f0d78c]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a89070]">
                  {s.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
