'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';

// Import các khối Tiếng Việt đã bóc tách
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
import { AiQnA } from '@/components/tong-chi-tu-hoc/chi-tiet/AiQnA';
import { DetailModal } from '@/components/tong-chi-tu-hoc/chi-tiet/DetailModal';
import { BookCitationSection, SourceBookData } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';

interface DuLieuBaiVietChiTiet {
  id: number;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  heroBanner: string;
  bannerPosition?: string;
  poemContent?: string;
  author?: string;
  authorLink?: string;
  sourceBook?: SourceBookData | SourceBookData[];
  popups?: Array<{
    keyword: string;
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
  }>;
  videoBlock?: {
    title?: string;
    description?: string;
    videoUrl?: string;
  };
  featuredArticle?: {
    label?: string;
    title?: string;
    author?: string;
    bgImage?: string;
    bgPosition?: string;
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

// 🛠️ 1. Hàm định dạng HTML nội dung bài thơ
function formatContentHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  let clean = rawHtml
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')
    .trim();

  if (!clean.startsWith('<p>')) clean = `<p>${clean}</p>`;
  return clean;
}

// 🛠️ 2. HÀM QUY ĐỔI MEDIA ID THÀNH URL ẢNH THẬT (XỬ LÝ THUẦN NEXT.JS)
async function resolveImageUrl(imgField: any, fallbackUrl: string = ''): Promise<string> {
  if (!imgField) return fallbackUrl;

  // Trường hợp 1: ACF trả về Chuỗi URL trực tiếp (https://...)
  if (typeof imgField === 'string' && imgField.length > 0) {
    if (imgField.startsWith('http') || imgField.startsWith('/')) return imgField;
  }

  // Trường hợp 2: ACF trả về Object chứa thông tin ảnh
  if (typeof imgField === 'object' && imgField !== null) {
    return (
      imgField.url ||
      imgField.source_url ||
      imgField.sizes?.large ||
      imgField.sizes?.full ||
      fallbackUrl
    );
  }

  // Trường hợp 3: ACF trả về ID dạng số (Ví dụ: 447)
  const numericId = Number(imgField);
  if (!isNaN(numericId) && numericId > 0) {
    try {
      const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/media/${numericId}`);
      if (res.ok) {
        const mediaData = await res.json();
        return (
          mediaData.source_url ||
          mediaData.media_details?.sizes?.large?.source_url ||
          mediaData.media_details?.sizes?.full?.source_url ||
          fallbackUrl
        );
      }
    } catch (err) {
      console.error('❌ Lỗi khi tự động tra cứu Media ID:', numericId, err);
    }
  }

  return fallbackUrl;
}

// 🛠️ 3. Hàm làm sạch nội dung chữ (Xóa thẻ HTML)
function cleanPopupDescription(rawHtml: string): string {
  if (!rawHtml) return 'Đang cập nhật thông tin giải nghĩa...';
  return rawHtml
    .replace(/<[^>]+>/g, '')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')
    .trim();
}

export default function TrangChiTietTongChi() {
  const params = useParams();
  const slug = params?.slug as string;

  const isBoDeTam = slug === 'bo-de-tam-coi-nguon-thien-phap';

  const navItems = isBoDeTam
    ? [
        { id: 'bo-de-tam-la-gi', label: 'Bồ Đề Tâm Là Gì' },
        { id: 'bo-de-tam-la-nen-tang', label: 'Bồ Đề Tâm Là Nền Tảng' },
        { id: 'bo-de-tam-la-dong-luc', label: 'Bồ Đề Tâm Là Động Lực' },
        { id: 'bo-de-tam-la-suc-manh', label: 'Bồ Đề Tâm Là Sức Mạnh' },
        { id: 'song-voi-bo-de-tam', label: 'Sống Với Bồ Đề Tâm' },
        { id: 'de-bo-de-tam-them-lon', label: 'Để Bồ Đề Tâm Thêm Lớn' },
        { id: 'trich-nguon-sach', label: 'Trích Nguồn Sách' },
        { id: 'video-minh-hoa', label: 'Video Pháp Thoại' },
        { id: 'bo-suu-tap-anh', label: 'Bộ Sưu Tập Ảnh' },
        { id: 'tim-hieu-them', label: 'Bài Viết Liên Quan' },
      ]
    : [
        { id: 'bai-tho', label: 'Bài Thơ / Nội Dung' },
        { id: 'trich-nguon-sach', label: 'Trích Nguồn Sách' },
        { id: 'video-minh-hoa', label: 'Video Minh Họa' },
        { id: 'bai-viet-noibat', label: 'Bài Viết Nổi Bật' },
        { id: 'bo-suu-tap-anh', label: 'Bộ Sưu Tập Ảnh' },
        { id: 'tim-hieu-them', label: 'Tìm Hiểu Thêm' },
      ];

  const [data, setData] = useState<DuLieuBaiVietChiTiet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(navItems[0]?.id || 'bai-tho');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const sidebarTitle = isBoDeTam
    ? 'BỒ ĐỀ TÂM'
    : (data?.title || 'TÔNG CHỈ TU HỌC').length > 18
    ? (data?.title || 'TÔNG CHỈ TU HỌC').split('-')[0].trim()
    : (data?.title || 'TÔNG CHỈ TU HỌC');

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

  useEffect(() => {
    async function fetchDetailData() {
      try {
        setLoading(true);

        // 1. Check Local Backend JSON Store First
        try {
          const [detailRes, allRes] = await Promise.all([
            fetch(`/api/admin/tong-chi/${slug}`, { cache: 'no-store' }),
            fetch('/api/admin/tong-chi', { cache: 'no-store' }),
          ]);

          if (detailRes.ok) {
            const localData = await detailRes.json();
            if (localData.success && localData.data) {
              const item = localData.data;
              const poemHtml = item.content || '';

              // Tính toán bài viết liên quan (Cùng chuyên mục ưu tiên trước, sau đó tới các chuyên mục khác)
              let computedRelated: any[] = [];
              if (allRes.ok) {
                const allData = await allRes.json();
                if (allData.success && Array.isArray(allData.data)) {
                  const others = allData.data.filter((a: any) => a.slug !== slug && a.id !== item.id);
                  const sameCat = others.filter((a: any) => a.category === item.category);
                  const diffCat = others.filter((a: any) => a.category !== item.category);
                  const combined = [...sameCat, ...diffCat];

                  computedRelated = combined.slice(0, 8).map((art: any) => ({
                    category: (art.categoryName || art.category || 'TÔNG CHỈ TU HỌC').toUpperCase(),
                    title: art.title,
                    url: art.bannerImage || '/images/toan-canh-chua.jpg',
                    link: `/tong-chi-tu-hoc/${art.slug}`,
                  }));
                }
              }

              setData({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                shortDescription: item.excerpt || '',
                heroBanner: item.bannerImage || '/images/trang-chu/z5856417756187_3b9aa0f55b1ca50d9934ff24e27fdbad.jpg',
                bannerPosition: item.bannerPosition || 'center',
                poemContent: item.content || poemHtml,
                author: item.author || 'Sa Môn Vô Trí (Thích Tâm Hòa)',
                authorLink: item.authorLink || '/gioi-thieu/su-phu-tru-tri',
                sourceBook: item.sourceBook,
                popups: (item.keywords || []).map((k: any) => ({
                  keyword: k.keyword,
                  title: k.title,
                  subtitle: k.subtitle,
                  description: cleanPopupDescription(k.description || k.summary || ''),
                  imageUrl: k.imageUrl || item.bannerImage || '/images/toan-canh-chua.jpg',
                  linkUrl: k.linkUrl || '',
                })),
                videoBlock: item.videoBlock || {
                  title: 'VIDEO PHÁP THOẠI & KỆ TỤNG TÔNG PHONG',
                  description: 'Tông phong tu học Tùng Lâm Hòa Phúc - Lắng đọng tâm tư qua từng lời kệ tiếng chuông.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                featuredArticle: item.featuredArticle || {
                  label: item.categoryName || 'TÔNG PHONG TRUYỀN THỪA',
                  title: item.title,
                  author: item.author || 'Sa Môn Vô Trí',
                  bgImage: item.bannerImage,
                  bgPosition: item.bannerPosition || 'center 50%',
                  linkUrl: `/tong-chi-tu-hoc/${item.slug}`,
                },
                photoGallery: item.photoGallery || [
                  {
                    title: 'KHÔNG GIAN TU HỌC TÙNG LÂM',
                    imageUrl: item.bannerImage || '/images/toan-canh-chua.jpg',
                    khuVuc: 'Chánh Điện',
                    noiDung: item.title,
                  },
                ],
                relatedArticles: computedRelated,
              });
              setLoading(false);
              return;
            }
          }
        } catch (localErr) {
          console.log('Local fetch failed, falling back to WP:', localErr);
        }

        // 2. Fallback to WordPress API
        const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?slug=${slug}&_embed`, { cache: 'no-store' });
        if (res.ok) {
          const posts = await res.json();

          if (Array.isArray(posts) && posts.length > 0) {
            const post = posts[0];
            const acf = post.acf || {};

          const banner = acf.banner_image?.url || acf.banner_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          const content = acf.poem_wysiwyg || post.content?.rendered || '';

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

          const defaultGallery = [
            {
              title: 'LỄ TƯỞNG NIỆM KHAI SƠN TÔNG PHONG HOẰNG PHÁP',
              imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
              khuVuc: 'Bảo tàng',
              noiDung: 'Lễ Tưởng Niệm Khai Sơn Tông Phong Hoằng Pháp',
            },
            {
              title: 'ĐẠO TRÀNG THANH THIẾU NIÊN TU HỌC',
              imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp',
              khuVuc: 'Giảng đường',
              noiDung: 'Các bạn khóa sinh tham gia khóa tu mùa hè.',
            },
          ];

          // 🔴 BÓC TÁCH & TRA CỨU ẢNH THÔNG MINH CHO POPUPS
          let parsedPopups: Array<any> = [];
          const acfRepeater = acf.danh_sach_tu_khoa || acf.popups_repeater || acf.tu_khoa_repeater;

          if (Array.isArray(acfRepeater) && acfRepeater.length > 0) {
            parsedPopups = await Promise.all(
              acfRepeater.map(async (item: any) => {
                const rawImg = item.anh_dai_dien || item.anh_popup || item.hinh_anh || item.image;
                const finalImgUrl = await resolveImageUrl(rawImg, banner);

                return {
                  keyword: item.tu_khoa_boi_dam || item.keyword || item.tu_khoa || '',
                  title: item.tieu_de_popup || item.title || item.tu_khoa_boi_dam || '',
                  description: cleanPopupDescription(item.noi_dung_giai_nghia || item.description || item.mo_ta || ''),
                  imageUrl: finalImgUrl,
                  linkUrl: item.duong_dan_xem_them || item.linkUrl || '#',
                };
              })
            );
          } else if (acf.tu_khoa_boi_dam) {
            const singleImgUrl = await resolveImageUrl(acf.anh_dai_dien || acf.anh_popup, banner);
            parsedPopups = [{
              keyword: acf.tu_khoa_boi_dam,
              title: acf.tieu_de_popup || acf.tu_khoa_boi_dam,
              description: cleanPopupDescription(acf.noi_dung_giai_nghia || ''),
              imageUrl: singleImgUrl,
              linkUrl: acf.duong_dan_xem_them || '#',
            }];
          }

          setData({
            id: post.id,
            title: post.title?.rendered || '',
            subtitle: acf.sub_title || '',
            shortDescription: cleanExcerpt,
            heroBanner: banner,
            poemContent: formatContentHtml(content),
            popups: parsedPopups,
            videoBlock: {
              title: acf.tieu_de_video || 'LỄ TƯỞNG NIỆM LẦN THỨ 33',
              description: acf.mo_ta_ngan_video || 'Thước phim tư liệu ghi lại bầu không khí trang nghiêm và lòng thành kính của hàng môn đồ đệ tử trong ngày lễ tưởng niệm Chư Tổ Sư.',
              videoUrl: acf.duong_dan_link_youtube || 'https://www.youtube.com/watch?v=sVrfy4Igykw',
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
          });
        }
      }
    } catch (err) {
        console.error('❌ Lỗi tải bài viết chi tiết:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDetailData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🛠️ XỬ LÝ CLICK TỪ KHÓA BÔI ĐẶM
  const handlePoemContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const boldEl = target.closest('strong, b');

    if (boldEl) {
      const rawText = boldEl.textContent?.trim() || '';
      if (!rawText) return;

      const cleanClickedText = rawText.replace(/[.,;:]+$/, '').trim().toLowerCase();

      const matchedPopup = data?.popups?.find((p) => {
        const popupKeyword = (p.keyword || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
        const popupTitle = (p.title || '').replace(/[.,;:]+$/, '').trim().toLowerCase();

        return (
          popupKeyword === cleanClickedText ||
          popupTitle === cleanClickedText ||
          (popupKeyword && cleanClickedText.includes(popupKeyword)) ||
          (cleanClickedText && popupKeyword.includes(cleanClickedText))
        );
      });

      if (matchedPopup) {
        setActiveKeywordPopup({
          keyword: matchedPopup.keyword || rawText,
          title: matchedPopup.title || rawText.toUpperCase(),
          description: matchedPopup.description || 'Chưa có thông tin chú thích.',
          imageUrl: matchedPopup.imageUrl || '',
          linkUrl: matchedPopup.linkUrl || '#',
        });
      } else {
        setActiveKeywordPopup({
          keyword: rawText,
          title: rawText.toUpperCase(),
          description: `Thông tin giải nghĩa chi tiết cho từ khóa "${rawText}".`,
          imageUrl: data?.heroBanner,
          linkUrl: '#',
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);

    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-130px 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [navItems]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1c11] flex items-center justify-center text-[#ffde59]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffde59] border-t-transparent rounded-full animate-spin" />
          <p className="tracking-widest uppercase text-sm font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#2c1c11] text-[#FFE5A3] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={sidebarTitle}
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={sidebarTitle}
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner bannerUrl={data?.heroBanner} bannerPosition={data?.bannerPosition} title={data?.title} subtitle={data?.subtitle} />

        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          {/* KHỐI BÀI THƠ / NỘI DUNG CHÍNH */}
          {/* KHỐI BÀI VIẾT / INFOGRAPHIC TRỰC QUAN / BÀI THƠ */}
          <section id="bai-tho" className="scroll-mt-24 relative pt-2">
            {data?.poemContent && (
              <InfographicArticleRenderer
                rawContent={data.poemContent}
                title={data.title}
                subtitle={data.subtitle}
                author={data.author}
                authorLink={data.authorLink}
                popups={data.popups}
                onKeywordClick={(kw) => {
                  const matchedPopup = data?.popups?.find((p) => {
                    const popupKeyword = (p.keyword || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
                    const popupTitle = (p.title || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
                    const cleanClickedText = kw.replace(/[.,;:]+$/, '').trim().toLowerCase();

                    return (
                      popupKeyword === cleanClickedText ||
                      popupTitle === cleanClickedText ||
                      (popupKeyword && cleanClickedText.includes(popupKeyword)) ||
                      (cleanClickedText && popupKeyword.includes(cleanClickedText))
                    );
                  });

                  if (matchedPopup) {
                    setActiveKeywordPopup({
                      keyword: matchedPopup.keyword || kw,
                      title: matchedPopup.title || kw.toUpperCase(),
                      description: matchedPopup.description || 'Chưa có thông tin chú thích.',
                      imageUrl: matchedPopup.imageUrl || '',
                      linkUrl: matchedPopup.linkUrl || '#',
                    });
                  } else {
                    setActiveKeywordPopup({
                      keyword: kw,
                      title: kw.toUpperCase(),
                      description: `Thông tin giải nghĩa chi tiết cho từ khóa "${kw}".`,
                      imageUrl: data?.heroBanner,
                      linkUrl: '#',
                    });
                  }
                }}
              />
            )}
          </section>

          {/* KHỐI TRÍCH NGUỒN TÁC PHẨM & SÁCH */}
          <BookCitationSection sourceBook={data?.sourceBook} />

          {/* CÁC KHỐI TIẾNG VIỆT */}
          <IllustrationVideo heroBanner={data?.heroBanner} videoBlock={data?.videoBlock} />
          <FeaturedPosts heroBanner={data?.heroBanner} featuredArticle={data?.featuredArticle} />
          <PhotoGallery photoGallery={data?.photoGallery} onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
          <DiscoverMore relatedArticles={data?.relatedArticles} />
          <AiQnA />
        </main>

        <DetailModal
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
    </div>
  );
}