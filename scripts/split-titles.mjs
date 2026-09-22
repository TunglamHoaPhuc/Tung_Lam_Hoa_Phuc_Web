/**
 * 🪷 TÁCH TIÊU ĐỀ THÔNG MINH CHO TÙNG LÂM HÒA PHÚC
 * Logic: Tiêu đề chính ngắn gọn (≤50 ký tự), phần dài chuyển vào subtitle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../src/data/posts-database.json');

const posts = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

let changed = 0;

/**
 * Tách tiêu đề dài thành [mainTitle, subtitle]
 * Ưu tiên tách theo:
 * 1. Pattern "Ngày X – Tên sự kiện" → giữ nguyên vì đây là series có chủ ý
 * 2. Dấu "?" — phần hỏi là tiêu đề, phần sau là phụ đề
 * 3. Dấu "–" / "—" / " - " — phần trước là main, phần sau là sub
 * 4. Ngoặc đơn cuối (ngày, PL, năm) — đưa vào sub
 * 5. Cắt thông minh không kết thúc bằng dấu câu lẻ
 */
function splitTitle(title, currentSubtitle) {
  if (!title) return { title, subtitle: currentSubtitle };

  const trimmed = title.trim();
  const isDefaultSub = !currentSubtitle || currentSubtitle.trim() === '' || currentSubtitle === 'Tùng Lâm Hòa Phúc';

  // Nếu tiêu đề đã ngắn và subtitle đã có nội dung thực → giữ nguyên
  if (trimmed.length <= 55 && !isDefaultSub) {
    return { title: trimmed, subtitle: currentSubtitle };
  }

  // ---- Quy tắc tách ----

  // 0. Pattern đặc biệt: "Ngày X – ..." — đây là series bài có chủ ý, giữ nguyên nếu ≤ 60 ký tự
  //    VD: "Ngày 4 – Chương trình khoá sinh hoạt hè – đợt 01 – ngày 27/07/2025"
  //    Chỉ tách phần ngày cuối ra làm sub
  if (/^Ngày \d+\s+[–—-]/.test(trimmed)) {
    // Tách phần ngày cuối: "– ngày DD/MM/YYYY" hoặc "(ngày ...)"
    const dayAtEnd = trimmed.match(/^(.+?)\s+[–—-]\s+(ngày \d{2}\/\d{2}\/\d{4})\s*$/i);
    if (dayAtEnd) {
      return { title: dayAtEnd[1].trim(), subtitle: isDefaultSub ? dayAtEnd[2] : currentSubtitle };
    }
    // Nếu không có ngày cuối rõ ràng → giữ nguyên (series label)
    if (trimmed.length <= 70) {
      return { title: trimmed, subtitle: currentSubtitle };
    }
  }

  // 1. Tách theo dấu "?" — câu hỏi thường là tiêu đề chính hay
  const questionMark = trimmed.indexOf('?');
  if (questionMark > 0 && questionMark < trimmed.length - 1) {
    const main = trimmed.slice(0, questionMark + 1).replace(/,\s*$/, '').trim();
    const sub = trimmed.slice(questionMark + 1).replace(/^[^a-zA-ZÀ-ỹ0-9]+/, '').trim();
    if (main.length >= 10 && sub.length >= 5) {
      return { title: main, subtitle: isDefaultSub ? sub : currentSubtitle };
    }
  }

  // 2. Tách câu hỏi khi có dấu phẩy theo kiểu "A, tại sao B?"
  const commaQuestion = trimmed.match(/^(.{15,50}?),\s+(tại sao|vì sao|như thế nào|thế nào|ai là|khi nào)(.+)/i);
  if (commaQuestion) {
    const main = commaQuestion[1].trim();
    const sub = (commaQuestion[2] + commaQuestion[3]).trim();
    if (isDefaultSub) {
      return { title: main, subtitle: sub.charAt(0).toUpperCase() + sub.slice(1) };
    }
    return { title: main, subtitle: currentSubtitle };
  }

  // 3. Tách theo dấu " – " " — " " - "
  //    Chỉ tách ở lần xuất hiện đầu tiên của dấu gạch
  const dashIdx = trimmed.search(/ [–—] /);
  if (dashIdx > 0) {
    const part1 = trimmed.slice(0, dashIdx).trim();
    const part2 = trimmed.slice(dashIdx).replace(/^\s*[–—]\s*/, '').trim();

    if (part1.length >= 10 && part1.length <= 55 && part2.length >= 3) {
      if (isDefaultSub) {
        return { title: part1, subtitle: part2 };
      }
      return { title: part1, subtitle: currentSubtitle };
    }
  }

  // 4. Tách ngoặc đơn cuối chứa ngày/năm/PL/lịch âm
  const parenDateMatch = trimmed.match(/^(.+?)\s+\(([^)]{5,60})\)\s*$/);
  if (parenDateMatch) {
    const main = parenDateMatch[1].trim();
    const datePart = parenDateMatch[2].trim();
    if (main.length <= 65 && main.length >= 10) {
      return { title: main, subtitle: isDefaultSub ? datePart : currentSubtitle };
    }
  }

  // 5. Cắt thông minh cho tiêu đề còn dài (>60 ký tự) nhưng không có separator
  //    → Tìm vị trí cắt gần 45 ký tự (tại khoảng trắng)
  //    → Không kết thúc main bằng dấu câu lẻ như "–", ",", "—"
  if (trimmed.length > 60 && isDefaultSub) {
    let cutPoint = -1;
    for (let i = 50; i >= 28; i--) {
      if (trimmed[i] === ' ') {
        // Không cắt nếu từ trước đó là dấu gạch hoặc phẩy
        const charBefore = trimmed[i - 1];
        if (charBefore !== '–' && charBefore !== '—' && charBefore !== '-' && charBefore !== ',') {
          cutPoint = i;
          break;
        }
      }
    }
    if (cutPoint > 15) {
      const main = trimmed.slice(0, cutPoint).trim().replace(/[,–—-]+$/, '').trim();
      const sub = trimmed.slice(cutPoint).trim().replace(/^[–—,-]\s*/, '').trim();
      if (sub.length >= 5) {
        return { title: main, subtitle: sub };
      }
    }
  }

  return { title: trimmed, subtitle: currentSubtitle };
}

// Áp dụng cho tất cả bài viết
const updated = posts.map(post => {
  const { title: newTitle, subtitle: newSubtitle } = splitTitle(post.title, post.subtitle);
  if (newTitle !== post.title || newSubtitle !== post.subtitle) {
    changed++;
    if (changed <= 20) {
      console.log(`[SPLIT] "${post.title}"`);
      console.log(`  → title: "${newTitle}"`);
      console.log(`  → sub:   "${newSubtitle}"`);
    }
    return { ...post, title: newTitle, subtitle: newSubtitle };
  }
  return post;
});

fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8');
console.log(`\n✅ Đã tách tiêu đề: ${changed}/${posts.length} bài viết được cập nhật.`);
