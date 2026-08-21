'use client';

import { useParams, notFound } from 'next/navigation';
import { STATUE_LIST, OFFICIAL_STATUE_DATASET } from '@/data/statue-data';
import { BAO_TUONG_CHINH_LIST, BaoTuongChinhItem } from '@/data/baoTuongFullData';
import { StatueDetailCoreLayout } from '@/features/statues/components/StatueDetailCoreLayout';

export default function StatueDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';

  // 1. Search in official statue datasets
  const statue =
    STATUE_LIST.find((s) => s.slug === slug || s.id.toLowerCase() === slug.toLowerCase() || s.code?.toLowerCase() === slug.toLowerCase()) ||
    OFFICIAL_STATUE_DATASET.find((s) => s.slug === slug || s.id.toLowerCase() === slug.toLowerCase() || s.code?.toLowerCase() === slug.toLowerCase());

  if (statue) {
    return <StatueDetailCoreLayout statue={statue} />;
  }

  // 2. Fallback to BAO_TUONG_CHINH_LIST
  const item: BaoTuongChinhItem | undefined = BAO_TUONG_CHINH_LIST.find(
    (s) => s.slug === slug || s.id.toLowerCase() === slug.toLowerCase() || s.code?.toLowerCase() === slug.toLowerCase()
  );

  if (!item) {
    notFound();
  }

  const mappedStatue = {
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
    hasSinglePage: true,
    clusterMembers: item.clusterMembers || [],
    areaSlug: item.areaSlug,
    areaName: item.areaName,
    location: item.location,
    areaImgUrl: (item as any).areaImgUrl || item.imgUrl,
    imgUrl: item.imgUrl,
    avatarUrl: item.avatarUrl,
    quoteAuthor: item.quoteAuthor || "VÔ TRÍ - TÂM HÒA",
    quote: item.quote,
    summary: item.summary,
    fullHistoryHtml: item.fullHistoryHtml,
  };

  return <StatueDetailCoreLayout statue={mappedStatue} />;
}
