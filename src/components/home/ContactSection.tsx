import { FC } from "react";
import { Phone } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { C } from "@/data/palette";
import { CONTACTS } from "@/data/home-data";

const SOCIALS: Array<{
  icon?: typeof FaFacebook;
  label: string;
  bg: string;
  text?: string;
}> = [
  { icon: FaFacebook, label: "Facebook", bg: "#1877F2" },
  { icon: FaYoutube, label: "YouTube", bg: "#FF0000" },
  { icon: FaInstagram, label: "Instagram", bg: "#C13584" },
  { label: "TikTok", bg: "#010101", text: "TK" },
  { label: "Zalo", bg: "#0068FF", text: "Za" },
];

/** Footer / contact information: address, social links, contact list, copyright. */
const ContactSection: FC = () => {
  return (
    <footer
      className="py-16 px-10 relative overflow-hidden"
      style={{ background: "#C9AD7B" }}
    >
      {/* decorative */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 15% 55%, ${C.surface} 0%, transparent 55%), radial-gradient(ellipse at 82% 28%, ${C.primary} 0%, transparent 52%)`,
          opacity: 0.18,
        }}
      />
      {/* lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(42,29,20,.8) 39px, rgba(42,29,20,.8) 40px)",
        }}
      />

      <div className="max-w-[1280px] mx-auto relative">
        {/* logo + address */}
        <div className="flex flex-col items-center mb-12">
          <div
            className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-5 shadow-md"
            style={{ background: C.paper, borderColor: C.dark }}
          >
            <span
              className="font-cinzel font-black text-center leading-tight"
              style={{ fontSize: 10, color: C.dark }}
            >
              TÙNG
              <br />
              LÂM
              <br />
              HÒA PHÚC
            </span>
          </div>
          <h2
            className="font-cinzel text-2xl font-bold tracking-[.15em]"
            style={{ color: C.dark }}
          >
            TÙNG LÂM HÒA PHÚC
          </h2>
          <p
            className="font-inter text-sm mt-1 tracking-widest"
            style={{ color: "#5C4630" }}
          >
            Thiền Viện · Hà Nội
          </p>
          <p
            className="font-inter text-sm mt-3 text-center max-w-md leading-relaxed"
            style={{ color: "#5C4630" }}
          >
            Số 12, Đường Hòa Phúc, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội
          </p>
        </div>

        {/* 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* social */}
          <div>
            <h4
              className="font-cinzel text-xs font-bold uppercase tracking-[.2em] mb-5"
              style={{ color: C.dark }}
            >
              Theo Dõi Chúng Tôi
            </h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {SOCIALS.map(({ icon: Icon, label, bg, text }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow transition-transform hover:scale-110"
                  style={{ background: bg }}
                >
                  {Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span className="font-inter text-xs font-bold">{text}</span>
                  )}
                </button>
              ))}
            </div>
            <div
              className="flex flex-col gap-1.5 font-inter text-sm"
              style={{ color: "#5C4630" }}
            >
              <p>📍 Hà Nội, Việt Nam</p>
              <p>🕐 Giờ mở cửa: 6:00 – 20:00 hằng ngày</p>
              <p>🌐 www.tunglamhoaphu.vn</p>
            </div>
          </div>

          {/* contact */}
          <div>
            <h4
              className="font-cinzel text-xs font-bold uppercase tracking-[.2em] mb-5"
              style={{ color: C.dark }}
            >
              Thông Tin Liên Hệ
            </h4>
            <div className="flex flex-col gap-4">
              {CONTACTS.map((c) => (
                <div key={c.role} className="flex items-start gap-3">
                  <Phone
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#5C4630" }}
                  />
                  <div>
                    <div
                      className="font-inter text-[10px] uppercase tracking-[.15em]"
                      style={{ color: "#8B6F47" }}
                    >
                      {c.role}
                    </div>
                    <div
                      className="font-inter text-sm font-semibold"
                      style={{ color: C.dark }}
                    >
                      {c.name}
                    </div>
                    <div
                      className="font-inter text-xs"
                      style={{ color: "#5C4630" }}
                    >
                      {c.tel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom */}
        <div
          className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(42,29,20,.2)" }}
        >
          <p className="font-inter text-xs" style={{ color: "#5C4630" }}>
            © 2024 Tùng Lâm Hòa Phúc. Bảo lưu mọi quyền.
          </p>
          <p className="font-inter text-xs italic" style={{ color: "#5C4630" }}>
            "Nơi để trở về – Chốn thiêng bình yên" 🪷
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
