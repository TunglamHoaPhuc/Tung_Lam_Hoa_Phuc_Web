// export default function Page() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-white">
//       <h1 className="text-5xl font-bold text-black">
//         Đây là màn hình tông chỉ tu học.
//       </h1>
//     </div>
//   );
// }

"use client";

import { useMemo, useState, type ReactNode } from "react";

type CardData = {
  imageUrl: string;
  caption: string;
  category?: string;
  onClick?: () => void;
};

type ArticleData = {
  key: string;
  hero: string;
  heroAlt: string;
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; active?: boolean }[];
  blocks: Array<
    | {
        type: "prose-right-card";
        prose: string[];
        card: {
          label: string;
          title: string;
          thumbnailUrl: string;
          thumbnailAlt: string;
          body: string;
          linkText: string;
        };
      }
    | {
        type: "card-left-prose";
        prose: string[];
        card: {
          label: string;
          title: string;
          thumbnailUrl: string;
          thumbnailAlt: string;
          body: string;
          linkText: string;
        };
      }
    | {
        type: "poem";
        sectionTitle: string;
        poem: string[][];
      }
  >;
  related: CardData[];
};

const P = {
  hall: "https://images.unsplash.com/photo-1663026335162-c78122485f2a?w=1600&h=800&fit=crop&auto=format",
  elderMonk:
    "https://images.unsplash.com/photo-1704408347810-8c7048e445a9?w=560&h=700&fit=crop&auto=format",
  yellowCeremony:
    "https://images.unsplash.com/photo-1770149682823-0befb39aa86e?w=560&h=700&fit=crop&auto=format",
  brownRobe:
    "https://images.unsplash.com/photo-1585335107823-94c8bc6c9291?w=560&h=700&fit=crop&auto=format",
  bodhisattva:
    "https://images.unsplash.com/photo-1783142981025-eb5f44f4eede?w=560&h=700&fit=crop&auto=format",
  buddhaAlt:
    "https://images.unsplash.com/photo-1783142979746-472a8b9e11fb?w=560&h=700&fit=crop&auto=format",
  buddhaOfferings:
    "https://images.unsplash.com/photo-1776059520746-3bd11491381e?w=560&h=700&fit=crop&auto=format",
  lanterns:
    "https://images.unsplash.com/photo-1772471349657-ff47e898a632?w=560&h=700&fit=crop&auto=format",
  prayerHall:
    "https://images.unsplash.com/photo-1663026335162-c78122485f2a?w=560&h=700&fit=crop&crop=right&auto=format",
  seated:
    "https://images.unsplash.com/photo-1658891389224-43441d0ea8ac?w=560&h=700&fit=crop&auto=format",
  incense:
    "https://images.unsplash.com/photo-1551690935-a9e6f0a7e788?w=560&h=700&fit=crop&auto=format",
  seatedMonk:
    "https://images.unsplash.com/photo-1554457945-229b8867b30d?w=560&h=700&fit=crop&auto=format",
  procession:
    "https://images.unsplash.com/photo-1629499651050-ef0fac2edf06?w=560&h=700&fit=crop&auto=format",
  congregation:
    "https://images.unsplash.com/photo-1632133548524-dd064a954bad?w=560&h=700&fit=crop&auto=format",
  beachMonk:
    "https://images.unsplash.com/photo-1619400521895-d17d2f7be1cc?w=560&h=700&fit=crop&auto=format",
  smoke:
    "https://images.unsplash.com/photo-1617954095840-0427f79be4cf?w=560&h=700&fit=crop&auto=format",
  night1:
    "https://images.unsplash.com/photo-1695024146203-d274fcf253a5?w=900&h=675&fit=crop&auto=format",
  night2:
    "https://images.unsplash.com/photo-1768488273277-63e961fca5c9?w=900&h=675&fit=crop&auto=format",

  articleHero:
    "https://images.unsplash.com/photo-1783142979746-472a8b9e11fb?w=1600&h=640&fit=crop&auto=format",
  ref1th:
    "https://images.unsplash.com/photo-1776059520746-3bd11491381e?w=160&h=160&fit=crop&auto=format",
  ref2th:
    "https://images.unsplash.com/photo-1704408347810-8c7048e445a9?w=160&h=160&fit=crop&auto=format",
  ref3th:
    "https://images.unsplash.com/photo-1772471349657-ff47e898a632?w=160&h=160&fit=crop&auto=format",
  rel1: "https://images.unsplash.com/photo-1783142981025-eb5f44f4eede?w=560&h=700&fit=crop&auto=format",
  rel2: "https://images.unsplash.com/photo-1770149682823-0befb39aa86e?w=560&h=700&fit=crop&auto=format",
  rel3: "https://images.unsplash.com/photo-1658891389224-43441d0ea8ac?w=560&h=700&fit=crop&auto=format",
};

const HERO_DESC = [
  "Tùng Lâm Hòa Phúc là nơi hội tụ của những tâm hồn tầm cầu giải thoát — nơi giáo pháp Phật-đà được truyền thừa qua từng thế hệ với sự trân trọng và lòng tôn kính sâu sắc.",
  "Dưới ánh đèn từ bi của Đức Thế Tôn, hàng ngàn đệ tử từ khắp mọi miền đất nước tìm về nương tựa, học hỏi giáo pháp và thực hành con đường giác ngộ.",
  "Từ những buổi công phu khuya tĩnh lặng đến những khoá tu dài ngày, mỗi hoạt động tại đây đều mang ý nghĩa của sự chuyển hóa nội tâm và phụng sự Tam Bảo.",
  "Hãy cùng bước vào hành trình khám phá nguồn cội tâm linh, nền tảng tu học và những pháp môn thực hành của Tùng Lâm Hòa Phúc.",
];

const proseStyle: React.CSSProperties = {
  fontFamily: '"Lora", Georgia, serif',
  fontSize: "clamp(15px, 1.05vw, 17px)",
  lineHeight: 1.88,
  color: "rgba(240,230,210,0.88)",
  textAlign: "justify",
  margin: 0,
};

const articleDataMap: Record<string, ArticleData> = {
  "Miền Nam Chốn Tổ": {
    key: "Miền Nam Chốn Tổ",
    hero: P.articleHero,
    heroAlt: "Tôn tượng Bồ-tát ngàn tay",
    title: "Nguồn Cội Tâm Linh",
    subtitle: "Miền Nam Chốn Tổ",
    breadcrumbs: [
      { label: "Trang Chủ" },
      { label: "Nguồn Cội" },
      { label: "Miền Nam Chốn Tổ", active: true },
      { label: "Bài Viết" },
    ],
    blocks: [
      {
        type: "prose-right-card",
        prose: [
          "Vào những năm cuối thập niên 1970, trên mảnh đất phù sa màu mỡ của miền Nam Việt Nam, một ngôi già-lam nhỏ bé đã được dựng lên giữa vùng đất còn ngập tràn khói lửa chiến tranh. Đó là Tổ Đình Hoằng Pháp, tiền thân của những ngôi chùa mang hệ phái Tùng Lâm Hòa Phúc — một danh xưng mang đầy ý nghĩa: rừng thông thanh tịnh và phúc lành chan hòa khắp mọi nơi.",
          "Người đặt nền móng cho hành trình tâm linh ấy là Hòa Thượng Thích Trí Quảng, một bậc cao tăng xuất thân từ miền Trung, mang hoài bão truyền bá giáo pháp Tịnh Độ Tông đến khắp mọi ngõ ngách xã hội. Với giọng thuyết pháp ấm áp và từ hòa, Ngài thu phục hàng vạn tâm hồn lạc lối, dẫn dắt họ trở về bến bờ an lành của giáo pháp Phật-đà.",
          "Những buổi sáng tinh mơ, khi màn sương còn phủ dày trên mái chùa, tiếng chuông công phu khuya vang lên như tiếng gọi của cõi Phật, thức tỉnh tâm trí mê muội của chúng sinh. Chính trong không gian tĩnh lặng đó, hạt giống Bồ-đề tâm được gieo trồng và vun tưới qua từng ngày.",
        ],
        card: {
          label: "Tổ Đình",
          title: "Hoằng Pháp",
          thumbnailUrl: P.ref1th,
          thumbnailAlt: "Tổ Đình Hoằng Pháp",
          body: "Tổ Đình Hoằng Pháp tọa lạc tại huyện Hóc Môn, Thành phố Hồ Chí Minh, là một trong những trung tâm tu học Phật giáo lớn nhất miền Nam. Nơi đây hằng năm đón tiếp hàng chục nghìn Phật tử về tu học và chiêm bái.",
          linkText: "Tìm hiểu thêm về Tổ Đình Hoằng Pháp",
        },
      },
      {
        type: "poem",
        sectionTitle: "Tâm Kệ Cúng Dường",
        poem: [
          [
            "Nam mô Bổn Sư **Thích Ca Mâu Ni Phật**,",
            "Ánh **từ bi** tỏa chiếu khắp muôn phương,",
            "Đất trời **thanh tịnh** rõ ràng,",
            "Chúng sinh **tỉnh thức** lên đường về **Tây**.",
          ],
          [
            "Tùng Lâm Hòa Phúc **đạo tràng**,",
            "Mái chùa **cổ kính** tiếng chuông ngân dài,",
            "Núi rừng **thanh vắng** mây trôi,",
            "Thầy trò **đồng tâm** mở lời kinh thiêng.",
          ],
          [
            "Giữa **đêm khuya** tĩnh lặng sâu thẳm,",
            "Tiếng kệ hòa nhịp tâm **nguyện lành**,",
            "Ngọn đèn **Bát Nhã** long lanh,",
            "Soi đường **giải thoát** chúng sanh hồi đầu.",
          ],
        ],
      },
      {
        type: "card-left-prose",
        prose: [
          "Hành trình xây dựng Tùng Lâm Hòa Phúc không phải là con đường trải hoa hồng. Những năm đầu thành lập, cộng đồng tu học phải đối mặt với vô số thách thức: thiếu thốn cơ sở vật chất và những định kiến xã hội về vai trò của Phật giáo trong đời sống hiện đại.",
          "Chính trong những gian nan ấy, tinh thần Lục Hòa Cộng Trú — sáu nguyên tắc sống chung hài hòa của giáo đoàn — trở thành sợi dây vô hình gắn kết tăng đoàn. Mỗi sáng cùng lễ Phật, mỗi chiều ngồi thiền, mỗi tối học kinh trong tinh thần cởi mở và khiêm tốn.",
          "Năm 1995 đánh dấu bước ngoặt lịch sử: Khoá Tu Mùa Hè đầu tiên dành cho thanh thiếu niên được khai mở. Từ vài chục bạn trẻ ban đầu, phong trào lan rộng đến hàng chục nghìn người mỗi năm, vươn ra cộng đồng người Việt tại Mỹ, Úc, Pháp, Canada.",
          "Đây không chỉ là hoạt động tu học thông thường mà là cuộc cách mạng thầm lặng trong phương pháp hoằng pháp — đưa Phật giáo đến gần hơn với thế hệ trẻ qua ngôn ngữ và sinh hoạt phù hợp với thời đại mới.",
        ],
        card: {
          label: "Sư Ông",
          title: "Thích Trí Quảng",
          thumbnailUrl: P.ref2th,
          thumbnailAlt: "Hòa Thượng Thích Trí Quảng",
          body: "Hòa Thượng Thích Trí Quảng, thế danh Nguyễn Văn Năm, sinh năm 1938 tại Bình Định. Ngài là Đệ Nhất Phó Pháp Chủ HĐCM GHPGVN, người có công lớn trong việc phục hưng và phát triển Phật giáo Việt Nam hiện đại.",
          linkText: "Tìm hiểu thêm về Hòa Thượng Thích Trí Quảng",
        },
      },
      {
        type: "prose-right-card",
        prose: [
          "Ngày nay, Tùng Lâm Hòa Phúc không chỉ là một cơ sở tu học đơn thuần mà đã trở thành một hệ thống bao gồm nhiều ngôi chùa, thiền viện và trung tâm hoằng pháp trải dài từ miền Bắc đến miền Nam, từ đồng bằng sông Cửu Long đến vùng cao Tây Bắc hùng vĩ.",
          "Mỗi ngôi chùa trong hệ thống đều mang dáng dấp kiến trúc truyền thống Việt Nam kết hợp tinh thần hiện đại: những mái cong vút thanh thoát, những cột gỗ lim chạm khắc tinh xảo, những vườn thiền được vun đắp cẩn thận như biểu tượng của tâm thức được luyện qua giới — định — tuệ.",
          "Con đường tâm linh không có điểm kết thúc. Tại Tùng Lâm Hòa Phúc, mỗi bước chân trên sân chùa, mỗi hơi thở trong thiền định, mỗi tiếng kinh trong buổi công phu đều là một bước trên hành trình trở về với bản tâm thanh tịnh — hành trình mà cả tăng đoàn và hàng vạn đệ tử cư sĩ đang cùng nhau thực hiện với niềm tin bất hoại vào Phật — Pháp — Tăng.",
        ],
        card: {
          label: "Danh Lam",
          title: "Quỳnh Nhai Cam Lộ Tự",
          thumbnailUrl: P.ref3th,
          thumbnailAlt: "Quỳnh Nhai Cam Lộ Tự",
          body: "Tọa lạc trên mặt hồ thủy điện Sơn La, Quỳnh Nhai Cam Lộ Tự là ngôi chùa độc đáo nhất Việt Nam — một đảo nổi giữa lòng hồ, bao quanh bởi núi rừng Tây Bắc hùng vĩ, biểu tượng của sức sống Phật giáo vươn đến mọi nơi xa xôi.",
          linkText: "Tìm hiểu thêm về Quỳnh Nhai Cam Lộ Tự",
        },
      },
    ],
    related: [
      {
        imageUrl: P.rel1,
        caption: "Tam Quy & Ngũ Giới",
        category: "Nền Tảng Tu Học",
      },
      {
        imageUrl: P.rel2,
        caption: "Đời Thầy",
        category: "Nguồn Cội Tâm Linh",
      },
      {
        imageUrl: P.rel3,
        caption: "Thiền Tọa",
        category: "Pháp Môn Hành Trì",
      },
    ],
  },
};

export default function Page() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const galleries = useMemo<
    Array<{
      title: string;
      cards: CardData[];
      wide?: boolean;
      bg?: "a" | "b";
    }>
  >(
    () => [
      {
        title: "Nguồn Cội Tâm Linh",
        bg: "a",
        cards: [
          {
            imageUrl: P.elderMonk,
            caption: "Tiếp Bước Thầy Tôi",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.yellowCeremony,
            caption: "Đời Thầy",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.brownRobe,
            caption: "Miền Nam Chốn Tổ",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
      {
        title: "Nền Tảng Tu Học",
        bg: "b",
        cards: [
          {
            imageUrl: P.bodhisattva,
            caption: "Bồ Đề Tâm",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.buddhaAlt,
            caption: "Tam Quy & Ngũ Giới",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.buddhaOfferings,
            caption: "Lục Độ Vạn Hạnh",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
      {
        title: "Pháp Môn Hành Trì",
        bg: "a",
        cards: [
          {
            imageUrl: P.lanterns,
            caption: "Niệm Phật",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.prayerHall,
            caption: "Tụng Kinh",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.seated,
            caption: "Thiền Tọa",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
      {
        title: "Lộ Trình Tu Học",
        bg: "b",
        cards: [
          {
            imageUrl: P.incense,
            caption: "Lộ Trình Cho Người Mới Bắt Đầu",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.seatedMonk,
            caption: "Lộ Trình Cho Người Chuyên Tu",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.procession,
            caption: "Lộ Trình Cho Người Trẻ",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
      {
        title: "Nếp Sống Thiền Gia",
        bg: "a",
        cards: [
          {
            imageUrl: P.congregation,
            caption: "Văn Hóa Ứng Xử & Giao Tiếp Tại Chùa",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.beachMonk,
            caption: "Oai Nghi Người Con Phật",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.smoke,
            caption: "Bổn Phận Người Phật Tử Tại Gia",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
      {
        title: "Lịch Sử Hình Thành",
        bg: "b",
        wide: true,
        cards: [
          {
            imageUrl: P.night1,
            caption: "Tùng Lâm Hòa Phúc",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
          {
            imageUrl: P.night2,
            caption: "Quỳnh Nhai Cam Lộ Tự",
            onClick: () => setSelectedArticle("Miền Nam Chốn Tổ"),
          },
        ],
      },
    ],
    [],
  );

  const article = selectedArticle
    ? articleDataMap[selectedArticle] ?? articleDataMap["Miền Nam Chốn Tổ"]
    : null;

  if (article) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1A0F07" }}>
        <StickyHeader
          currentSection={article.title}
          breadcrumbs={article.breadcrumbs}
        />

        <div style={{ paddingTop: 80 }}>
          <HeroBanner
            imageUrl={article.hero}
            imageAlt={article.heroAlt}
            title={article.title}
            subtitle={article.subtitle}
            height={580}
          />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "18px clamp(20px,5.5vw,76px) 0",
            }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: '"Lora", serif',
                fontStyle: "italic",
                fontSize: 13,
                color: "rgba(212,175,55,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9.5 2L4 7l5.5 5"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                />
              </svg>
              Quay lại Tổng Quan
            </button>
          </div>

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "52px clamp(20px,5.5vw,76px) 80px",
              display: "flex",
              flexDirection: "column",
              gap: 52,
            }}
          >
            {article.blocks.map((block, index) => (
              <div key={index}>
                {block.type === "prose-right-card" && (
                  <div className="article-grid">
                    <div style={articleProseWrapStyle}>
                      {block.prose.map((text, i) => (
                        <p
                          key={i}
                          style={proseStyle}
                          className={i === 0 ? "drop-cap-p" : ""}
                        >
                          {renderGoldText(text)}
                        </p>
                      ))}
                    </div>
                    <ReferenceCard {...block.card} />
                  </div>
                )}

                {block.type === "card-left-prose" && (
                  <div className="article-grid">
                    <ReferenceCard {...block.card} />
                    <div style={articleProseWrapStyle}>
                      {block.prose.map((text, i) => (
                        <p key={i} style={proseStyle}>
                          {renderGoldText(text)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === "poem" && (
                  <div>
                    <SectionRule>{block.sectionTitle}</SectionRule>
                    <div
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 100% at 50% 50%, #472C14 0%, #2B1C10 100%)",
                        border: "1px solid rgba(212,175,55,0.18)",
                        borderRadius: 10,
                        padding: "44px clamp(24px, 5vw, 72px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 32,
                      }}
                    >
                      {block.poem.map((stanza, si) => (
                        <div
                          key={si}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0,
                          }}
                        >
                          {stanza.map((line, li) => (
                            <PoemLine key={li} raw={line} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {index !== article.blocks.length - 1 && <GoldDivider />}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(212,175,55,0.14)" }}>
            <CardGallery
              sectionTitle="Tìm Hiểu Thêm"
              cards={article.related}
              bgVariant="b"
              onCardClick={(caption) => setSelectedArticle("Miền Nam Chốn Tổ")}
            />
          </div>

          <Footer />
        </div>

        <ResponsiveStyle />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1A0F07" }}>
      <StickyHeader
        currentSection="Tông Chỉ Tu Học"
        breadcrumbs={[
          { label: "Trang Chủ" },
          { label: "Nguồn Cội", active: true },
          { label: "Tu Học" },
          { label: "Pháp Môn" },
          { label: "Lịch Sử" },
        ]}
      />

      <div style={{ paddingTop: 80 }}>
        <HeroBanner
          imageUrl={P.hall}
          imageAlt="Đại chúng lễ Phật tại Tùng Lâm Hòa Phúc"
          title="Tông Chỉ Tu Học"
          subtitle="Tùng Lâm Hòa Phúc"
          description={HERO_DESC}
          height={730}
        />

        <div style={{ height: 1, backgroundColor: "rgba(212,175,55,0.14)" }} />

        {galleries.map((g, i) => (
          <CardGallery
            key={i}
            sectionTitle={g.title}
            cards={g.cards}
            wideCards={g.wide}
            bgVariant={g.bg}
          />
        ))}

        <Footer />
      </div>

      <ResponsiveStyle />
    </div>
  );
}

function StickyHeader({
  currentSection,
  breadcrumbs,
}: {
  currentSection: string;
  breadcrumbs: { label: string; active?: boolean }[];
}) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        zIndex: 40,
        width: "100%",
        backdropFilter: "blur(14px)",
        background: "rgba(20,10,5,0.72)",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            color: "#E8C766",
            fontFamily: '"Playfair Display", serif',
            fontSize: 18,
            letterSpacing: "0.08em",
          }}
        >
          {currentSection}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            color: "rgba(240,230,210,0.72)",
            fontSize: 12,
            fontFamily: '"Lora", serif',
          }}
        >
          {breadcrumbs.map((item, i) => (
            <span
              key={i}
              style={{ color: item.active ? "#E8C766" : undefined }}
            >
              {i > 0 ? " / " : ""}
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

function HeroBanner({
  imageUrl,
  imageAlt,
  title,
  subtitle,
  description,
  height,
}: {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description?: string[];
  height: number;
}) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: height,
        overflow: "hidden",
      }}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.58)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,5,2,0.2) 0%, rgba(26,15,7,0.82) 88%, #1A0F07 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px clamp(20px,5.5vw,76px) 80px",
          color: "#F6EDD9",
        }}
      >
        <div
          style={{
            color: "#D9B55A",
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {subtitle}
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: '"Playfair Display", serif',
            fontSize: "clamp(40px, 7vw, 76px)",
            lineHeight: 1.08,
            fontWeight: 700,
          }}
        >
          {title}
        </h1>

        {description && (
          <div
            style={{
              marginTop: 28,
              maxWidth: 860,
              display: "grid",
              gap: 14,
            }}
          >
            {description.map((line, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontFamily: '"Lora", serif',
                  fontSize: "clamp(15px, 1.15vw, 18px)",
                  lineHeight: 1.9,
                  color: "rgba(246,237,217,0.88)",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CardGallery({
  sectionTitle,
  cards,
  wideCards,
  bgVariant = "a",
  onCardClick,
}: {
  sectionTitle: string;
  cards: CardData[];
  wideCards?: boolean;
  bgVariant?: "a" | "b";
  onCardClick?: (caption: string) => void;
}) {
  return (
    <section
      style={{
        padding: "58px 0",
        background:
          bgVariant === "a"
            ? "linear-gradient(180deg, #1A0F07 0%, #23140A 100%)"
            : "linear-gradient(180deg, #201208 0%, #140B05 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px,5.5vw,76px)",
        }}
      >
        <SectionRule>{sectionTitle}</SectionRule>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: wideCards
              ? "repeat(auto-fit, minmax(320px, 1fr))"
              : "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={card.onClick ?? (() => onCardClick?.(card.caption))}
              style={{
                textAlign: "left",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(212,175,55,0.12)",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                color: "inherit",
              }}
            >
              <div style={{ aspectRatio: wideCards ? "4 / 3" : "4 / 5" }}>
                <img
                  src={card.imageUrl}
                  alt={card.caption}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ padding: 18 }}>
                {card.category && (
                  <div
                    style={{
                      color: "#CDAA50",
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {card.category}
                  </div>
                )}

                <div
                  style={{
                    color: "#F4E8CC",
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 24,
                    lineHeight: 1.3,
                  }}
                >
                  {card.caption}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferenceCard({
  label,
  title,
  thumbnailUrl,
  thumbnailAlt,
  body,
  linkText,
}: {
  label: string;
  title: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  body: string;
  linkText: string;
}) {
  return (
    <aside
      style={{
        background:
          "linear-gradient(180deg, rgba(66,41,18,0.75) 0%, rgba(42,25,12,0.95) 100%)",
        border: "1px solid rgba(212,175,55,0.14)",
        borderRadius: 16,
        padding: 22,
        color: "#F2E7CA",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <img
          src={thumbnailUrl}
          alt={thumbnailAlt}
          style={{
            width: 68,
            height: 68,
            objectFit: "cover",
            borderRadius: "50%",
            border: "2px solid rgba(212,175,55,0.28)",
          }}
        />
        <div>
          <div
            style={{
              color: "#CDAA50",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 24,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <p
        style={{
          ...proseStyle,
          fontSize: 15,
          lineHeight: 1.8,
          color: "rgba(242,231,202,0.86)",
          marginBottom: 16,
        }}
      >
        {body}
      </p>

      <button
        style={{
          border: "none",
          background: "none",
          padding: 0,
          color: "#E8C766",
          fontSize: 14,
          fontFamily: '"Lora", serif',
          cursor: "pointer",
        }}
      >
        {linkText} →
      </button>
    </aside>
  );
}

function PoemLine({ raw }: { raw: string }) {
  const parts = raw.split(/\*\*(.*?)\*\*/);

  return (
    <p
      style={{
        fontFamily: '"Lora", Georgia, serif',
        fontSize: "clamp(15px, 1.05vw, 17px)",
        lineHeight: 1.95,
        color: "rgba(240,230,210,0.88)",
        textAlign: "center",
        margin: 0,
        fontStyle: "italic",
      }}
    >
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            style={{ color: "#F0C955", fontStyle: "normal", fontWeight: 600 }}
          >
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

function SectionRule({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        margin: "0 0 28px",
      }}
    >
      <h3
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          fontSize: "clamp(14px, 1.6vw, 22px)",
          color: "#E8C766",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          margin: 0,
          flexShrink: 0,
        }}
      >
        {children}
      </h3>
      <div
        style={{
          flex: 1,
          height: 1,
          backgroundColor: "rgba(212,175,55,0.28)",
        }}
      />
    </div>
  );
}

function GoldDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        marginTop: 10,
      }}
    >
      <div
        style={{
          width: 52,
          height: 1,
          backgroundColor: "rgba(212,175,55,0.3)",
        }}
      />
      <div
        style={{
          width: 7,
          height: 7,
          border: "1px solid rgba(212,175,55,0.48)",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          width: 52,
          height: 1,
          backgroundColor: "rgba(212,175,55,0.3)",
        }}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "56px 40px 80px",
        textAlign: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, #3C2410 0%, #1A0F07 60%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: "rgba(212,175,55,0.3)",
          }}
        />
        <div
          style={{
            width: 9,
            height: 9,
            border: "1.5px solid rgba(212,175,55,0.5)",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: "rgba(212,175,55,0.3)",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 10,
          color: "rgba(212,175,55,0.42)",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Tùng Lâm Hòa Phúc &nbsp;·&nbsp; Nam Mô A Di Đà Phật
      </p>
    </footer>
  );
}

function ResponsiveStyle() {
  return (
    <style jsx global>{`
      .article-grid {
        display: grid;
        grid-template-columns: 1.5fr 0.95fr;
        gap: 32px;
        align-items: start;
      }

      .drop-cap-p::first-letter {
        font-size: 3.6em;
        line-height: 0.9;
        float: left;
        margin-right: 10px;
        margin-top: 8px;
        color: #e8c766;
        font-family: "Playfair Display", serif;
      }

      @media (max-width: 960px) {
        .article-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

const articleProseWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

function renderGoldText(text: string) {
  const words = [
    "Tổ Đình Hoằng Pháp",
    "Tùng Lâm Hòa Phúc",
    "Hòa Thượng Thích Trí Quảng",
    "Tịnh Độ Tông",
    "công phu khuya",
    "Bồ-đề tâm",
    "Lục Hòa Cộng Trú",
    "Khoá Tu Mùa Hè",
    "giới — định — tuệ",
    "Phật — Pháp — Tăng",
  ];

  let result: ReactNode[] = [text];

  words.forEach((word) => {
    result = result.flatMap((chunk) => {
      if (typeof chunk !== "string") return [chunk];
      const parts = chunk.split(word);
      if (parts.length === 1) return [chunk];

      const merged: ReactNode[] = [];
      parts.forEach((part, i) => {
        if (part) merged.push(part);
        if (i < parts.length - 1) {
          merged.push(
            <strong key={`${word}-${i}`} style={{ color: "#E8C766" }}>
              {word}
            </strong>,
          );
        }
      });
      return merged;
    });
  });

  return result;
}
