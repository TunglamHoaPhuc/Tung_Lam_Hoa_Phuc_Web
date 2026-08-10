'use client';

import { useParams, notFound } from 'next/navigation';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { BAO_TUONG_CHINH_LIST, BaoTuongChinhItem } from '@/data/baoTuongFullData';
import { StatueDetailCoreLayout } from '@/features/statues/components/StatueDetailCoreLayout';
import { StatueItem } from '@/data/statue-data';

export default function SingleBaoTuongPage() {
  const params = useParams();
  const slug = (params.slug as string) || '';

  // Find item by slug or id
  const item: BaoTuongChinhItem | undefined = BAO_TUONG_CHINH_LIST.find(
    (s) => s.slug === slug || s.id.toLowerCase() === slug.toLowerCase()
  );

  if (!item) {
    notFound();
  }

  // Map to StatueItem format for core layout
  const statueItem: StatueItem = {
    code: item.code || item.id,
    assembly: item.assembly || item.assemblyName,
    group: item.group || item.clusterName,
    title: item.title || item.name,
    categoryType: item.categoryType || 'TƯỢNG CHÍNH',
    characterGroup: item.characterGroup || item.slug,
    areaId: item.areaId || item.areaSlug.toUpperCase().replace(/-/g, '_'),

    id: item.id,
    slug: item.slug,
    name: item.name,
    titleName: item.titleName,
    subtitle: item.subtitle,
    assemblyId: item.assemblyId,
    assemblyName: item.assemblyName,
    clusterName: item.clusterName,
    type: "TƯỢNG CHÍNH",
    clusterMembers: item.clusterMembers || [],
    areaSlug: item.areaSlug,
    areaName: item.areaName,
    areaImgUrl: item.imgUrl,
    imgUrl: item.imgUrl,
    avatarUrl: item.avatarUrl,
    quote: item.quote,
    quoteAuthor: item.quoteAuthor,
    summary: item.summary,
    fullHistoryHtml: item.fullHistoryHtml,
    video: { title: item.name, thumbnailUrl: item.imgUrl, summary: item.summary, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    article: { title: `Công Hạnh Pho Tượng ${item.name}`, author: item.quoteAuthor, bannerUrl: item.imgUrl, url: `/bao-tuong/${item.slug}` },
    artVariations: []
  };

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      <Header scrolled={true} />

      <main className="pt-20 pb-16">
        <StatueDetailCoreLayout statue={statueItem} />
      </main>

      <Footer />
    </div>
  );
}
