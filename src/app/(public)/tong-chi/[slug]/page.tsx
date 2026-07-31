'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SubNavbar } from '@/components/tong-chi/SubNavbar';
import { SidebarNav } from '@/components/tong-chi/SidebarNav';
import { HeroBanner } from '@/components/tong-chi/HeroBanner';

<<<<<<< HEAD
// Import các khối Tiếng Việt vừa tách
import { KhoiVideoMinhHoa } from '@/components/tong-chi/chi-tiet/KhoiVideoMinhHoa';
import { KhoiBaiVietNoiBat } from '@/components/tong-chi/chi-tiet/KhoiBaiVietNoiBat';
import { KhoiBoSuuTapAnh } from '@/components/tong-chi/chi-tiet/KhoiBoSuuTapAnh';
import { KhoiTimHieuThem } from '@/components/tong-chi/chi-tiet/KhoiTimHieuThem';
import { KhoiHoiDapAi } from '@/components/tong-chi/chi-tiet/KhoiHoiDapAi';
import { CuaSoHienThiModal } from '@/components/tong-chi/chi-tiet/CuaSoHienThiModal';

interface DuLieuBaiVietChiTiet {
=======
interface DetailPostData {
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  id: number;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  heroBanner: string;
  poemContent?: string;
  popups?: Array<{
    keyword: string;
    title: string;
    description: string;
<<<<<<< HEAD
    imageUrl?: string;
    linkUrl?: string;
=======
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  }>;
  videoBlock?: {
    title?: string;
    description?: string;
    videoUrl?: string;
  };
<<<<<<< HEAD
  featuredArticle?: {
    label?: string;
    title?: string;
    author?: string;
    bgImage?: string;
    linkUrl?: string;
  };
  photoGallery?: Array<{
    imageUrl?: string;
    url?: string;
    title?: string;
    caption?: string;
    space3dLink?: string;
    khuVuc?: string;
    noiDung?: string;
  }>;
  relatedArticles?: Array<{
    category: string;
    title: string;
    url: string;
    link?: string;
  }>;
}

function formatContentHtml(rawHtml: string): string {
  if (!rawHtml) return '';
=======
  photoGallery?: Array<{
    imageUrl: string;
    caption?: string;
    space3dLink?: string;
  }>;
  learnMoreCards?: Array<{
    tag?: string;
    title: string;
    description: string;
    linkUrl?: string;
  }>;
}

// 🛠️ HÀM BẢO TỒN THẺ <p> ĐỂ KÍCH HOẠT DROP CAP & SỬA RÃ PHÔNG TIẾNG VIỆT
function formatContentHtml(rawHtml: string): string {
  if (!rawHtml) return '';

>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  let clean = rawHtml
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')
    .trim();

<<<<<<< HEAD
  if (!clean.startsWith('<p>')) clean = `<p>${clean}</p>`;
  return clean;
}

export default function TrangChiTietTongChi() {
  const params = useParams();
  const slug = params?.slug as string;

  const navItems = [
    { id: 'bai-tho', label: 'Bài thơ / Nội dung' },
    { id: 'video-minh-hoa', label: 'Video minh họa' },
    { id: 'bai-viet-noibat', label: 'Bài viết nổi bật' },
    { id: 'bo-suu-tap-anh', label: 'Bộ sưu tập ảnh' },
    { id: 'tim-hieu-them', label: 'Tìm hiểu thêm' },
  ];

  const [data, setData] = useState<DuLieuBaiVietChiTiet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('bai-tho');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const [activeKeywordPopup, setActiveKeywordPopup] = useState<{
    keyword: string;
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
  } | null>(null);

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null && data?.photoGallery) {
      setActivePhotoIndex(activePhotoIndex === 0 ? data.photoGallery.length - 1 : activePhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null && data?.photoGallery) {
      setActivePhotoIndex(activePhotoIndex === data.photoGallery.length - 1 ? 0 : activePhotoIndex + 1);
    }
  };
=======
  if (!clean.startsWith('<p>')) {
    clean = `<p>${clean}</p>`;
  }

  return clean;
}

// 🛠️ HELPER CONVERT LINK YOUTUBE
function formatYoutubeEmbed(url?: string): string {
  if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
  return url;
}

export default function TongChiSlugDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<DetailPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('bai-tho');

  // Modals
  const [activePhoto, setActivePhoto] = useState<{ imageUrl: string; caption?: string; space3dLink?: string } | null>(null);
  const [activeKeywordPopup, setActiveKeywordPopup] = useState<{ keyword: string; title: string; description: string } | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06

  useEffect(() => {
    async function fetchDetailData() {
      try {
        const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?slug=${slug}&_embed`, { cache: 'no-store' });
        const posts = await res.json();

        if (posts && posts.length > 0) {
          const post = posts[0];
          const acf = post.acf || {};

          const banner = acf.banner_image?.url || acf.banner_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          const content = acf.poem_wysiwyg || post.content?.rendered || '';
          
<<<<<<< HEAD
=======
          // Lấy đoạn mô tả ngắn (Excerpt) & giữ lại xuống dòng
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
          const rawExcerpt = post.excerpt?.rendered || '';
          const cleanExcerpt = rawExcerpt
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&#8230;/g, '...')
            .replace(/&hellip;/g, '...')
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, ' ')
            .normalize('NFC')
            .trim();

<<<<<<< HEAD
          const defaultGallery = [
            {
              title: 'LỄ TƯỞNG NIỆM KHAI SƠN TÔNG PHONG HOẰNG PHÁP',
              imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
              khuVuc: 'Bảo tàng',
              noiDung: 'Lễ Tưởng Niệm Khai Sơn Tông Phong Hoằng Pháp',
            },
            {
              title: 'ĐẠO TRÀNG THANH THIẾU NIÊN TU HỌC',
              imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
              khuVuc: 'Giảng đường',
              noiDung: 'Các bạn khóa sinh tham gia khóa tu mùa hè.',
            },
          ];

=======
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
          setData({
            id: post.id,
            title: post.title?.rendered || '',
            subtitle: acf.sub_title || '',
            shortDescription: cleanExcerpt,
            heroBanner: banner,
            poemContent: formatContentHtml(content),
<<<<<<< HEAD
            popups: acf.keyword_popups_repeater?.map((item: any) => ({
              keyword: item.keyword || item.title,
              title: item.title || item.keyword,
              description: item.description,
              imageUrl: item.image?.url || item.image || item.imageUrl,
              linkUrl: item.link_url || item.linkUrl || '#',
            })) || [],
            videoBlock: {
              title: acf.video_block?.title || 'LỄ TƯỞNG NIỆM LẦN THỨ 33',
              description: acf.video_block?.description || 'Thước phim tư liệu ghi lại bầu không khí trang nghiêm và lòng thành kính của hàng môn đồ đệ tử trong ngày lễ tưởng niệm Chư Tổ Sư.',
              videoUrl: acf.video_block?.url || acf.video_block?.video_url || 'https://www.youtube.com/watch?v=sVrfy4Igykw',
            },
            photoGallery: acf.gallery_repeater?.length > 0
              ? acf.gallery_repeater.map((item: any) => ({
                  imageUrl: item.image?.url || item.image || item.imageUrl,
                  title: item.title || item.caption,
                  caption: item.caption,
                  khuVuc: item.khu_vuc || 'Tùng Lâm Hòa Phúc',
                  noiDung: item.noi_dung || item.caption,
                  space3dLink: item.space_3d_link,
                }))
              : defaultGallery,
=======
            popups: acf.keyword_popups_repeater || [],
            videoBlock: acf.video_block ? {
              title: acf.video_block.title || 'Video Minh Họa',
              description: acf.video_block.description,
              videoUrl: acf.video_block.url || acf.video_block.video_url,
            } : undefined,
            photoGallery: acf.gallery_repeater?.map((item: any) => ({
              imageUrl: item.image?.url || item.image || item.imageUrl,
              caption: item.caption,
              space3dLink: item.space_3d_link,
            })) || [],
            learnMoreCards: acf.learn_more_repeater?.map((item: any) => ({
              tag: item.tag || 'NGUỒN CỘI TÂM LINH',
              title: item.title,
              description: item.description,
              linkUrl: item.link_url || '#',
            })) || [],
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
          });
        }
      } catch (err) {
        console.error('Lỗi tải bài viết chi tiết:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDetailData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
<<<<<<< HEAD

      const sectionIds = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

=======
    };
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
=======
  // 🛠️ XỬ LÝ CLICK VÀO CHỮ IN ĐẬM (<STRONG>/<B>) ĐỂ MỞ POPUP
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  const handlePoemContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const boldEl = target.closest('strong, b');

    if (boldEl) {
      const keywordText = boldEl.textContent?.trim() || '';
      if (!keywordText) return;

      const matchedPopup = data?.popups?.find(
        (p) => p.keyword?.toLowerCase() === keywordText.toLowerCase() || p.title?.toLowerCase() === keywordText.toLowerCase()
      );

      if (matchedPopup) {
        setActiveKeywordPopup({
          keyword: matchedPopup.keyword || keywordText,
          title: matchedPopup.title || keywordText.toUpperCase(),
          description: matchedPopup.description || 'Chưa có thông tin chú thích.',
<<<<<<< HEAD
          imageUrl: matchedPopup.imageUrl,
          linkUrl: matchedPopup.linkUrl,
=======
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
        });
      } else {
        setActiveKeywordPopup({
          keyword: keywordText,
          title: keywordText.toUpperCase(),
          description: `Thông tin giải nghĩa chi tiết cho từ khóa "${keywordText}".`,
<<<<<<< HEAD
          imageUrl: data?.heroBanner,
          linkUrl: '#',
=======
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
        });
      }
    }
  };

<<<<<<< HEAD
=======
  const navItems = [
    { id: 'bai-tho', label: 'BÀI THƠ / NỘI DUNG' },
    { id: 'video-minh-hoa', label: 'VIDEO MINH HỌA' },
    { id: 'bo-suu-tap-anh', label: 'BỘ SỰ TẬP ẢNH' },
    { id: 'tim-hieu-them', label: 'TÌM HIỂU THÊM' },
  ];

>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1c11] flex items-center justify-center text-[#ffde59]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffde59] border-t-transparent rounded-full animate-spin" />
<<<<<<< HEAD
          <p className="tracking-widest uppercase text-sm font-medium">Đang tải dữ liệu...</p>
=======
          <p className="tracking-widest uppercase text-sm font-medium">Đang tải Tông Phong Truyền Thừa...</p>
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="w-full min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
=======
    <div className="min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black">
      {/* 1. ANCHOR NAV NGANG & DỌC */}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
<<<<<<< HEAD
        pageTitle={data?.title || 'TÔNG PHONG TRUYỀN THỪA'}
        navItems={navItems}
=======
        navItems={navItems}
        pageTitle="TÔNG PHONG TRUYỀN THỪA"
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
<<<<<<< HEAD
        pageTitle={data?.title || 'TÔNG PHONG TRUYỀN THỪA'}
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner bannerUrl={data?.heroBanner} title={data?.title} subtitle={data?.subtitle} />

        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          {/* KHỐI BÀI THƠ / NỘI DUNG CHÍNH */}
          <section id="bai-tho" className="scroll-mt-24 relative">
            <div className="text-center">
=======
        navItems={navItems}
      />

      <div className={`transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* 2. HERO BANNER CHUẨN ĐỒNG BỘ */}
        <HeroBanner
          bannerUrl={data?.heroBanner}
          title={data?.title}
          subtitle={data?.subtitle}
        />

        <main className="max-w-5xl mx-auto pt-4 pb-12 space-y-12">
          {/* 3. KHỐI NỘI DUNG CĂN GIỮA */}
          <section id="bai-tho" className="scroll-mt-24 relative">
            <div className="text-center">
              
              {/* 🟢 CÂN CHỈNH KHOẢNG CÁCH SUBTITLE:
                  - mt-3: Cân đối khoảng cách phía trên với vạch kẻ ngang.
                  - mb-12: Tạo khoảng trống lớn cách biệt rõ ràng với phần nội dung bên dưới.
              */}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
              {data?.shortDescription && (
                <div className="max-w-xl mx-auto -mt-9 mb-12 px-4">
                  <h2
                    style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                    className="text-lg sm:text-xl md:text-2xl text-[#ffde59] uppercase tracking-wider leading-relaxed md:leading-loose whitespace-pre-line break-words opacity-90"
                  >
                    {data.shortDescription}
                  </h2>
                </div>
              )}

<<<<<<< HEAD
=======
              {/* NỘI DUNG CHÍNH - CĂN GIỮA, CLICK IN ĐẬM ĐỂ HIỆN POPUP */}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
              {data?.poemContent && (
                <div
                  onClick={handlePoemContentClick}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="
                    text-base sm:text-lg md:text-xl text-[#ffde59]
                    leading-relaxed md:leading-loose tracking-wide
                    space-y-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                    text-center
<<<<<<< HEAD
                    [&>p]:text-center [&>p]:mb-4
                    [&_strong]:text-[#ffde59] [&_strong]:underline [&_strong]:decoration-dotted [&_strong]:cursor-pointer
                    [&_b]:text-[#ffde59] [&_b]:underline [&_b]:decoration-dotted [&_b]:cursor-pointer
                    [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
                    [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl
                    [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-[#ffde59]
                    [&>p:first-of-type::first-letter]:mr-2 [&>p:first-of-type::first-letter]:pb-1 [&>p:first-of-type::first-letter]:leading-none
=======
                    
                    [&>p]:text-center
                    [&>p]:mb-4
                    [&>p]:leading-relaxed md:[&>p]:leading-loose

                    [&_strong]:text-[#ffde59] [&_strong]:underline [&_strong]:decoration-dotted [&_strong]:underline-offset-4 [&_strong]:cursor-pointer [&_strong]:hover:text-white
                    [&_b]:text-[#ffde59] [&_b]:underline [&_b]:decoration-dotted [&_b]:underline-offset-4 [&_b]:cursor-pointer [&_b]:hover:text-white

                    [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
                    [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl
                    [&>p:first-of-type::first-letter]:font-bold
                    [&>p:first-of-type::first-letter]:text-[#ffde59]
                    [&>p:first-of-type::first-letter]:mr-2
                    [&>p:first-of-type::first-letter]:pb-1
                    [&>p:first-of-type::first-letter]:leading-none
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
                  "
                  dangerouslySetInnerHTML={{ __html: data.poemContent }}
                />
              )}
            </div>
<<<<<<< HEAD
          </section>

          {/* CÁC KHỐI TIẾNG VIỆT ĐƯỢC GỌI GỌN GÀNG */}
          <KhoiVideoMinhHoa heroBanner={data?.heroBanner} videoBlock={data?.videoBlock} />
          <KhoiBaiVietNoiBat heroBanner={data?.heroBanner} featuredArticle={data?.featuredArticle} />
          <KhoiBoSuuTapAnh photoGallery={data?.photoGallery} onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
          <KhoiTimHieuThem relatedArticles={data?.relatedArticles} />
          <KhoiHoiDapAi />
        </main>

        <CuaSoHienThiModal
          activePhotoIndex={activePhotoIndex}
          photoGallery={data?.photoGallery}
          onClosePhotoModal={() => setActivePhotoIndex(null)}
          onPrevPhoto={handlePrevPhoto}
          onNextPhoto={handleNextPhoto}
          onSelectPhotoIndex={(idx) => setActivePhotoIndex(idx)}
          activeKeywordPopup={activeKeywordPopup}
          onCloseKeywordPopup={() => setActiveKeywordPopup(null)}
        />
      </div>
=======

            {/* NÚT ĐẶT CÂU HỎI */}
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c8aa6e] to-[#ffde59] text-[#2c1c11] font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Đặt Câu Hỏi Cho Chư Tăng
              </button>
            </div>
          </section>

          {/* 4. KHỐI VIDEO MINH HỌA */}
          {data?.videoBlock?.videoUrl && (
            <section id="video-minh-hoa" className="scroll-mt-24 space-y-6">
              <h2
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-2xl md:text-3xl font-bold text-[#ffde59] uppercase border-l-4 border-[#ffde59] pl-4"
              >
                {data.videoBlock.title || 'Video Minh Họa'}
              </h2>
              {data.videoBlock.description && (
                <p className="text-[#e3d2c1]/80 text-sm md:text-base font-serif">{data.videoBlock.description}</p>
              )}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-[#f2cc8f]/20 bg-black">
                <iframe
                  className="w-full h-full"
                  src={formatYoutubeEmbed(data.videoBlock.videoUrl)}
                  title="Video Minh họa"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* 5. KHỐI BỘ SỰ TẬP ẢNH TƯ LIỆU */}
          {data?.photoGallery && data.photoGallery.length > 0 && (
            <section id="bo-suu-tap-anh" className="scroll-mt-24 space-y-6">
              <h2
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-2xl md:text-3xl font-bold text-[#ffde59] uppercase border-l-4 border-[#ffde59] pl-4"
              >
                Bộ Sự Tập Ảnh Tư Liệu
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.photoGallery.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(photo)}
                    className="group relative h-48 sm:h-60 rounded-xl overflow-hidden border border-[#f2cc8f]/20 cursor-pointer shadow-lg hover:border-[#ffde59] transition-all"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Ảnh tư liệu'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-xs sm:text-sm text-[#ffde59] font-medium">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. KHỐI TÌM HIỂU THÊM */}
          {data?.learnMoreCards && data.learnMoreCards.length > 0 && (
            <section id="tim-hieu-them" className="scroll-mt-24 space-y-6">
              <h2
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-2xl md:text-3xl font-bold text-[#ffde59] uppercase border-l-4 border-[#ffde59] pl-4"
              >
                Tìm Hiểu Thêm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.learnMoreCards.map((card, idx) => (
                  <a
                    key={idx}
                    href={card.linkUrl || '#'}
                    className="group bg-[#1f130b] rounded-2xl overflow-hidden border border-[#f2cc8f]/20 hover:border-[#ffde59] transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#c8aa6e] block mb-2 font-medium">
                        {card.tag || 'NGUỒN CỘI TÂM LINH'}
                      </span>
                      <h3 className="text-lg font-bold text-[#ffde59] group-hover:text-white transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#e3d2c1]/80 mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <span className="mt-4 text-xs font-bold text-[#ffde59] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Xem chi tiết &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* MODALS */}
      {activeKeywordPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#2c1c11] border-2 border-[#ffde59] rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setActiveKeywordPopup(null)}
              className="absolute top-4 right-4 text-[#f2cc8f] hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-[#ffde59] border-b border-[#f2cc8f]/20 pb-2">
              {activeKeywordPopup.title}
            </h3>
            <p className="text-sm text-[#e3d2c1] mt-4 leading-relaxed font-serif">
              {activeKeywordPopup.description}
            </p>
          </div>
        </div>
      )}

      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 text-white text-lg font-bold hover:text-[#ffde59] cursor-pointer"
            >
              ✕ Đóng
            </button>
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.caption || 'Ảnh tư liệu'}
              className="max-h-[75vh] w-auto object-contain rounded-lg border border-[#f2cc8f]/30"
            />
            {activePhoto.caption && (
              <p className="mt-4 text-[#ffde59] text-center text-lg">{activePhoto.caption}</p>
            )}
            {activePhoto.space3dLink && (
              <a
                href={activePhoto.space3dLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 bg-[#ffde59] text-[#2c1c11] font-bold px-4 py-2 rounded-full text-sm hover:scale-105 transition-all"
              >
                Khám phá Không Gian 3D &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2c1c11] border border-[#ffde59] rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute top-4 right-4 text-[#f2cc8f] hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-[#ffde59] mb-4">Gửi Câu Hỏi / Thắc Mắc Tu Học</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Cảm ơn bạn! Câu hỏi đã được gửi đến chư Tăng.');
                setIsQuestionModalOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Họ và tên Phật tử"
                required
                className="w-full bg-[#1a100a] border border-[#f2cc8f]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#ffde59]"
              />
              <textarea
                rows={4}
                placeholder="Nội dung thắc mắc / câu hỏi..."
                required
                className="w-full bg-[#1a100a] border border-[#f2cc8f]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#ffde59]"
              />
              <button
                type="submit"
                className="w-full bg-[#ffde59] text-[#2c1c11] font-bold py-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                Gửi Đến Chư Tăng
              </button>
            </form>
          </div>
        </div>
      )}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
    </div>
  );
}