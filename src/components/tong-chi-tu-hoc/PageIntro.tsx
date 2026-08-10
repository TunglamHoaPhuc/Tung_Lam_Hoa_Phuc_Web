'use client';

import React from 'react';

interface PageIntroProps {
  description?: string;
}

export function PageIntro({ description }: PageIntroProps) {
  if (!description) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 my-8">
      <div
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="
          text-base sm:text-lg md:text-xl text-[#ffde59] 
          leading-relaxed md:leading-loose tracking-wide 
          space-y-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
          
          /* Căn đều 2 bên cho tất cả các đoạn văn */
          [&>p]:text-justify 
          [&>p]:mb-4 
          [&>p]:leading-relaxed md:[&>p]:leading-loose
          
          /* Thụt đầu dòng từ đoạn thứ 2 trở đi */
          [&>p:nth-of-type(n+2)]:indent-6 md:[&>p:nth-of-type(n+2)]:indent-8

          /* STYLES RIÊNG CHO CHỮ DROP CAP (CHỮ ĐẦU TIÊN) */
          [&>p:first-of-type::first-letter]:float-left
          [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
          [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl
          [&>p:first-of-type::first-letter]:font-bold
          [&>p:first-of-type::first-letter]:text-[#ffde59]
          [&>p:first-of-type::first-letter]:mr-3.5
          [&>p:first-of-type::first-letter]:mb-1
          [&>p:first-of-type::first-letter]:pb-1.5
          [&>p:first-of-type::first-letter]:border-b-2
          [&>p:first-of-type::first-letter]:border-[#ffde59]
          [&>p:first-of-type::first-letter]:leading-none

          /* Tối ưu hiển thị cho danh sách bullet nếu có */
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
          [&_li]:text-justify [&_li]:pl-1
        "
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </section>
  );
}

export default PageIntro;
