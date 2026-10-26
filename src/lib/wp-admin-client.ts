/**
 * WordPress Admin Client for Direct Gutenberg Integration
 * Tùng Lâm Hòa Phúc - Hệ Thống Quản Trị Tự Động Đồng Bộ Bài Viết
 */

import { getWpConfig } from './env-config';
import { markRecentSync } from './sync-queue';

export function getWpBaseUrl(): string {
  return getWpConfig().baseUrl;
}

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
};

interface WpSession {
  cookies: string;
  nonce: string;
  timestamp: number;
}

let sessionCache: WpSession | null = null;
const SESSION_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Xóa cache phiên để buộc đăng nhập lại khi nonce hết hạn hoặc bị 403
 */
export function invalidateWpSession() {
  sessionCache = null;
}

/**
 * Lấy session xác thực WordPress (Cookies & REST Nonce)
 */
export async function getWpSession(forceRefresh: boolean = false): Promise<{ cookies: string; nonce: string }> {
  const now = Date.now();
  if (!forceRefresh && sessionCache && now - sessionCache.timestamp < SESSION_TTL) {
    return { cookies: sessionCache.cookies, nonce: sessionCache.nonce };
  }

  const wpConfig = getWpConfig(true);

  const params = new URLSearchParams();
  params.append('log', wpConfig.username);
  params.append('pwd', wpConfig.password || '');
  params.append('wp-submit', 'Đăng nhập');
  params.append('redirect_to', `${wpConfig.baseUrl}/wp-admin/`);
  params.append('testcookie', '1');

  // 1. Đăng nhập vào WordPress qua wp-login.php
  const loginRes = await fetch(`${wpConfig.baseUrl}/wp-login.php`, {
    method: 'POST',
    headers: {
      ...COMMON_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: 'wordpress_test_cookie=WP%20Cookie%20check',
    },
    body: params.toString(),
    redirect: 'manual',
  });

  let rawCookies: string[] = [];
  if (typeof (loginRes.headers as any).getSetCookie === 'function') {
    rawCookies = (loginRes.headers as any).getSetCookie();
  } else {
    const raw = loginRes.headers.get('set-cookie') || '';
    rawCookies = raw.split(/,\s*(?=[a-zA-Z0-9_\-]+=[^;]+)/);
  }

  const cookieHeader = rawCookies
    .filter(Boolean)
    .map((c: string) => c.split(';')[0].trim())
    .join('; ');

  if (!cookieHeader.includes('wordpress_logged_in_')) {
    console.warn('[wp-admin-client] WordPress login response does not contain logged_in cookie. Status:', loginRes.status);
  }

  // 2. Tải trang wp-admin để trích xuất REST API Nonce
  const adminRes = await fetch(`${wpConfig.baseUrl}/wp-admin/`, {
    headers: {
      ...COMMON_HEADERS,
      Cookie: cookieHeader,
    },
  });
  const html = await adminRes.text();

  let nonce: string | null = null;
  const matchNonce = html.match(/wpApiSettings\s*=\s*\{[^}]*"nonce":"([^"]+)"/);
  if (matchNonce) {
    nonce = matchNonce[1];
  } else {
    // Fallback thử tìm nonce ở post-new.php
    const newRes = await fetch(`${wpConfig.baseUrl}/wp-admin/post-new.php`, {
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookieHeader,
      },
    });
    const newHtml = await newRes.text();
    const matchNew = newHtml.match(/"nonce":"([a-f0-9]+)"/);
    if (matchNew) nonce = matchNew[1];
  }

  if (!nonce) {
    throw new Error('Không thể lấy X-WP-Nonce từ trang quản trị WordPress');
  }

  sessionCache = {
    cookies: cookieHeader,
    nonce,
    timestamp: now,
  };

  return { cookies: cookieHeader, nonce };
}

/**
 * Bản đồ danh mục WordPress cho Tùng Lâm Hòa Phúc
 */
export const WP_CATEGORIES: Record<string, number> = {
  'dong-chay-hoang-phap': 2,
  'lich-su-hinh-thanh': 7,
  'gioi-thieu': 7,
  'nguon-coi-tam-linh': 9,
  'tong-chi-tu-hoc': 1,
  'tong-chi-tu-hoc-cot-yeu': 8,
  'tri-tue-phat-phap': 5,
  'tuong-phap': 4,
  'vu-tru-phat-giao': 3,
};

/**
 * Chuyển đổi nội dung HTML / Markdown sang các khối Gutenberg chuẩn (WordPress Block Comments)
 */
export function convertToGutenbergBlocks(html: string, photoGallery: any[] = []): string {
  if (!html && (!photoGallery || photoGallery.length === 0)) return '';
  let content = (html || '').trim();

  // Nếu đã chứa khối Gutenberg thì giữ nguyên
  if (content.includes('<!-- wp:')) {
    return content;
  }

  const buildWpImage = (url: string, caption = '', alt = '') => {
    const finalAlt = alt || caption || 'Ảnh tư liệu Tùng Lâm Hòa Phúc';
    const captionHtml = caption
      ? `\n<figcaption class="wp-element-caption">${caption}</figcaption>`
      : '';
    return `<!-- wp:image {"sizeSlug":"large","linkTo":"none"} -->\n<figure class="wp-block-image size-large"><img src="${url}" alt="${finalAlt}"/>${captionHtml}</figure>\n<!-- /wp:image -->`;
  };

  const buildWpGallery = (images: Array<{ url: string; caption?: string; alt?: string }>) => {
    if (!images || images.length === 0) return '';
    if (images.length === 1) {
      return buildWpImage(images[0].url, images[0].caption, images[0].alt);
    }
    const cols = images.length === 2 ? 2 : 3;
    const innerImages = images
      .map((img) => buildWpImage(img.url, img.caption, img.alt))
      .join('\n');
    return `<!-- wp:gallery {"columns":${cols},"linkTo":"none"} -->\n<figure class="wp-block-gallery has-nested-images columns-${cols} is-cropped">\n${innerImages}\n</figure>\n<!-- /wp:gallery -->`;
  };

  // 1. Gom nhóm các ảnh Markdown liên tiếp thành khối Gallery
  const galleryPlaceholders: string[] = [];
  content = content.replace(/(?:!\[[\s\S]*?\]\(https?:\/\/[^\s\)]+\)\s*){2,}/g, (match) => {
    const imgs: Array<{ url: string; caption: string; alt: string }> = [];
    let m: RegExpExecArray | null;
    const innerRegex = /!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;
    while ((m = innerRegex.exec(match)) !== null) {
      imgs.push({ caption: m[1].trim(), alt: m[1].trim(), url: m[2].trim() });
    }
    if (imgs.length > 0) {
      const pId = `__GALLERY_BLOCK_${galleryPlaceholders.length}__`;
      galleryPlaceholders.push(buildWpGallery(imgs));
      return `\n\n${pId}\n\n`;
    }
    return match;
  });

  // Ảnh Markdown đơn lẻ
  content = content.replace(/!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, (_match, caption, url) => {
    return `\n\n${buildWpImage(url.trim(), caption.trim(), caption.trim())}\n\n`;
  });

  // 2. Chuyển đổi tiêu đề (Markdown & HTML)
  content = content.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, text) => {
    const level = hashes.length;
    return `\n<!-- wp:heading {"level":${level}} -->\n<h${level}>${text.trim()}</h${level}>\n<!-- /wp:heading -->\n`;
  });
  content = content.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level, attrs, inner) => {
    return `\n<!-- wp:heading {"level":${level}} -->\n<h${level}${attrs}>${inner.trim()}</h${level}>\n<!-- /wp:heading -->\n`;
  });

  // 3. Chuyển đổi blockquote
  content = content.replace(/^>\s+(.+)$/gm, (_match, text) => {
    return `\n<!-- wp:quote -->\n<blockquote class="wp-block-quote"><p>${text.trim()}</p></blockquote>\n<!-- /wp:quote -->\n`;
  });
  content = content.replace(/<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi, (_match, attrs, inner) => {
    return `\n<!-- wp:quote -->\n<blockquote class="wp-block-quote"${attrs}>${inner.trim()}</blockquote>\n<!-- /wp:quote -->\n`;
  });

  // 4. Chuyển đổi figure & img HTML
  content = content.replace(
    /<figure[^>]*>[\s\S]*?<img([^>]+)>[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/gi,
    (_match, imgAttrs, cap) => {
      const srcM = imgAttrs.match(/src=["']([^"']+)["']/i);
      const altM = imgAttrs.match(/alt=["']([^"']*)["']/i);
      if (srcM) {
        return `\n\n${buildWpImage(srcM[1], (cap || '').trim(), (altM ? altM[1] : '').trim())}\n\n`;
      }
      return '';
    }
  );
  content = content.replace(/<img\s+([^>]+)>/gi, (_match, imgAttrs) => {
    const srcM = imgAttrs.match(/src=["']([^"']+)["']/i);
    const altM = imgAttrs.match(/alt=["']([^"']*)["']/i);
    if (srcM) {
      return `\n\n${buildWpImage(srcM[1], '', (altM ? altM[1] : '').trim())}\n\n`;
    }
    return '';
  });

  // 5. Chuyển đổi danh sách ul / ol
  content = content.replace(/<(ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi, (_match, tag, attrs, inner) => {
    const isOrdered = tag.toLowerCase() === 'ol';
    return `\n<!-- wp:list {"ordered":${isOrdered}} -->\n<${tag}${attrs}>${inner.trim()}</${tag}>\n<!-- /wp:list -->\n`;
  });

  // 6. Khôi phục các khối Gallery
  galleryPlaceholders.forEach((galBlock, i) => {
    content = content.replace(`__GALLERY_BLOCK_${i}__`, galBlock);
  });

  // 7. Chuyển đổi các đoạn văn bản còn lại
  const blocks = content.split(/\n\s*\n/);
  const formattedBlocks = blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return '';
      if (
        b.startsWith('<!-- wp:') ||
        b.endsWith('-->') ||
        b.startsWith('<h') ||
        b.startsWith('<figure') ||
        b.startsWith('<ul') ||
        b.startsWith('<ol')
      ) {
        return b;
      }
      if (b.startsWith('<p>') && b.endsWith('</p>')) {
        return `<!-- wp:paragraph -->\n${b}\n<!-- /wp:paragraph -->`;
      }
      return `<!-- wp:paragraph -->\n<p>${b}</p>\n<!-- /wp:paragraph -->`;
    })
    .filter(Boolean);

  let finalResult = formattedBlocks.join('\n\n');

  if (photoGallery && photoGallery.length > 0 && !finalResult.includes('<!-- wp:gallery')) {
    const extraGallery = buildWpGallery(
      photoGallery.map((p: any) => ({
        url: p.imageUrl || p.url || '',
        caption: p.title || p.noiDung || '',
        alt: p.title || 'Ảnh tư liệu',
      }))
    );
    finalResult += `\n\n<!-- wp:heading {"level":3} -->\n<h3>Bộ Sưu Tập Ảnh Tư Liệu</h3>\n<!-- /wp:heading -->\n\n${extraGallery}`;
  }

  return finalResult.trim();
}

export interface WpPostPayload {
  id?: number | string | null;
  title: string;
  subtitle?: string;
  content?: string;
  contentHtml?: string;
  excerpt?: string;
  summary?: string;
  category?: string;
  postType?: 'post' | 'tong-chi' | string;
  status?: 'draft' | 'publish';
  forceUpdate?: boolean;
  photoGallery?: any[];
  date?: string;
  publishedDate?: string;
  publishedAt?: string;
}

/**
 * Lấy chi tiết bài viết từ WordPress theo ID
 */
export async function getWpPost(
  postId: number | string,
  postType: string = 'posts'
): Promise<any | null> {
  try {
    const wpBase = getWpBaseUrl();
    let { cookies, nonce } = await getWpSession();
    const endpoint = postType === 'tong-chi' ? 'tong-chi' : 'posts';
    let res = await fetch(`${wpBase}/wp-json/wp/v2/${endpoint}/${postId}?context=edit`, {
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookies,
        'X-WP-Nonce': nonce,
      },
    });

    if (res.status === 403) {
      invalidateWpSession();
      const freshSession = await getWpSession(true);
      res = await fetch(`${wpBase}/wp-json/wp/v2/${endpoint}/${postId}?context=edit`, {
        headers: {
          ...COMMON_HEADERS,
          Cookie: freshSession.cookies,
          'X-WP-Nonce': freshSession.nonce,
        },
      });
    }

    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 🌟 Tạo mới hoặc cập nhật bài viết lên WordPress Gutenberg
 * Đã sửa lỗi: Khi bài viết đã tồn tại, LUÔN cập nhật đầy đủ các trường hỗ trợ
 * (title, content, excerpt, status, categories, date) mà không chặn bởi điều kiện rỗng hay forceUpdate.
 */
export async function createOrUpdateWpPost(payload: WpPostPayload): Promise<{
  success: boolean;
  wpPostId: number;
  editUrl: string;
  isNew: boolean;
  data?: any;
}> {
  const wpBase = getWpBaseUrl();
  let { cookies, nonce } = await getWpSession();

  const postType = payload.postType === 'tong-chi' ? 'tong-chi' : 'posts';
  const rawContent = payload.contentHtml || payload.content || payload.summary || payload.subtitle || '';
  const gutenbergContent = convertToGutenbergBlocks(rawContent, payload.photoGallery);
  const excerpt = payload.excerpt || payload.summary || payload.subtitle || '';

  // Xác định Category ID
  const categorySlug = (payload.category || '').toLowerCase();
  const categoryId = WP_CATEGORIES[categorySlug] || (postType === 'posts' ? 2 : undefined);

  const postBody: Record<string, any> = {
    title: payload.title,
    status: payload.status || 'draft',
  };

  if (gutenbergContent) {
    postBody.content = gutenbergContent;
  }

  const rawDate = payload.date || payload.publishedDate || payload.publishedAt;
  if (rawDate) {
    postBody.date = formatWpDate(rawDate);
  }

  if (excerpt) {
    postBody.excerpt = excerpt;
  }

  if (postType === 'posts' && categoryId) {
    postBody.categories = [categoryId];
  }

  // 1. Nếu có ID sẵn, kiểm tra xem có tồn tại trên WordPress không
  const existingId = payload.id ? Number(payload.id) : null;
  if (existingId && !isNaN(existingId) && existingId > 0) {
    const existingPost = await getWpPost(existingId, postType);
    if (existingPost) {
      // 🛡️ Đánh dấu nguồn Next.js trước khi gửi để tránh Webhook loop
      markRecentSync(String(existingId), 'nextjs');

      let updateRes = await fetch(`${wpBase}/wp-json/wp/v2/${postType}/${existingId}`, {
        method: 'POST',
        headers: {
          ...COMMON_HEADERS,
          'Content-Type': 'application/json',
          Cookie: cookies,
          'X-WP-Nonce': nonce,
        },
        body: JSON.stringify(postBody),
      });

      if (updateRes.status === 403) {
        invalidateWpSession();
        const freshSession = await getWpSession(true);
        cookies = freshSession.cookies;
        nonce = freshSession.nonce;
        updateRes = await fetch(`${wpBase}/wp-json/wp/v2/${postType}/${existingId}`, {
          method: 'POST',
          headers: {
            ...COMMON_HEADERS,
            'Content-Type': 'application/json',
            Cookie: cookies,
            'X-WP-Nonce': nonce,
          },
          body: JSON.stringify(postBody),
        });
      }

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        throw new Error(`WordPress REST API update error (${updateRes.status}): ${errText}`);
      }

      const updatedData = await updateRes.json();
      return {
        success: true,
        wpPostId: existingPost.id,
        editUrl: `${wpBase}/wp-admin/post.php?post=${existingPost.id}&action=edit`,
        isNew: false,
        data: updatedData,
      };
    }
  }

  // 2. Nếu chưa tồn tại hoặc ID cũ không có trên hệ thống -> Tạo bài viết mới
  let createRes = await fetch(`${wpBase}/wp-json/wp/v2/${postType}`, {
    method: 'POST',
    headers: {
      ...COMMON_HEADERS,
      'Content-Type': 'application/json',
      Cookie: cookies,
      'X-WP-Nonce': nonce,
    },
    body: JSON.stringify(postBody),
  });

  if (createRes.status === 403) {
    invalidateWpSession();
    const freshSession = await getWpSession(true);
    cookies = freshSession.cookies;
    nonce = freshSession.nonce;
    createRes = await fetch(`${wpBase}/wp-json/wp/v2/${postType}`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'Content-Type': 'application/json',
        Cookie: cookies,
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify(postBody),
    });
  }

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`WordPress REST API create error (${createRes.status}): ${errText}`);
  }

  const newPost = await createRes.json();
  markRecentSync(String(newPost.id), 'nextjs');

  return {
    success: true,
    wpPostId: newPost.id,
    editUrl: `${wpBase}/wp-admin/post.php?post=${newPost.id}&action=edit`,
    isNew: true,
    data: newPost,
  };
}

/**
 * Xóa hoặc chuyển bài viết vào Thùng rác (Trash) trên WordPress
 */
export async function deleteWpPost(
  wpPostId: number,
  force: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const wpBase = getWpBaseUrl();
    let { cookies, nonce } = await getWpSession();
    markRecentSync(String(wpPostId), 'nextjs');

    let res = await fetch(`${wpBase}/wp-json/wp/v2/posts/${wpPostId}?force=${force}`, {
      method: 'DELETE',
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookies,
        'X-WP-Nonce': nonce,
      },
    });

    if (res.status === 403) {
      invalidateWpSession();
      const fresh = await getWpSession(true);
      res = await fetch(`${wpBase}/wp-json/wp/v2/posts/${wpPostId}?force=${force}`, {
        method: 'DELETE',
        headers: {
          ...COMMON_HEADERS,
          Cookie: fresh.cookies,
          'X-WP-Nonce': fresh.nonce,
        },
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `WordPress xóa thất bại (${res.status}): ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    console.warn(`[wp-admin-client] Không thể xóa WP Post #${wpPostId}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Chuẩn hóa chuỗi ngày sang định dạng WordPress REST API yêu cầu: YYYY-MM-DDTHH:MM:SS
 */
export function formatWpDate(inputDate?: string | Date | null): string {
  if (!inputDate) {
    const now = new Date();
    return formatWpDate(now);
  }

  if (typeof inputDate === 'string') {
    const trimmed = inputDate.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return `${trimmed}T08:00:00`;
    }
    const dmyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      const hour = (dmyMatch[4] || '08').padStart(2, '0');
      const minute = (dmyMatch[5] || '00').padStart(2, '0');
      const second = (dmyMatch[6] || '00').padStart(2, '0');
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
    if (trimmed.includes('T') && !trimmed.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(trimmed)) {
      const match = trimmed.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
      if (match) return match[1];
    }
  }

  const d = new Date(inputDate);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 19);
  }

  try {
    const vnDateStr = d.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
    return vnDateStr.replace(' ', 'T');
  } catch {
    return d.toISOString().slice(0, 19);
  }
}

/**
 * Cập nhật bất kỳ trường nào của bài viết lên WordPress REST API
 */
export async function updateWpPostFields(
  postId: number | string,
  fields: Record<string, any>,
  postType: string = 'posts'
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const wpBase = getWpBaseUrl();
    let { cookies, nonce } = await getWpSession();
    const endpoint = postType === 'tong-chi' ? 'tong-chi' : 'posts';

    markRecentSync(String(postId), 'nextjs');

    const payloadToSend: Record<string, any> = { ...fields };
    if (payloadToSend.date && !payloadToSend.status) {
      payloadToSend.status = 'publish';
    }

    let res = await fetch(`${wpBase}/wp-json/wp/v2/${endpoint}/${postId}`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'Content-Type': 'application/json',
        Cookie: cookies,
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify(payloadToSend),
    });

    if (res.status === 403) {
      invalidateWpSession();
      const fresh = await getWpSession(true);
      res = await fetch(`${wpBase}/wp-json/wp/v2/${endpoint}/${postId}`, {
        method: 'POST',
        headers: {
          ...COMMON_HEADERS,
          'Content-Type': 'application/json',
          Cookie: fresh.cookies,
          'X-WP-Nonce': fresh.nonce,
        },
        body: JSON.stringify(payloadToSend),
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `WordPress error (${res.status}): ${errText}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
