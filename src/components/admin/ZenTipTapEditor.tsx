'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import {
  Undo,
  Redo,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Image as ImageIcon,
  Upload,
  Eye,
  FileCode,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Sparkles,
} from 'lucide-react';

interface ZenTipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  folderPath?: string;
  onOpenS3Explorer?: () => void;
  onAddAnnotationKeyword?: (selectedText: string) => void;
  previewMode?: boolean;
  onTogglePreview?: () => void;
}

export default function ZenTipTapEditor({
  content,
  onChange,
  folderPath = 'tong-chi-tu-hoc',
  onOpenS3Explorer,
  onAddAnnotationKeyword,
  previewMode = false,
  onTogglePreview,
}: ZenTipTapEditorProps) {
  // Khởi tạo TipTap Editor với đầy đủ Extension & Markdown Serializer
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3, 4],
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-[#F2C14E] pl-4 my-5 italic text-[#FFE5A3] font-semibold quote-zen-block',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-6 border-[#F2C14E]/30',
          },
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-h-80 mx-auto rounded-2xl border-2 border-[#F2C14E]/60 shadow-xl object-contain my-4',
        },
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu soạn thảo lời dạy, kệ thiền môn, hoặc dán nội dung từ Word/Google Docs vào đây...',
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class:
          'wysiwyg-docs-content flex-1 w-full p-6 sm:p-8 bg-[#25170E] border border-[#F2C14E]/40 rounded-2xl text-base text-[#F5EADB] focus:outline-none focus:border-[#F2C14E] leading-relaxed shadow-inner overflow-y-auto custom-scrollbar font-sans selection:bg-[#F2C14E]/30 min-h-[400px]',
        style: "font-family: var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif;",
      },
    },
    onUpdate: ({ editor }) => {
      // Lấy trực tiếp chuỗi Markdown chuẩn từ TipTap Engine
      const md = ((editor.storage as any).markdown?.getMarkdown?.() || editor.getHTML()) as string;
      onChange(md);
    },
  });

  // Đồng bộ nội dung khi prop content từ ngoài thay đổi (ví dụ khi mở bài viết khác)
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentMd = (editor.storage as any).markdown?.getMarkdown?.() || '';
      if (currentMd.trim() !== content.trim()) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  // Xử lý upload ảnh trực tiếp lên S3 khi kéo thả file
  const uploadImageFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderPath', folderPath);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        }
      } catch (err) {
        console.error('Lỗi tải ảnh lên S3:', err);
      }
    },
    [editor, folderPath]
  );

  // Lắng nghe kéo thả ảnh
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            uploadImageFile(file);
          }
        }
      }
    },
    [uploadImageFile]
  );

  // Xử lý click nút chú thích từ khóa
  const handleAnnotate = useCallback(() => {
    if (!editor || !onAddAnnotationKeyword) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ').trim();
    if (selectedText) {
      onAddAnnotationKeyword(selectedText);
    }
  }, [editor, onAddAnnotationKeyword]);

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-[#F2C14E] font-medium animate-pulse">
        ⏳ Đang khởi tạo TipTap Zen Editor...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* ── THANH CÔNG CỤ SOẠN THẢO (ZEN TOOLBAR) ── */}
      <div className="flex items-center justify-between gap-1 p-2 bg-[#2D1B10] border-b border-[#F2C14E]/30 rounded-t-2xl px-4 flex-wrap z-10">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-[#F2C14E]/30 mx-1" />

          {/* Heading 1 (###) */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="Tiêu Đề Lớn (H1 / ###)"
          >
            <Heading1 className="w-4 h-4" />
            <span>H1</span>
          </button>

          {/* Heading 2 (####) */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              editor.isActive('heading', { level: 4 })
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="Tiêu Đề Phụ (H2 / ####)"
          >
            <Heading2 className="w-4 h-4" />
            <span>H2</span>
          </button>

          {/* Quote Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              editor.isActive('blockquote')
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="Trích Dẫn Thiền Môn / Lời Thầy (Quote >)"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              editor.isActive('bold')
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="In Đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              editor.isActive('italic')
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="In Nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              editor.isActive('underline')
                ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm font-black'
                : 'text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718]'
            }`}
            title="Gạch Chân (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          {/* Horizontal Rule */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-[#FFE5A3]/80 hover:text-[#F2C14E] hover:bg-[#3A2718] transition-all cursor-pointer"
            title="Đường Phân Đoạn (---)"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Chú thích từ khóa */}
          {onAddAnnotationKeyword && (
            <button
              type="button"
              onClick={handleAnnotate}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#FFDE59] bg-[#3A2718] hover:bg-[#4A3220] border border-[#F2C14E]/50 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-1"
              title="Bôi đen chữ rồi bấm để gắn chú thích từ khóa"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>Gắn Chú Thích</span>
            </button>
          )}
        </div>

        {/* Cụm nút công cụ bên phải (S3, Upload, Preview) */}
        <div className="flex items-center gap-1.5">
          {onOpenS3Explorer && (
            <button
              type="button"
              onClick={onOpenS3Explorer}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#FFE5A3] hover:text-white bg-[#3A2718] hover:bg-[#4A3220] border border-[#F2C14E]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Mở kho ảnh S3 Chùa"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span className="hidden sm:inline">Kho Ảnh S3</span>
            </button>
          )}

          {/* Tải ảnh trực tiếp */}
          <label
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#FFE5A3] hover:text-white bg-[#3A2718] hover:bg-[#4A3220] border border-[#F2C14E]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Tải ảnh trực tiếp lên S3"
          >
            <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span className="hidden sm:inline">Tải Ảnh</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImageFile(file);
              }}
            />
          </label>

          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode
                  ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm'
                  : 'bg-[#3A2718] text-[#FFE5A3] hover:text-white border border-[#F2C14E]/40'
              }`}
              title="Bật/Tắt chế độ xem trước bài viết chuẩn giao diện web"
            >
              {previewMode ? <FileCode className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{previewMode ? 'Soạn Thảo' : 'Xem Trước'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── KHUNG BIÊN TẬP TIPTAP ── */}
      <div className="flex-1 flex flex-col min-h-0 relative" onDrop={handleDrop}>
        <EditorContent editor={editor} className="flex-1 flex flex-col min-h-0" />
      </div>
    </div>
  );
}
