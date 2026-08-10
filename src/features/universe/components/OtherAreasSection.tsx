'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';

interface OtherAreasSectionProps {
  currentSlug?: string;
}

export function getShortAreaTitle(area: UniverseArea): string {
  const lower = (area.slug || '').toLowerCase();
  const nameLower = (area.name || '').toLowerCase();

  if (lower.includes('quoc-mau') || lower.includes('nha-mau') || nameLower.includes('quốc mẫu') || nameLower.includes('nhà mẫu')) {
    return 'NHÀ MẪU';
  }
  if (lower.includes('bao-tang') || nameLower.includes('bảo tàng')) {
    return 'BẢO TÀNG';
  }
  if (lower.includes('tam-bao') || nameLower.includes('tam bảo')) {
    return 'TAM BẢO';
  }
  if (lower.includes('to-duong') || nameLower.includes('tổ đường')) {
    return 'TỔ ĐƯỜNG';
  }
  if (lower.includes('giang-duong') || nameLower.includes('giảng đường')) {
    return 'GIẢNG ĐƯỜNG';
  }
  if (lower.includes('thu-vien') || nameLower.includes('thư viện')) {
    return 'THƯ VIỆN';
  }
  if (lower.includes('tu-an') || nameLower.includes('tứ ân')) {
    return 'VÃNG SINH ĐƯỜNG';
  }

  return area.name.toUpperCase();
}

interface OtherAreaCardProps {
  area: UniverseArea;
}

const OtherAreaCard = React.memo(({ area }: OtherAreaCardProps) => {
  const shortTitle = getShortAreaTitle(area);

  return (
    <Link
      href={`/vu-tru-phat-giao/${area.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-[#e5a93b]/40 bg-[#25170e] hover:border-[#ffde59] transition-all duration-300 shadow-2xl flex flex-col cursor-pointer"
    >
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-[#1a120b] shrink-0">
        <img
          src={area.imgUrl}
          alt={shortTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(37,23,14,0.7) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="w-full bg-[#7a5127] group-hover:bg-[#8c5d2d] transition-colors duration-300 border-t border-[#e5a93b]/60 py-4 px-4 text-center flex items-center justify-center shrink-0">
        <h3
          style={{ fontFamily: "'UTM Niagara', serif" }}
          className="text-2xl sm:text-3xl md:text-4xl text-[#ffde59] font-normal uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-105 group-hover:text-white"
        >
          <span className="inline-block whitespace-nowrap">{shortTitle}</span>
        </h3>
      </div>
    </Link>
  );
});

OtherAreaCard.displayName = "OtherAreaCard";

export const OtherAreasSection: FC<OtherAreasSectionProps> = ({
  currentSlug = 'tam-bao',
}) => {
  let otherAreas = UNIVERSE_AREAS.filter(
    (a) => a.temple === 'tung-lam-hoa-phuc' && a.slug !== currentSlug
  );

  if (currentSlug === 'tam-bao') {
    const nhaMau = UNIVERSE_AREAS.find((a) => a.slug === 'dai-nam-quoc-mau');
    const baoTang = UNIVERSE_AREAS.find(
      (a) => a.slug === 'bao-tang-phat-giao-va-tuong-dai-nguyet-tri-quan-am'
    );
    const rest = otherAreas.filter(
      (a) =>
        a.slug !== 'dai-nam-quoc-mau' &&
        a.slug !== 'bao-tang-phat-giao-va-tuong-dai-nguyet-tri-quan-am'
    );

    const ordered: UniverseArea[] = [];
    if (nhaMau) ordered.push(nhaMau);
    if (baoTang) ordered.push(baoTang);
    otherAreas = [...ordered, ...rest];
  }

  const displayAreas = otherAreas.slice(0, 2);

  if (displayAreas.length === 0) return null;

  return (
    <section id="khu-vuc-khac" className="w-full scroll-mt-24 py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-10 h-10 mb-3 flex items-center justify-center" aria-hidden="true">
          <img
            src="/images/bieu-tuong-tuong-phap.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(242,193,78,0.9)]"
          />
        </div>

        <div className="flex items-center justify-center w-full gap-0">
          <div className="flex-1 flex items-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
          </div>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8"
          >
            KHÁM PHÁ KHU VỰC KHÁC
          </h2>

          <div className="flex-1 flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto px-2">
        {displayAreas.map((area) => (
          <OtherAreaCard key={area.slug} area={area} />
        ))}
      </div>
    </section>
  );
};
