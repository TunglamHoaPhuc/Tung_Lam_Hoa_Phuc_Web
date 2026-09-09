'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  Columns,
  Layers,
  List,
  Upload,
  Code,
  Eye,
  Check,
  BookmarkPlus,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  HelpCircle,
  FileText,
} from 'lucide-react';

export type BlockType =
  | 'heading'
  | 'ketho'
  | 'paragraph'
  | 'quote'
  | 'image'
  | 'tambao'
  | 'drawers'
  | 'list'
  | 'divider';

export interface ZenBlock {
  id: string;
  type: BlockType;
  // Heading
  level?: 2 | 3;
  headingText?: string;
  // Paragraph / Generic
  content?: string;
  // Kệ Thơ & Quote
  poemLines?: string;
  author?: string;
  // Image
  imageUrl?: string;
  caption?: string;
  // 3 Cột Tam Bảo
  col1Title?: string;
  col1Desc?: string;
  col1Image?: string;
  col2Title?: string;
  col2Desc?: string;
  col2Image?: string;
  col3Title?: string;
  col3Desc?: string;
  col3Image?: string;
  // 4 Ngăn Kéo
  d1Title?: string;
  d1Desc?: string;
  d1Items?: string;
  d2Title?: string;
  d2Desc?: string;
  d2Items?: string;
  d3Title?: string;
  d3Desc?: string;
  d3Items?: string;
  d4Title?: string;
  d4Desc?: string;
  d4Items?: string;
  // List
  listItems?: string;
}

// 🪷 Chuyển đổi khối thành chuỗi Markdown chuẩn cho InfographicArticleRenderer
export function serializeBlocksToMarkdown(blocks: ZenBlock[]): string {
  const parts: string[] = [];

  for (const b of blocks) {
    switch (b.type) {
      case 'heading': {
        const prefix = b.level === 2 ? '## ' : '### ';
        const text = (b.headingText || '').trim();
        if (text) parts.push(`\n${prefix}${text}\n`);
        break;
      }
      case 'ketho': {
        const lines = (b.poemLines || '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        const quoted = lines.map((l) => `> ${l}`).join('\n');
        const author = b.author?.trim() ? `\n*${b.author.trim()}*` : '\n*Sa Môn Vô Trí (Thích Tâm Hòa)*';
        parts.push(`\n${quoted}${author}\n`);
        break;
      }
      case 'paragraph': {
        const text = (b.content || '').trim();
        if (text) parts.push(`\n${text}\n`);
        break;
      }
      case 'quote': {
        const lines = (b.poemLines || b.content || '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        const quoted = lines.map((l) => `> ${l}`).join('\n');
        const author = b.author?.trim() ? `\n*${b.author.trim()}*` : '';
        parts.push(`\n${quoted}${author}\n`);
        break;
      }
      case 'image': {
        const url = (b.imageUrl || '').trim();
        const caption = (b.caption || '').trim();
        if (url) parts.push(`\n![${caption}](${url})\n`);
        break;
      }
      case 'tambao': {
        parts.push('\n---\n');
        parts.push('### TAM BẢO: PHẬT - PHÁP - TĂNG\n');
        if (b.col1Title) {
          parts.push(`**${b.col1Title}**\n${b.col1Desc || ''}\n`);
          if (b.col1Image) parts.push(`![${b.col1Title}](${b.col1Image})\n`);
        }
        if (b.col2Title) {
          parts.push(`**${b.col2Title}**\n${b.col2Desc || ''}\n`);
          if (b.col2Image) parts.push(`![${b.col2Title}](${b.col2Image})\n`);
        }
        if (b.col3Title) {
          parts.push(`**${b.col3Title}**\n${b.col3Desc || ''}\n`);
          if (b.col3Image) parts.push(`![${b.col3Title}](${b.col3Image})\n`);
        }
        parts.push('---\n');
        break;
      }
      case 'drawers': {
        parts.push('\n**4 Ngăn kéo card**\n');
        parts.push(`**${b.d1Title || '🌿 Nền tảng tu học'}**\n${b.d1Desc || 'Những nền tảng song hành'}\nKhám phá →\n${b.d1Items || 'Tam Quy – Ngũ Giới\nThập Thiện\nBồ Tát Hạnh'}\n\n---\n`);
        parts.push(`**${b.d2Title || '🙏 Phương pháp hành trì'}**\n${b.d2Desc || 'Thực tập mỗi ngày'}\nKhám phá →\n${b.d2Items || 'Niệm Phật\nThiền tập\nNghe pháp...'}\n\n---\n`);
        parts.push(`**${b.d3Title || '🌱 Lộ trình tu học'}**\n${b.d3Desc || 'Lựa chọn lộ trình phù hợp'}\nKhám phá →\n${b.d3Items || 'Lộ trình cho người mới\nLộ trình cho người trẻ\nLộ trình cho người bận rộn'}\n\n---\n`);
        parts.push(`**${b.d4Title || '🌸 Nếp sống Thiền gia'}**\n${b.d4Desc || 'Đưa Phật pháp vào đời sống'}\nKhám phá →\n${b.d4Items || 'Văn hóa ứng xử & Giao tiếp\nOai nghi người con Phật\nBổn phận tại gia...'}\n`);
        break;
      }
      case 'list': {
        const items = (b.listItems || '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        const mdList = items.map((l) => (l.startsWith('- ') ? l : `- ${l}`)).join('\n');
        parts.push(`\n${mdList}\n`);
        break;
      }
      case 'divider': {
        parts.push('\n---\n');
        break;
      }
    }
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// 🪷 Phân tích chuỗi Markdown có sẵn thành danh sách khối ZenBlock
export function parseMarkdownToBlocks(markdown: string): ZenBlock[] {
  if (!markdown || !markdown.trim()) {
    return [
      {
        id: 'blk-' + Date.now(),
        type: 'paragraph',
        content: 'Nhập nội dung bài viết tu học tại đây...',
      },
    ];
  }

  const lines = markdown.split('\n');
  const blocks: ZenBlock[] = [];
  let currentPara: string[] = [];
  let currentQuote: string[] = [];
  let currentAuthor: string = '';
  let inQuote = false;

  const flushPara = () => {
    if (currentPara.length > 0) {
      const text = currentPara.join('\n').trim();
      if (text) {
        blocks.push({
          id: 'blk-' + Math.random().toString(36).substring(2, 9),
          type: 'paragraph',
          content: text,
        });
      }
      currentPara = [];
    }
  };

  const flushQuote = () => {
    if (currentQuote.length > 0) {
      const text = currentQuote.join('\n').trim();
      if (text) {
        blocks.push({
          id: 'blk-' + Math.random().toString(36).substring(2, 9),
          type: 'ketho',
          poemLines: text,
          author: currentAuthor || 'Sa Môn Vô Trí (Thích Tâm Hòa)',
        });
      }
      currentQuote = [];
      currentAuthor = '';
      inQuote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Heading
    if (trimmed.startsWith('### ')) {
      flushPara();
      flushQuote();
      blocks.push({
        id: 'blk-' + Math.random().toString(36).substring(2, 9),
        type: 'heading',
        level: 3,
        headingText: trimmed.replace(/^###\s+/, ''),
      });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushPara();
      flushQuote();
      blocks.push({
        id: 'blk-' + Math.random().toString(36).substring(2, 9),
        type: 'heading',
        level: 2,
        headingText: trimmed.replace(/^##\s+/, ''),
      });
      continue;
    }

    // 2. Image: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushPara();
      flushQuote();
      blocks.push({
        id: 'blk-' + Math.random().toString(36).substring(2, 9),
        type: 'image',
        caption: imgMatch[1],
        imageUrl: imgMatch[2],
      });
      continue;
    }

    // 3. Divider: ---
    if (trimmed === '---') {
      flushPara();
      flushQuote();
      blocks.push({
        id: 'blk-' + Math.random().toString(36).substring(2, 9),
        type: 'divider',
      });
      continue;
    }

    // 4. Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      flushPara();
      inQuote = true;
      currentQuote.push(trimmed.replace(/^>\s?/, ''));
      continue;
    }

    // 5. Author right after quote (*Author*)
    if (inQuote && trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2) {
      currentAuthor = trimmed.slice(1, -1);
      flushQuote();
      continue;
    }

    // If we were in a quote and hit a regular line
    if (inQuote && trimmed !== '') {
      flushQuote();
    }

    // 6. Regular Paragraph Line
    if (trimmed === '') {
      flushPara();
      flushQuote();
    } else {
      currentPara.push(line);
    }
  }

  flushPara();
  flushQuote();

  if (blocks.length === 0) {
    blocks.push({
      id: 'blk-' + Date.now(),
      type: 'paragraph',
      content: markdown,
    });
  }

  return blocks;
}

interface ZenLotusBlockStudioProps {
  initialMarkdown: string;
  onChangeMarkdown: (markdown: string) => void;
  onOpenWpMedia: (callback: (url: string) => void) => void;
  onAssignKeywordModal?: (selectedText: string) => void;
}

export function ZenLotusBlockStudio({
  initialMarkdown,
  onChangeMarkdown,
  onOpenWpMedia,
  onAssignKeywordModal,
}: ZenLotusBlockStudioProps) {
  const [blocks, setBlocks] = useState<ZenBlock[]>(() => parseMarkdownToBlocks(initialMarkdown));
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [rawText, setRawText] = useState(initialMarkdown);
  const [activeSlashBlockId, setActiveSlashBlockId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');

  // Sync out to parent
  const updateBlocks = (newBlocks: ZenBlock[]) => {
    setBlocks(newBlocks);
    const md = serializeBlocksToMarkdown(newBlocks);
    setRawText(md);
    onChangeMarkdown(md);
  };

  // Switch between Visual & Raw
  const handleToggleMode = (mode: 'visual' | 'raw') => {
    if (mode === 'raw') {
      setRawText(serializeBlocksToMarkdown(blocks));
    } else {
      setBlocks(parseMarkdownToBlocks(rawText));
    }
    setViewMode(mode);
  };

  // Add a block at index
  const addBlock = (type: BlockType, atIndex?: number) => {
    const newBlock: ZenBlock = {
      id: 'blk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      headingText: type === 'heading' ? 'TIÊU ĐỀ MỤC PHẬT PHÁP' : undefined,
      level: type === 'heading' ? 3 : undefined,
      content: type === 'paragraph' ? 'Nhập lời thuyết giảng hoặc giải nghĩa tại đây...' : undefined,
      poemLines:
        type === 'ketho'
          ? 'Con nguyện giữ tâm Bồ đề kiên cố\nCon nguyện hành hạnh tự lợi, lợi tha\nĐem an vui chan rải đến muôn nhà\nĐể tâm Phật chan hòa trong vũ trụ.'
          : undefined,
      author: type === 'ketho' ? 'Sa Môn Vô Trí (Thích Tâm Hòa)' : undefined,
      col1Title: type === 'tambao' ? 'PHẬT' : undefined,
      col1Desc: type === 'tambao' ? 'Đấng Giác ngộ vẹn toàn, từ bi che chở muôn loài.' : undefined,
      col2Title: type === 'tambao' ? 'PHÁP' : undefined,
      col2Desc: type === 'tambao' ? 'Con đường chân lý chuyển hóa khổ đau thành an lạc.' : undefined,
      col3Title: type === 'tambao' ? 'TĂNG' : undefined,
      col3Desc: type === 'tambao' ? 'Đoàn thể thanh tịnh hòa hợp cùng nhau tiến tu.' : undefined,
      d1Title: type === 'drawers' ? '🌿 Nền tảng tu học' : undefined,
      d2Title: type === 'drawers' ? '🙏 Phương pháp hành trì' : undefined,
      d3Title: type === 'drawers' ? '🌱 Lộ trình tu học' : undefined,
      d4Title: type === 'drawers' ? '🌸 Nếp sống Thiền gia' : undefined,
      listItems: type === 'list' ? 'Ham học hỏi giáo pháp\nSiêng năng hành trì\nGiữ gìn giới hạnh\nSẵn lòng phụng sự' : undefined,
    };

    let next: ZenBlock[];
    if (typeof atIndex === 'number') {
      next = [...blocks.slice(0, atIndex + 1), newBlock, ...blocks.slice(atIndex + 1)];
    } else {
      next = [...blocks, newBlock];
    }
    updateBlocks(next);
    setActiveSlashBlockId(null);
  };

  // Move block
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    updateBlocks(next);
  };

  // Duplicate block
  const duplicateBlock = (index: number) => {
    const b = blocks[index];
    const copy: ZenBlock = {
      ...b,
      id: 'blk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    const next = [...blocks.slice(0, index + 1), copy, ...blocks.slice(index + 1)];
    updateBlocks(next);
  };

  // Delete block
  const deleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      alert('Bài viết cần giữ ít nhất 1 khối nội dung.');
      return;
    }
    const next = blocks.filter((_, i) => i !== index);
    updateBlocks(next);
  };

  // Update specific block
  const updateBlockData = (id: string, patch: Partial<ZenBlock>) => {
    const next = blocks.map((b) => (b.id === id ? { ...b, ...patch } : b));
    updateBlocks(next);
  };

  // Apply Buddhist Template
  const applyTemplate = (templateType: 'chuantoan' | 'ketho' | 'hanhtri') => {
    if (confirm('Áp dụng mẫu bài viết này sẽ tạo sẵn cấu trúc khối hoàng kim chuẩn. Bạn có đồng ý không?')) {
      let tBlocks: ZenBlock[] = [];

      if (templateType === 'chuantoan') {
        tBlocks = [
          {
            id: 'b1',
            type: 'heading',
            level: 3,
            headingText: 'CỘI NGUỒN TÂM BỒ ĐỀ',
          },
          {
            id: 'b2',
            type: 'ketho',
            poemLines:
              'Con nguyện giữ tâm Bồ đề kiên cố\nCon nguyện hành hạnh tự lợi, lợi tha\nĐem an vui chan rải đến muôn nhà\nĐể tâm Phật chan hòa trong vũ trụ.',
            author: 'Sa Môn Vô Trí (Thích Tâm Hòa)',
          },
          {
            id: 'b3',
            type: 'paragraph',
            content:
              'Bồ Đề tâm là tâm nguyện sống và tu tập không chỉ vì hạnh phúc của riêng mình, mà còn vì lợi ích của muôn loài. Từ tâm nguyện ấy, người học Phật từng bước chuyển hóa thân tâm, nuôi lớn lòng từ bi và trí tuệ.',
          },
          {
            id: 'b4',
            type: 'tambao',
            col1Title: 'PHẬT',
            col1Desc: 'Bồ Đề tâm khởi nguồn từ đức tin kiên cố nơi Đức Thế Tôn.',
            col2Title: 'PHÁP',
            col2Desc: 'Nương vào giáo pháp nhiệm màu để thấu suốt bản tâm và vượt thoát mê mờ.',
            col3Title: 'TĂNG',
            col3Desc: 'Đồng hành cùng Tăng thân hòa hợp, nâng đỡ nhau trên con đường phụng sự.',
          },
          {
            id: 'b5',
            type: 'heading',
            level: 3,
            headingText: 'BỐN NGĂN KÉO TU HỌC',
          },
          {
            id: 'b6',
            type: 'drawers',
            d1Title: '🌿 Nền tảng tu học',
            d1Desc: 'Những nền tảng song hành cùng Bồ Đề tâm',
            d1Items: 'Tam Quy – Ngũ Giới\nThập Thiện\nBồ Tát Hạnh',
            d2Title: '🙏 Phương pháp hành trì',
            d2Desc: 'Thực tập mỗi ngày',
            d2Items: 'Niệm Phật\nThiền tập\nNghe pháp...',
            d3Title: '🌱 Lộ trình tu học',
            d3Desc: 'Lộ trình phù hợp nhân duyên',
            d3Items: 'Dành cho người mới\nDành cho người trẻ\nDành cho người bận rộn',
            d4Title: '🌸 Nếp sống Thiền gia',
            d4Desc: 'Đưa Phật pháp vào sinh hoạt thường nhật',
            d4Items: 'Văn hóa ứng xử & Giao tiếp tại chùa\nOai nghi người con Phật\nBổn phận người phật tử tại gia',
          },
          {
            id: 'b7',
            type: 'ketho',
            poemLines:
              'Học nghe điều có ích\nChẳng ưa gần ác nhân\nThường quán chiếu như vậy\nBồ đề thêm lớn dần.',
            author: 'Sa Môn Vô Trí (Thích Tâm Hòa)',
          },
        ];
      } else if (templateType === 'ketho') {
        tBlocks = [
          {
            id: 'b1',
            type: 'heading',
            level: 3,
            headingText: 'LỜI THƠ ĐỜI THẦY',
          },
          {
            id: 'b2',
            type: 'ketho',
            poemLines:
              'Núi cao gió càng mạnh\nNgười chí lớn độc hành\nBồ đề tâm vững chãi\nĐâu sợ những gian nguy.',
            author: 'Sa Môn Vô Trí (Thích Tâm Hòa)',
          },
          {
            id: 'b3',
            type: 'paragraph',
            content:
              'Người mang trong mình tâm Bồ Đề không cần cố gắng trở nên mạnh mẽ, bởi chính tâm nguyện rộng lớn đã trở thành sức mạnh nội tại trên con đường tu học và phụng sự.',
          },
        ];
      } else {
        tBlocks = [
          {
            id: 'b1',
            type: 'heading',
            level: 3,
            headingText: 'PHƯƠNG PHÁP HÀNH TRÌ MỖI NGÀY',
          },
          {
            id: 'b2',
            type: 'list',
            listItems:
              'Khởi tâm niệm Phật mỗi sớm mai thức giấc\nThực tập thở sâu và lắng nghe tiếng chuông tỉnh thức\nĂn cơm trong chánh niệm và tri ân muôn loài\nSám hối ba nghiệp trước giờ kinh tối',
          },
        ];
      }

      updateBlocks(tBlocks);
    }
  };

  return (
    <div className="space-y-4">
      {/* THANH ĐIỀU KHIỂN CHÍNH CỦA HOÀNG KIM BLOCK STUDIO */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-[#2A1B10] via-[#24170E] to-[#1C120A] border-2 border-[#F2C14E]/40 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#F2C14E]/20 border border-[#F2C14E]/50 flex items-center justify-center text-[#FFDE59]">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#FFDE59] uppercase tracking-wider flex items-center gap-2">
              <span>Hoàng Kim Visual Block Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#FFE5A3] border border-[#F2C14E]/30 font-semibold normal-case">
                Độc Bản Tùng Lâm
              </span>
            </h3>
            <p className="text-[10px] text-[#c9b896]/70">
              Soạn thảo trực quan theo khối Phật học, hỗ trợ gõ <code>/</code>, kéo thả &amp; chuẩn hóa Infographic
            </p>
          </div>
        </div>

        {/* NÚT THAO TÁC TRÊN THANH TOOLBAR */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Menu Mẫu Chuẩn */}
          <div className="relative group">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-xs font-bold text-[#FFDE59] flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <Layers className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>Dùng Mẫu Chuẩn</span>
              <span className="text-[9px]">▼</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-56 p-1.5 rounded-xl bg-[#1C120A] border border-[#F2C14E]/50 shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all space-y-1">
              <button
                type="button"
                onClick={() => applyTemplate('chuantoan')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A1D14] text-xs font-semibold text-[#FFE5A3] hover:text-[#FFDE59] transition-colors"
              >
                🌟 Bài Tu Học Đầy Đủ (Kệ + Tam Bảo + 4 Ngăn Kéo)
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('ketho')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A1D14] text-xs font-semibold text-[#FFE5A3] hover:text-[#FFDE59] transition-colors"
              >
                📜 Bài Kệ Thơ Phật Học
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('hanhtri')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A1D14] text-xs font-semibold text-[#FFE5A3] hover:text-[#FFDE59] transition-colors"
              >
                🙏 Bài Phương Pháp Hành Trì
              </button>
            </div>
          </div>

          {/* Toggle Visual / Raw Mode */}
          <div className="flex rounded-xl bg-[#170E08] p-1 border border-[#F2C14E]/30">
            <button
              type="button"
              onClick={() => handleToggleMode('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-[#F2C14E] text-[#120A05] shadow'
                  : 'text-[#c9b896] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Khối Trực Quan ({blocks.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('raw')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-[#F2C14E] text-[#120A05] shadow'
                  : 'text-[#c9b896] hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mã Nguồn</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHẾ ĐỘ MÃ NGUỒN RAW NẾU BẬT */}
      {viewMode === 'raw' ? (
        <div className="space-y-2">
          <textarea
            rows={18}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              onChangeMarkdown(e.target.value);
            }}
            placeholder="Nội dung mã nguồn..."
            className="w-full p-4 bg-[#1A1009] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-[#F2C14E]"
          />
          <p className="text-[11px] text-[#c9b896]/70 italic">
            Mẹo: Khi chuyển lại chế độ Khối Trực Quan, hệ thống sẽ tự động phân tích và tái cấu trúc thành các thẻ Card hoàng kim!
          </p>
        </div>
      ) : (
        /* CHẾ ĐỘ SOẠN THẢO KHỐI TRỰC QUAN (VISUAL BLOCK BUILDER) */
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className="group relative rounded-2xl bg-[#191009] border border-[#F2C14E]/30 hover:border-[#F2C14E]/80 transition-all shadow-lg overflow-hidden"
            >
              {/* HEADER KHỐI (LOẠI KHỐI & CÔNG CỤ DI CHUYỂN / XÓA) */}
              <div className="px-4 py-2 bg-[#23160D] border-b border-[#F2C14E]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#F2C14E]/20 text-[#FFDE59] flex items-center justify-center font-bold text-[10px] border border-[#F2C14E]/30">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-[#FFDE59] uppercase tracking-wide flex items-center gap-1.5">
                    {block.type === 'heading' && (
                      <>
                        <Heading3 className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Tiêu Đề Đề Mục ({block.level === 2 ? 'H2 Lớn' : 'H3 Nhỏ'})</span>
                      </>
                    )}
                    {block.type === 'ketho' && (
                      <>
                        <Quote className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Khối Kệ Thơ Phật Học Viền Vàng</span>
                      </>
                    )}
                    {block.type === 'paragraph' && (
                      <>
                        <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Đoạn Văn Thuyết Giảng</span>
                      </>
                    )}
                    {block.type === 'image' && (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Hình Ảnh Minh Họa</span>
                      </>
                    )}
                    {block.type === 'tambao' && (
                      <>
                        <Columns className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Khối 3 Cột Tam Bảo (Phật - Pháp - Tăng)</span>
                      </>
                    )}
                    {block.type === 'drawers' && (
                      <>
                        <Layers className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Khối 4 Ngăn Kéo Thẻ Card Tu Học</span>
                      </>
                    )}
                    {block.type === 'list' && (
                      <>
                        <List className="w-3.5 h-3.5 text-[#F2C14E]" />
                        <span>Danh Sách Điểm Tu Học</span>
                      </>
                    )}
                    {block.type === 'divider' && <span>Đường Kẻ Phân Cách Trang Trọng (---)</span>}
                  </span>
                </div>

                {/* NÚT THAO TÁC KHỐI */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-[#c9b896] hover:text-[#FFDE59] hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    title="Di chuyển khối lên trên"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'down')}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded text-[#c9b896] hover:text-[#FFDE59] hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    title="Di chuyển khối xuống dưới"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateBlock(idx)}
                    className="p-1 rounded text-[#c9b896] hover:text-[#FFDE59] hover:bg-white/5 cursor-pointer"
                    title="Nhân bản khối này"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBlock(idx)}
                    className="p-1 rounded text-[#c9b896] hover:text-red-400 hover:bg-white/5 cursor-pointer"
                    title="Xóa khối này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* NỘI DUNG TỪNG LOẠI KHỐI */}
              <div className="p-4 sm:p-5">
                {/* 1. KHỐI TIÊU ĐỀ */}
                {block.type === 'heading' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={block.level || 3}
                        onChange={(e) => updateBlockData(block.id, { level: Number(e.target.value) as 2 | 3 })}
                        className="px-2 py-1 bg-[#120A05] border border-[#F2C14E]/40 rounded-lg text-xs font-bold text-[#FFDE59] focus:outline-none"
                      >
                        <option value={3}>H3 — Đề mục nhỏ (Tự tạo mục lục)</option>
                        <option value={2}>H2 — Đề mục lớn</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={block.headingText || ''}
                      onChange={(e) => updateBlockData(block.id, { headingText: e.target.value })}
                      placeholder="Ví dụ: BỒ ĐỀ TÂM LÀ GÌ"
                      className="w-full px-3.5 py-2.5 bg-[#120A05] border border-[#F2C14E]/50 rounded-xl text-sm font-bold text-[#FFDE59] focus:outline-none focus:border-[#FFDE59] uppercase tracking-wider"
                    />
                  </div>
                )}

                {/* 2. KHỐI KỆ THƠ PHẬT HỌC HOÀNG KIM */}
                {block.type === 'ketho' && (
                  <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-[#2D1B0F] via-[#21140B] to-[#170E08] border-2 border-[#F2C14E]/50 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFDE59]">
                      <span className="flex items-center gap-1.5">
                        <Quote className="w-4 h-4 text-[#F2C14E]" />
                        <span>Lời Kệ Thơ (Mỗi dòng là một câu thơ):</span>
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={block.poemLines || ''}
                      onChange={(e) => updateBlockData(block.id, { poemLines: e.target.value })}
                      placeholder="Con nguyện giữ tâm Bồ đề kiên cố&#10;Con nguyện hành hạnh tự lợi, lợi tha&#10;Đem an vui chan rải đến muôn nhà&#10;Để tâm Phật chan hòa trong vũ trụ."
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      className="w-full p-3 bg-[#120A05] border border-[#F2C14E]/40 rounded-xl text-sm sm:text-base text-[#FFE5A3] italic leading-relaxed focus:outline-none focus:border-[#FFDE59]"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#c9b896]/80 shrink-0">Tác giả lời kệ:</span>
                      <input
                        type="text"
                        value={block.author || ''}
                        onChange={(e) => updateBlockData(block.id, { author: e.target.value })}
                        placeholder="Sa Môn Vô Trí (Thích Tâm Hòa)"
                        className="flex-1 px-3 py-1.5 bg-[#120A05] border border-[#F2C14E]/40 rounded-xl text-xs font-medium text-[#FFDE59] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. KHỐI ĐOẠN VĂN THUYẾT GIẢNG */}
                {block.type === 'paragraph' && (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={block.content || ''}
                      onChange={(e) => updateBlockData(block.id, { content: e.target.value })}
                      placeholder="Nhập nội dung giảng giải... Bôi đen một từ rồi bấm Gán Popup để chú thích thuật ngữ."
                      className="w-full p-3 bg-[#120A05] border border-[#F2C14E]/35 rounded-xl text-xs sm:text-sm text-white leading-relaxed focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                )}

                {/* 4. KHỐI HÌNH ẢNH */}
                {block.type === 'image' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {block.imageUrl ? (
                        <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-black/40 shrink-0">
                          <img src={block.imageUrl} alt={block.caption || ''} className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <input
                        type="text"
                        value={block.imageUrl || ''}
                        onChange={(e) => updateBlockData(block.id, { imageUrl: e.target.value })}
                        placeholder="Dán link ảnh hoặc chọn từ Thư viện..."
                        className="flex-1 px-3 py-2 bg-[#120A05] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWpMedia((url) => {
                            updateBlockData(block.id, { imageUrl: url });
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 border border-[#F2C14E]/50 text-xs font-bold text-[#FFDE59] flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Thư Viện Ảnh WP</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlockData(block.id, { caption: e.target.value })}
                      placeholder="Chú thích dưới ảnh (Ví dụ: Chùa Hoàng Pháp - Nơi chốn Tổ)..."
                      className="w-full px-3 py-1.5 bg-[#120A05] border border-[#F2C14E]/30 rounded-lg text-xs text-[#c9b896] focus:outline-none"
                    />
                  </div>
                )}

                {/* 5. KHỐI 3 CỘT TAM BẢO */}
                {block.type === 'tambao' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {/* CỘT 1: PHẬT */}
                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-2">
                      <input
                        type="text"
                        value={block.col1Title || 'PHẬT'}
                        onChange={(e) => updateBlockData(block.id, { col1Title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs font-bold text-[#FFDE59] text-center"
                      />
                      <textarea
                        rows={3}
                        value={block.col1Desc || ''}
                        onChange={(e) => updateBlockData(block.id, { col1Desc: e.target.value })}
                        placeholder="Mô tả cột Phật..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWpMedia((url) => {
                            updateBlockData(block.id, { col1Image: url });
                          })
                        }
                        className="w-full py-1 rounded bg-[#2A1D14] hover:bg-[#3A2718] text-[10px] text-[#FFE5A3] font-medium border border-[#F2C14E]/30"
                      >
                        {block.col1Image ? 'Đổi ảnh Cột 1' : '+ Chọn ảnh Cột 1'}
                      </button>
                    </div>

                    {/* CỘT 2: PHÁP */}
                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-2">
                      <input
                        type="text"
                        value={block.col2Title || 'PHÁP'}
                        onChange={(e) => updateBlockData(block.id, { col2Title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs font-bold text-[#FFDE59] text-center"
                      />
                      <textarea
                        rows={3}
                        value={block.col2Desc || ''}
                        onChange={(e) => updateBlockData(block.id, { col2Desc: e.target.value })}
                        placeholder="Mô tả cột Pháp..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWpMedia((url) => {
                            updateBlockData(block.id, { col2Image: url });
                          })
                        }
                        className="w-full py-1 rounded bg-[#2A1D14] hover:bg-[#3A2718] text-[10px] text-[#FFE5A3] font-medium border border-[#F2C14E]/30"
                      >
                        {block.col2Image ? 'Đổi ảnh Cột 2' : '+ Chọn ảnh Cột 2'}
                      </button>
                    </div>

                    {/* CỘT 3: TĂNG */}
                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-2">
                      <input
                        type="text"
                        value={block.col3Title || 'TĂNG'}
                        onChange={(e) => updateBlockData(block.id, { col3Title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/40 rounded-lg text-xs font-bold text-[#FFDE59] text-center"
                      />
                      <textarea
                        rows={3}
                        value={block.col3Desc || ''}
                        onChange={(e) => updateBlockData(block.id, { col3Desc: e.target.value })}
                        placeholder="Mô tả cột Tăng..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWpMedia((url) => {
                            updateBlockData(block.id, { col3Image: url });
                          })
                        }
                        className="w-full py-1 rounded bg-[#2A1D14] hover:bg-[#3A2718] text-[10px] text-[#FFE5A3] font-medium border border-[#F2C14E]/30"
                      >
                        {block.col3Image ? 'Đổi ảnh Cột 3' : '+ Chọn ảnh Cột 3'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. KHỐI 4 NGĂN KÉO CARD */}
                {block.type === 'drawers' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-1.5">
                      <input
                        type="text"
                        value={block.d1Title || '🌿 Nền tảng tu học'}
                        onChange={(e) => updateBlockData(block.id, { d1Title: e.target.value })}
                        className="w-full px-2 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded text-xs font-bold text-[#FFDE59]"
                      />
                      <textarea
                        rows={2}
                        value={block.d1Items || ''}
                        onChange={(e) => updateBlockData(block.id, { d1Items: e.target.value })}
                        placeholder="Mỗi dòng là 1 mục..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/20 rounded text-[11px] text-white"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-1.5">
                      <input
                        type="text"
                        value={block.d2Title || '🙏 Phương pháp hành trì'}
                        onChange={(e) => updateBlockData(block.id, { d2Title: e.target.value })}
                        className="w-full px-2 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded text-xs font-bold text-[#FFDE59]"
                      />
                      <textarea
                        rows={2}
                        value={block.d2Items || ''}
                        onChange={(e) => updateBlockData(block.id, { d2Items: e.target.value })}
                        placeholder="Mỗi dòng là 1 mục..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/20 rounded text-[11px] text-white"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-1.5">
                      <input
                        type="text"
                        value={block.d3Title || '🌱 Lộ trình tu học'}
                        onChange={(e) => updateBlockData(block.id, { d3Title: e.target.value })}
                        className="w-full px-2 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded text-xs font-bold text-[#FFDE59]"
                      />
                      <textarea
                        rows={2}
                        value={block.d3Items || ''}
                        onChange={(e) => updateBlockData(block.id, { d3Items: e.target.value })}
                        placeholder="Mỗi dòng là 1 mục..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/20 rounded text-[11px] text-white"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#120A05] border border-[#F2C14E]/30 space-y-1.5">
                      <input
                        type="text"
                        value={block.d4Title || '🌸 Nếp sống Thiền gia'}
                        onChange={(e) => updateBlockData(block.id, { d4Title: e.target.value })}
                        className="w-full px-2 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded text-xs font-bold text-[#FFDE59]"
                      />
                      <textarea
                        rows={2}
                        value={block.d4Items || ''}
                        onChange={(e) => updateBlockData(block.id, { d4Items: e.target.value })}
                        placeholder="Mỗi dòng là 1 mục..."
                        className="w-full p-2 bg-[#1C120A] border border-[#F2C14E]/20 rounded text-[11px] text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 7. KHỐI DANH SÁCH LIST */}
                {block.type === 'list' && (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={block.listItems || ''}
                      onChange={(e) => updateBlockData(block.id, { listItems: e.target.value })}
                      placeholder="Mỗi dòng là một điểm tu học..."
                      className="w-full p-3 bg-[#120A05] border border-[#F2C14E]/30 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                )}

                {/* 8. KHỐI ĐƯỜNG KẺ PHÂN CÁCH */}
                {block.type === 'divider' && (
                  <div className="py-2 text-center">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent my-1" />
                    <span className="text-[10px] text-[#c9b896]/60">Đường kẻ trang trọng viền vàng</span>
                  </div>
                )}
              </div>

              {/* NÚT CHÈN NHANH KHỐI MỚI NGAY DƯỚI ĐÂY */}
              <div className="px-4 py-1.5 bg-[#120A05]/50 border-t border-[#F2C14E]/10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-[#c9b896]/60">Thêm khối bên dưới:</span>
                <button
                  type="button"
                  onClick={() => addBlock('ketho', idx)}
                  className="px-2 py-0.5 rounded bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#FFDE59] hover:text-[#120A05] text-[10px] font-bold transition-all"
                >
                  + Kệ Thơ
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('heading', idx)}
                  className="px-2 py-0.5 rounded bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#FFDE59] hover:text-[#120A05] text-[10px] font-bold transition-all"
                >
                  + Tiêu Đề
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('paragraph', idx)}
                  className="px-2 py-0.5 rounded bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#FFDE59] hover:text-[#120A05] text-[10px] font-bold transition-all"
                >
                  + Đoạn Văn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('image', idx)}
                  className="px-2 py-0.5 rounded bg-[#F2C14E]/20 hover:bg-[#F2C14E] text-[#FFDE59] hover:text-[#120A05] text-[10px] font-bold transition-all"
                >
                  + Ảnh
                </button>
              </div>
            </div>
          ))}

          {/* MENU NÚT BẤM THÊM KHỐI MỚI TO DƯỚI CÙNG */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-[#F2C14E]/40 bg-[#170E08]/60 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
            <span className="text-xs font-bold text-[#FFE5A3] mr-2">➕ Thêm Khối Phật Học Mới:</span>
            <button
              type="button"
              onClick={() => addBlock('ketho')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Quote className="w-3.5 h-3.5" />
              <span>📜 Kệ Thơ Viền Vàng</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('heading')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span>📌 Tiêu Đề Đề Mục</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📝 Đoạn Văn Giảng Giải</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('tambao')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>🪷 3 Cột Tam Bảo</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('drawers')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🗂️ 4 Ngăn Kéo Tu Học</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('image')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>📷 Hình Ảnh</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('list')}
              className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <List className="w-3.5 h-3.5" />
              <span>📋 Danh Sách</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('divider')}
              className="px-3 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#120A05] border border-[#F2C14E]/40 text-xs font-bold transition-all shadow cursor-pointer"
            >
              <span>➖ Kẻ Ngang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
