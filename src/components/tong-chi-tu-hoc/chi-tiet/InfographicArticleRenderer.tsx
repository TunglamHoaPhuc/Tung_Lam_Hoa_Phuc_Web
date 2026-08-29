'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  ArrowRight,
  Quote,
  Flame,
  Layers,
  Leaf,
  Compass,
  Image as ImageIcon,
  ZoomIn,
  X
} from 'lucide-react';

interface PopupKeyword {
  keyword: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
  linkUrl?: string;
}

interface InfographicRendererProps {
  rawContent: string;
  title: string;
  subtitle?: string;
  author?: string;
  authorLink?: string;
  popups?: PopupKeyword[];
  onKeywordClick?: (keyword: string) => void;
}

// 🪷 Helper: Chuyển đổi tiêu đề thành anchor ID không dấu
function toSectionId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 🪷 Helper: Kiểm tra xem một đoạn văn bản có phải là khổ thơ không
function isPoemStanza(text: string): boolean {
  if (!text) return false;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return false;
  return lines.every((l) => l.length < 95 && !/^\s*(?:[-*•]|\d+[.)]|###?)\s+/.test(l));
}

// 🪷 Helper: Format inline text (Bold, Italic, Underline, Keywords) tuân thủ trực tiếp theo khung soạn thảo
function highlightText(
  text: string,
  popups: PopupKeyword[] = [],
  onKeywordClick: (kw: string) => void
): React.ReactNode {
  if (!text) return '';
  // Quét và chuẩn hóa dấu gạch dài — và – thành -
  let normalized = text.replace(/[—–]/g, '-');

  // 1. Gộp và làm sạch các thẻ lồng nhau liên tiếp (ví dụ <b><b><b>...</b></b></b> -> <b>...</b>)
  normalized = normalized
    .replace(/(?:<b[^>]*>|<strong[^>]*>)+/gi, '<b>')
    .replace(/(?:<\/b>|<\/strong>)+/gi, '</b>')
    .replace(/(?:<i[^>]*>|<em[^>]*>)+/gi, '<i>')
    .replace(/(?:<\/i>|<\/em>)+/gi, '</i>')
    .replace(/(?:<u[^>]*>)+/gi, '<u>')
    .replace(/(?:<\/u>)+/gi, '</u>')
    .replace(/<b>\s*<\/b>/gi, '')
    .replace(/<i>\s*<\/i>/gi, '')
    .replace(/<u>\s*<\/u>/gi, '');

  // 2. Chuyển đổi cú pháp markdown sang thẻ HTML chuẩn
  normalized = normalized
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<i>$1</i>');

  // Lọc lại một lần nữa để tránh thẻ trùng lặp
  normalized = normalized
    .replace(/(?:<b[^>]*>)+/gi, '<b>')
    .replace(/(?:<\/b>)+/gi, '</b>')
    .replace(/(?:<i[^>]*>)+/gi, '<i>')
    .replace(/(?:<\/i>)+/gi, '</i>');

  // Split text by tags: <b>...</b>, <i>...</i>, <u>...</u>
  const parts = normalized.split(/(<b>[\s\S]*?<\/b>|<i>[\s\S]*?<\/i>|<u>[\s\S]*?<\/u>)/gi);

  return parts.map((part, pIdx) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      const inner = part.slice(3, -4).replace(/<\/?b>/gi, '');
      return (
        <strong key={pIdx} className="font-bold text-[#FFDE59] drop-shadow-sm">
          {renderKeywordPopups(inner, popups, onKeywordClick, true)}
        </strong>
      );
    }
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      const inner = part.slice(3, -4).replace(/<\/?i>/gi, '');
      return (
        <em key={pIdx} className="italic text-[#FFE5A3]">
          {renderKeywordPopups(inner, popups, onKeywordClick, false)}
        </em>
      );
    }
    if (part.startsWith('<u>') && part.endsWith('</u>')) {
      const inner = part.slice(3, -4).replace(/<\/?u>/gi, '');
      return (
        <u key={pIdx} className="underline decoration-[#F2C14E]/70 underline-offset-2 text-[#FFE5A3]">
          {renderKeywordPopups(inner, popups, onKeywordClick, false)}
        </u>
      );
    }
    // Loại bỏ mọi thẻ đóng/mở mồ côi nếu có để không bao giờ in thẻ thô ra giao diện
    const cleanPart = part.replace(/<\/?(?:b|strong|i|em|u)>/gi, '');
    return <React.Fragment key={pIdx}>{renderKeywordPopups(cleanPart, popups, onKeywordClick, false)}</React.Fragment>;
  });
}

// 🪷 Gắn sự kiện chú thích cho từ khóa — tự động in đậm ánh vàng kim nổi bật
function renderKeywordPopups(
  str: string,
  popups: PopupKeyword[] = [],
  onKeywordClick: (kw: string) => void,
  isInsideBold: boolean = false
): React.ReactNode {
  if (!str) return '';
  if (popups.length === 0) return str;

  const sorted = [...popups].sort((a, b) => (b.keyword?.length || 0) - (a.keyword?.length || 0));
  const regexPattern = sorted
    .map((p) => (p.keyword || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean)
    .join('|');

  if (!regexPattern) return str;

  const regex = new RegExp(`(${regexPattern})`, 'gi');
  const tokens = str.split(regex);

  return tokens.map((token, i) => {
    const match = popups.find((p) => p.keyword.toLowerCase() === token.toLowerCase());
    if (match) {
      return (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onKeywordClick(match.keyword);
          }}
          className={`cursor-pointer transition-all inline-block mx-0.5 align-baseline font-bold text-[#FFDE59] border-b border-[#F2C14E]/70 hover:border-[#FFDE59] hover:text-white pb-[1px] ${
            isInsideBold ? 'drop-shadow-md' : 'drop-shadow-sm'
          }`}
          title={`Bấm để xem chú thích: ${match.title || match.keyword}`}
        >
          {token}
        </span>
      );
    }
    return token;
  });
}

// 🪷 4 Cards Pillar Component (Ham học hỏi, Siêng năng, Giữ gìn giới hạnh, Sẵn lòng phụng sự)
function FourPillarsGrid() {
  const cards = [
    {
      icon: '🌱',
      title: 'Ham học hỏi giáo pháp',
      desc: 'Không ngừng mở rộng hiểu biết để đi đúng con đường tu học.',
    },
    {
      icon: '🙏',
      title: 'Siêng năng hành trì',
      desc: 'Kiên trì chuyển hóa thân tâm trong từng thời khóa tu tập.',
    },
    {
      icon: '🛡',
      title: 'Giữ gìn giới hạnh',
      desc: 'Tinh cần bảo hộ thân, khẩu, ý bằng đời sống chánh niệm và trách nhiệm.',
    },
    {
      icon: '❤️',
      title: 'Sẵn lòng phụng sự',
      desc: 'Lan tỏa những điều tốt đẹp đã chuyển hóa đến với mọi người.',
    },
  ];

  return (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#27180E] to-[#1C120A] border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all hover:scale-[1.01] shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-2xl">{c.icon}</span>
              <h5
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-base font-bold text-[#FFE5A3] group-hover:text-[#ffde59] transition-colors"
              >
                {c.title}
              </h5>
            </div>
            <div className="w-8 h-0.5 bg-[#F2C14E]/40 mb-3 group-hover:w-16 transition-all" />
            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs sm:text-sm text-[#FFE5A3]/90 leading-relaxed"
            >
              {c.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 🪷 4 Category Drawers (Nền tảng, Phương pháp, Lộ trình, Nếp sống)
function FourDrawersSection() {
  const drawers = [
    {
      icon: '🌿',
      title: 'Nền tảng tu học',
      subtitle: 'Những nền tảng song hành cùng Bồ Đề tâm',
      link: '/tong-chi-tu-hoc#nen-tang-tu-hoc',
      items: ['Tam Quy - Ngũ Giới', 'Thập Thiện', 'Bồ Tát Hạnh'],
    },
    {
      icon: '🙏',
      title: 'Phương pháp hành trì',
      subtitle: 'Thực tập mỗi ngày với những cách thức tu tập',
      link: '/tong-chi-tu-hoc#phuong-phap-hanh-tri',
      items: ['Niệm Phật', 'Thiền tập', 'Nghe pháp...'],
    },
    {
      icon: '🌱',
      title: 'Lộ trình tu học',
      subtitle: 'Lựa chọn lộ trình phù hợp với hoàn cảnh tu học',
      link: '/tong-chi-tu-hoc#lo-trinh-tu-hoc',
      items: ['Lộ trình người mới', 'Lộ trình người trẻ', 'Lộ trình người bận rộn'],
    },
    {
      icon: '🌸',
      title: 'Nếp sống Thiền gia',
      subtitle: 'Đưa lời Phật dạy vào từng cách sống, lời nói và việc làm',
      link: '/tong-chi-tu-hoc#nep-song-thien-gia',
      items: ['Văn hóa ứng xử tại chùa', 'Oai nghi người con Phật', 'Bổn phận tại gia...'],
    },
  ];

  return (
    <div className="my-10 space-y-4">
      <div className="text-center mb-6">
        <h4
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="text-lg sm:text-xl font-bold text-[#F2C14E] uppercase tracking-wider"
        >
          HỆ THỐNG TÔNG CHỈ TU HỌC TIẾP NỐI
        </h4>
        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {drawers.map((d, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#22140A] border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{d.icon}</span>
                <h5
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-base font-bold text-[#FFE5A3] group-hover:text-[#ffde59] transition-colors"
                >
                  {d.title}
                </h5>
              </div>
              <p className="text-xs text-[#FFE5A3]/80 italic mb-3">
                {d.subtitle}
              </p>
              <ul className="space-y-1 text-xs text-[#FFE5A3]/85 mb-4">
                {d.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-[#F2C14E] text-[10px]">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={d.link}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] hover:text-[#ffde59] group-hover:translate-x-1 transition-all pt-2 border-t border-[#F2C14E]/20"
            >
              <span>Khám phá chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🪷 Block Parser Data Structure
type SectionElement =
  | { type: 'paragraph'; text: string }
  | { type: 'poem'; stanzas: string[] }
  | { type: 'quote'; quote: string; quoteAuthor?: string }
  | { type: 'image'; src: string; caption?: string; alt?: string; align?: 'center' | 'left' | 'right' };

type SectionBlock = {
  heading: string;
  sectionId: string;
  quote?: string;
  quoteAuthor?: string;
  elements: SectionElement[];
  hasFourPillars?: boolean;
  hasFourDrawers?: boolean;
};

function parseSections(raw: string): { sections: SectionBlock[]; endQuote?: { text: string; author?: string } } {
  if (!raw) return { sections: [] };

  // Convert HTML linebreaks to newlines if HTML was passed
  let text = raw
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/?(?:div|p|section|article|header|footer)[^>]*>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/[—–]/g, '-')
    .trim();

  // Clean raw content by removing banner header lines
  const cleaned = text
    .replace(/^BANNER[\s\S]*?\.jpg\s*/im, '')
    .replace(/BANNER,\s*TIÊU ĐỀ,\s*GIỚI THIỆU/gi, '')
    .trim();

  const lines = cleaned.split('\n');
  const sections: SectionBlock[] = [];
  let currentSection: SectionBlock | null = null;
  let endQuoteData: { text: string; author?: string } | undefined = undefined;

  let i = 0;
  while (i < lines.length) {
    let line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Stop at Reference section (handled by footer component)
    if (/^TÀI LIỆU THAM KHẢO/i.test(line)) {
      break;
    }

    // End Quote section
    if (/^QUOTE CUỐI TRANG/i.test(line) || (line.includes('“Bạn nên hiểu') && line.includes('bình an là sự thực tập'))) {
      i++;
      const qLines: string[] = [];
      if (line.includes('“Bạn nên hiểu')) {
        qLines.push(line);
      }
      let authorName = 'Vô Trí - Tâm Hòa';
      while (i < lines.length && !/^TÀI LIỆU THAM KHẢO/i.test(lines[i].trim())) {
        const nextL = lines[i].trim();
        if (nextL) {
          if (/^(Vô Trí|Thích Tâm Hòa|Sa Môn)/i.test(nextL)) {
            authorName = nextL;
          } else {
            qLines.push(nextL);
          }
        }
        i++;
      }
      endQuoteData = { text: qLines.join('\n'), author: authorName };
      continue;
    }

    // Check if line is an Image (Markdown, HTML img, or Bracket tag)
    const mdImgMatch = line.match(/^!\[(.*?)\]\((.*?)\)/);
    const htmlImgMatch = line.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']?([^"'>]*)["']?/i) || line.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
    const bracketImgMatch = line.match(/^\[(?:ẢNH|HÌNH|ANH|IMAGE):\s*([^\s\]|]+)(?:\|([^\]]+))?\]/i);

    if (mdImgMatch || htmlImgMatch || bracketImgMatch) {
      let src = '';
      let caption = '';
      let align: 'center' | 'left' | 'right' = 'center';

      if (mdImgMatch) {
        let rawCap = mdImgMatch[1]?.trim() || '';
        src = mdImgMatch[2]?.trim() || '';
        if (rawCap.startsWith('left:')) {
          align = 'left';
          caption = rawCap.replace(/^left:\s*/, '');
        } else if (rawCap.startsWith('right:')) {
          align = 'right';
          caption = rawCap.replace(/^right:\s*/, '');
        } else if (rawCap.startsWith('center:')) {
          align = 'center';
          caption = rawCap.replace(/^center:\s*/, '');
        } else {
          caption = rawCap;
        }
      } else if (htmlImgMatch) {
        src = htmlImgMatch[1]?.trim() || '';
        caption = htmlImgMatch[2]?.trim() || '';
      } else if (bracketImgMatch) {
        src = bracketImgMatch[1]?.trim() || '';
        const params = bracketImgMatch[2] || '';
        if (params.includes('align=left')) align = 'left';
        if (params.includes('align=right')) align = 'right';
        const capMatch = params.match(/caption=([^|]+)/);
        if (capMatch) caption = capMatch[1].trim();
        else if (params && !params.includes('=')) caption = params.trim();
      }

      if (src) {
        if (!currentSection) {
          currentSection = {
            heading: '',
            sectionId: 'intro',
            elements: [],
          };
        }
        currentSection.elements.push({
          type: 'image',
          src,
          caption,
          alt: caption || 'Hình ảnh minh họa',
          align,
        });
        i++;
        continue;
      }
    }

    // Check if line is a Section Heading (Markdown #, ##, ###, #### or uppercase heading)
    const isMdHeading = /^#{1,4}\s+/.test(line);
    const isHeading =
      isMdHeading ||
      ((line.startsWith('BỒ ĐỀ TÂM') ||
        line.startsWith('SỐNG VỚI') ||
        line.startsWith('ĐỂ BỒ ĐỀ TÂM') ||
        line.startsWith('TAM QUY') ||
        line.startsWith('NGŨ GIỚI') ||
        (line === line.toUpperCase() && !line.startsWith('>') && !line.startsWith('!['))) &&
      line.length < 80 &&
      !line.includes('“') &&
      !line.includes('”') &&
      !line.startsWith('📘') &&
      !line.startsWith('VIDEO:'));

    if (isHeading) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const cleanHeading = line.replace(/^#{1,4}\s+/, '').trim();
      currentSection = {
        heading: cleanHeading,
        sectionId: toSectionId(cleanHeading),
        elements: [],
      };
      i++;
      continue;
    }

    // Check if line is Quote / Kệ trích dẫn (Chỉ kích hoạt khi có ký tự > rõ ràng)
    const isQuoteExplicit =
      line.startsWith('>') ||
      line.startsWith('&gt;') ||
      /^Quote:\s*/i.test(line);

    if (isQuoteExplicit) {
      let cleanFirstLine = line
        .replace(/^(?:>|&gt;|Quote:)\s*/i, '')
        .replace(/^[“"”]{1,3}|[“"”]{1,3}$/g, '')
        .trim();
      const qLines = cleanFirstLine ? [cleanFirstLine] : [];
      let quoteAuthor = '';
      i++;
      while (i < lines.length) {
        const nextL = lines[i].trim();
        if (!nextL) {
          // Lookahead: kiểm tra xem dòng không trống tiếp theo có phải là dòng tác giả hoặc tiếp tục quote không
          let peekIdx = i + 1;
          while (peekIdx < lines.length && !lines[peekIdx].trim()) {
            peekIdx++;
          }
          if (peekIdx < lines.length) {
            const peekL = lines[peekIdx].trim();
            if (peekL.startsWith('>') || peekL.startsWith('&gt;')) {
              i = peekIdx;
              continue;
            }
            if (/^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(peekL)) {
              quoteAuthor = peekL.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
              i = peekIdx + 1;
              break;
            }
          }
          i++;
          break;
        }

        if (/^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(nextL)) {
          quoteAuthor = nextL.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
          i++;
          break;
        }

        if (
          nextL.startsWith('>') ||
          nextL.startsWith('&gt;')
        ) {
          const cleanL = nextL
            .replace(/^(?:>|&gt;|Quote:)\s*/i, '')
            .replace(/^[“"”]{1,3}|[“"”]{1,3}$/g, '')
            .trim();
          if (cleanL) {
            if (/^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(cleanL)) {
              quoteAuthor = cleanL.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
            } else {
              qLines.push(cleanL);
            }
          }
          i++;
          continue;
        }

        if (
          /^#{1,4}\s+/.test(nextL) ||
          nextL.startsWith('“““') ||
          nextL.startsWith('"""') ||
          /^!\[/.test(nextL) ||
          /^<img/i.test(nextL) ||
          /^(Infographic|Hình tam giác|4 card|4 Ngăn kéo|Ngăn kéo card|QUOTE CUỐI|TÀI LIỆU)/i.test(nextL)
        ) {
          break;
        }

        // Multiline quote continuation
        const cleanContent = nextL.replace(/^[“"”]{1,3}|[“"”]{1,3}$/g, '').trim();
        if (/^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(cleanContent)) {
          quoteAuthor = cleanContent.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
          i++;
          break;
        }

        qLines.push(cleanContent);
        if (nextL.includes('”') || nextL.endsWith('"') || nextL.endsWith('”') || nextL.endsWith('”.')) {
          let peekIdx = i + 1;
          while (peekIdx < lines.length && !lines[peekIdx].trim()) {
            peekIdx++;
          }
          if (peekIdx < lines.length && /^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(lines[peekIdx].trim())) {
            quoteAuthor = lines[peekIdx].trim().replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
            i = peekIdx + 1;
          } else {
            i++;
          }
          break;
        }
        i++;
      }

      // Check if last collected line in qLines is an author line
      if (qLines.length > 0) {
        const lastL = qLines[qLines.length - 1];
        if (/^(?:—|–|-|~|\*|_|<i>|<em|)(?:Tác giả[:\s-]*|Sa Môn|Vô Trí|Thích Tâm Hòa|Tâm Hòa)/i.test(lastL)) {
          quoteAuthor = lastL.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
          qLines.pop();
        }
      }

      if (qLines.length > 0) {
        if (!currentSection) {
          currentSection = {
            heading: '',
            sectionId: 'intro',
            elements: [],
          };
        }
        if (!currentSection.quote) {
          currentSection.quote = qLines.join('\n');
          if (quoteAuthor) currentSection.quoteAuthor = quoteAuthor;
        } else {
          currentSection.elements.push({
            type: 'quote',
            quote: qLines.join('\n'),
            quoteAuthor: quoteAuthor || undefined,
          });
        }
      }
      continue;
    }

    // Check for Infographics triggers
    if (/4\s*card/i.test(line) || line.includes('🌱 Ham học hỏi giáo pháp')) {
      if (currentSection) currentSection.hasFourPillars = true;
      i++;
      while (i < lines.length) {
        const nextL = lines[i].trim();
        if (/^(ĐỂ BỒ ĐỀ TÂM|SỐNG VỚI|4 Ngăn kéo|Ngăn kéo card|QUOTE CUỐI|TÀI LIỆU)/i.test(nextL)) {
          break;
        }
        i++;
      }
      continue;
    }

    if (/Ngăn kéo card/i.test(line) || (line.includes('🌿 Nền tảng tu học') && line.includes('Những nền tảng'))) {
      if (currentSection) currentSection.hasFourDrawers = true;
      i++;
      while (i < lines.length) {
        const nextL = lines[i].trim();
        if (/^(QUOTE CUỐI|TÀI LIỆU)/i.test(nextL) || (nextL.includes('“Bạn nên hiểu') && nextL.includes('bình an là sự thực tập'))) {
          break;
        }
        i++;
      }
      continue;
    }

    // Skip isolated Infographic diagram text if it exists
    if (/^(Infographic|Hình tam giác)/i.test(line) || (line.includes('Sức mạnh') && line.includes('BỒ ĐỀ TÂM'))) {
      i++;
      while (i < lines.length) {
        const nextL = lines[i].trim();
        if (/^(BỒ ĐỀ TÂM|SỐNG VỚI|ĐỂ BỒ ĐỀ TÂM|TAM QUY|NGŨ GIỚI|!\[)/i.test(nextL)) {
          break;
        }
        i++;
      }
      continue;
    }

    // Gán tác giả cho quote trước đó nếu gặp dòng tên tác giả
    if (/^(?:\*|_|<i>|<em|)(?:Tác giả[:\s-]*|)(Vô Trí\s*-\s*Tâm Hòa|Thích Tâm Hòa|Sa Môn Vô Trí|Tâm Hòa)(?:\*|_|<\/i>|<\/em>|\s)*$/i.test(line)) {
      const auth = line.replace(/^(?:—|–|-|~|\*|_|<i>|<em|Tác giả[:\s-]*)+/i, '').replace(/(?:\*|_|<\/i>|<\/em>|\s)+$/i, '').trim();
      if (currentSection) {
        if (currentSection.quote && !currentSection.quoteAuthor) {
          currentSection.quoteAuthor = auth;
        } else if (currentSection.elements.length > 0) {
          const lastEl = currentSection.elements[currentSection.elements.length - 1];
          if (lastEl.type === 'quote' && !lastEl.quoteAuthor) {
            lastEl.quoteAuthor = auth;
          }
        }
      }
      i++;
      continue;
    }

    // 🪷 Thu thập các dòng văn bản tiếp theo
    const pLines = [line];
    i++;
    while (i < lines.length) {
      const nextL = lines[i].trim();
      if (!nextL) {
        // Gặp dòng trống -> dừng đoạn hiện tại
        i++;
        break;
      }
      if (
        nextL.startsWith('>') ||
        nextL.startsWith('&gt;') ||
        /^#{1,4}\s+/.test(nextL) ||
        nextL.startsWith('“““') ||
        nextL.startsWith('"""') ||
        /^Typography\s*lớn:/i.test(nextL) ||
        /^Quote:/i.test(nextL) ||
        /^!\[/.test(nextL) ||
        /^<img/i.test(nextL) ||
        /^\[(?:ẢNH|HÌNH|ANH|IMAGE):/i.test(nextL) ||
        /^(Infographic|Hình tam giác|4 card|4 Ngăn kéo|Ngăn kéo card|QUOTE CUỐI|TÀI LIỆU)/i.test(nextL) ||
        ((nextL.startsWith('BỒ ĐỀ TÂM') || nextL.startsWith('SỐNG VỚI') || nextL.startsWith('ĐỂ BỒ ĐỀ TÂM')) && nextL.length < 80)
      ) {
        break;
      }
      if (/^(?:\*|_|<i>|<em|)(?:Tác giả[:\s]*|)(Vô Trí\s*-\s*Tâm Hòa|Thích Tâm Hòa|Sa Môn Vô Trí|Tâm Hòa)(?:\*|_|<\/i>|<\/em>|\s)*$/i.test(nextL)) {
        i++;
        break;
      }
      pLines.push(nextL);
      i++;
    }

    // Lọc bỏ dòng tác giả nếu lọt vào pLines
    const filteredPLines = pLines.filter((pl) => !/^(?:\*|_|<i>|<em|)(?:Tác giả[:\s]*|)(Vô Trí\s*-\s*Tâm Hòa|Thích Tâm Hòa|Sa Môn Vô Trí|Tâm Hòa)(?:\*|_|<\/i>|<\/em>|\s)*$/i.test(pl.trim()));
    if (filteredPLines.length === 0) {
      continue;
    }

    // Kiểm tra xem đoạn này có phải là Thơ (Poem) không
    const joinedText = filteredPLines.join('\n');
    const isPoem = isPoemStanza(joinedText);

    if (!currentSection) {
      currentSection = {
        heading: '',
        sectionId: 'intro',
        elements: [],
      };
    }

    if (isPoem) {
      // Tách các khổ thơ nếu có
      currentSection.elements.push({
        type: 'poem',
        stanzas: [joinedText],
      });
    } else {
      currentSection.elements.push({
        type: 'paragraph',
        text: joinedText,
      });
    }
  }

  if (currentSection) {
    // Tối ưu gộp các khối thơ liên tiếp thành một bài thơ hoàn chỉnh
    const mergedElements: SectionElement[] = [];
    let currentPoemStanzas: string[] = [];

    for (const el of currentSection.elements) {
      if (el.type === 'poem') {
        currentPoemStanzas.push(...el.stanzas);
      } else {
        if (currentPoemStanzas.length > 0) {
          mergedElements.push({ type: 'poem', stanzas: currentPoemStanzas });
          currentPoemStanzas = [];
        }
        mergedElements.push(el);
      }
    }
    if (currentPoemStanzas.length > 0) {
      mergedElements.push({ type: 'poem', stanzas: currentPoemStanzas });
    }
    currentSection.elements = mergedElements;
    sections.push(currentSection);
  }

  return { sections, endQuote: endQuoteData };
}

export function InfographicArticleRenderer({
  rawContent,
  title,
  subtitle,
  author,
  authorLink,
  popups = [],
  onKeywordClick = () => {},
}: InfographicRendererProps) {
  const [zoomImage, setZoomImage] = useState<{ src: string; caption?: string } | null>(null);

  if (!rawContent) return null;

  const { sections, endQuote } = parseSections(rawContent);

  return (
    <div
      style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
      className="space-y-8 max-w-3xl mx-auto text-left"
    >
      {sections.map((sec, idx) => (
        <section
          key={idx}
          id={sec.sectionId}
          className="scroll-mt-28 relative pt-2"
        >
          {/* 1. SECTION HEADING (UTM NIAGARA / PLAYFAIR DISPLAY MÀU VÀNG HOÀNG KIM) */}
          {sec.heading && (
            <div className="text-center pt-2 pb-1">
              <h3
                style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFDE59] tracking-wider uppercase drop-shadow-md"
              >
                {sec.heading}
              </h3>
              {/* Nét gạch gradient 2 bên nhẹ nhàng màu vàng */}
              <div className="w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent mx-auto mt-3 mb-6" />
            </div>
          )}

          {/* 2. QUOTE / KỆ THƠ / LỜI THẦY */}
          {sec.quote && (
            <div className="my-6 max-w-2xl mx-auto text-center space-y-2 p-5 sm:p-6 rounded-2xl bg-[#22130A]/60 border-l-4 border-[#F2C14E] shadow-md">
              <div 
                style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
                className="text-base sm:text-lg md:text-xl font-semibold italic text-[#FFE5A3] leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide"
              >
                “{highlightText(sec.quote.replace(/^[“"”\s]+|[“"”\s]+$/g, ''), popups, onKeywordClick)}”
              </div>
              {sec.quoteAuthor && (
                <p className="text-sm sm:text-base italic text-[#F2C14E] mt-2 font-normal">
                  — {sec.quoteAuthor}
                </p>
              )}
            </div>
          )}

          {/* 3. PARAGRAPHS, POEMS & INLINE IMAGES */}
          <div className="space-y-6 my-6 clearfix">
            {sec.elements.map((el, elIdx) => {
              if (el.type === 'quote') {
                return (
                  <div key={elIdx} className="my-6 max-w-2xl mx-auto text-center space-y-2 p-5 sm:p-6 rounded-2xl bg-[#22130A]/60 border-l-4 border-[#F2C14E] shadow-md">
                    <div 
                      style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
                      className="text-base sm:text-lg md:text-xl font-semibold italic text-[#FFE5A3] leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide"
                    >
                      “{highlightText(el.quote.replace(/^[“"”\s]+|[“"”\s]+$/g, ''), popups, onKeywordClick)}”
                    </div>
                    {el.quoteAuthor && (
                      <p className="text-sm sm:text-base italic text-[#F2C14E] mt-2 font-normal">
                        — {el.quoteAuthor}
                      </p>
                    )}
                  </div>
                );
              }

              if (el.type === 'image') {
                return (
                  <div key={elIdx} className="my-8 text-center w-full max-w-2xl mx-auto select-none">
                    <div 
                      onClick={() => setZoomImage({ src: el.src, caption: el.caption })}
                      className="rounded-2xl overflow-hidden border-2 border-[#F2C14E]/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] bg-black/40 group p-1 backdrop-blur-sm cursor-zoom-in relative inline-block max-w-full"
                    >
                      <img
                        src={el.src}
                        alt={el.alt || el.caption || 'Hình ảnh minh họa'}
                        className="w-full max-h-[650px] h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/75 text-[#F2C14E] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Phóng to</span>
                      </div>
                    </div>
                    {el.caption && (
                      <p className="mt-2.5 text-xs sm:text-sm italic text-[#FFE5A3]/90 leading-relaxed text-center max-w-xl mx-auto">
                        ({el.caption})
                      </p>
                    )}
                  </div>
                );
              }

              // 🪷 RENDER THỂ THƠ (HIỂN THỊ TRỰC TIẾP TRÊN NỀN BÌNH THƯỜNG, CĂN GIỮA, KHÔNG ĐỂ TRONG KHUNG)
              if (el.type === 'poem') {
                return (
                  <div key={elIdx} className="my-8 max-w-2xl mx-auto text-center select-text">
                    {/* Danh sách các khổ thơ */}
                    <div className="space-y-6 sm:space-y-8">
                      {el.stanzas.map((stanza, sIdx) => (
                        <div key={sIdx} className="space-y-2 sm:space-y-3">
                          {stanza.split('\n').map((line, lIdx) => (
                            <p
                              key={lIdx}
                              style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
                              className="text-lg sm:text-xl md:text-2xl not-italic font-medium text-[#FFE5A3] leading-loose md:leading-[2.6rem] tracking-wide drop-shadow-sm text-center"
                            >
                              {highlightText(line, popups, onKeywordClick)}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 🪷 RENDER ĐOẠN VĂN XUÔI CHỮ MÀU VÀNG HOÀNG KIM
              return (
                <p
                  key={elIdx}
                  style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
                  className="text-base sm:text-lg text-[#FFE5A3] leading-relaxed md:leading-loose text-left sm:text-justify [text-align-last:left] tracking-wide whitespace-pre-line indent-8 sm:indent-10"
                >
                  {highlightText(el.text, popups, onKeywordClick)}
                </p>
              );
            })}
          </div>

          {/* 4. INFOGRAPHIC 4 CARDS IF APPLICABLE */}
          {sec.hasFourPillars && <FourPillarsGrid />}

          {/* 5. 4 DRAWERS IF APPLICABLE */}
          {sec.hasFourDrawers && <FourDrawersSection />}

          {/* 6. ĐƯỜNG GRADIENT DÀI PHÂN ĐOẠN */}
          {idx < sections.length - 1 && (
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-10 sm:my-12 clear-both" />
          )}
        </section>
      ))}

      {/* 🌟 7. HUY HIỆU TÁC GIẢ (ĐẶT TRÊN ĐƯỜNG KẺ, KHÔNG CÓ CHỮ TÁC GIẢ, KHÔNG GẠCH CHÂN, KHÔNG ICON EXTERNAL LINK) */}
      {author && (
        <div className="pt-2 pr-4 sm:pr-8 text-right my-4">
          <Link
            href={authorLink || '/gioi-thieu/su-phu-tru-tri'}
            className="inline-flex items-center group cursor-pointer bg-[#3A2718]/80 hover:bg-[#4A3220] px-5 py-2 rounded-full border border-[#F2C14E]/40 hover:border-[#F2C14E] transition-all shadow-sm"
          >
            <span
              style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
              className="text-sm sm:text-base font-bold italic text-[#F2C14E] group-hover:text-[#ffde59] transition-colors tracking-wide"
            >
              {author.replace(/[—–]/g, '-')}
            </span>
          </Link>
        </div>
      )}

      {/* QUOTE CUỐI TRANG */}
      {endQuote && (
        <div className="my-10 pt-4 text-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent mb-10" />
          <div className="max-w-2xl mx-auto text-center space-y-2.5">
            <p 
              style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
              className="text-base sm:text-lg md:text-xl font-semibold italic text-[#FFE5A3] leading-relaxed tracking-wide whitespace-pre-line"
            >
              {highlightText(endQuote.text, popups, onKeywordClick)}
            </p>
            {endQuote.author && (
              <p className="text-sm sm:text-base italic text-[#F2C14E] mt-2">
                {endQuote.author}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 🔍 LIGHTBOX MODAL PHÓNG TO ẢNH TRONG BÀI */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomImage.src}
              alt={zoomImage.caption || 'Phóng to ảnh'}
              className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-[#F2C14E]/60 shadow-[0_0_50px_rgba(242,193,78,0.3)]"
            />
            {zoomImage.caption && (
              <p className="mt-4 text-sm sm:text-base italic text-[#FFE5A3] text-center max-w-xl">
                ({zoomImage.caption})
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
