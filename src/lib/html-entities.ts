/**
 * 🪷 BỘ GIẢI MÃ THỰC THỂ HTML (HTML ENTITY DECODER) CHUẨN XÁC TOÀN DIỆN
 * Tự động chuyển đổi toàn bộ các mã ký tự HTML do WordPress Gutenberg / WordPress REST API sinh ra:
 * &#8220; -> “ (ngoặc kép mở)
 * &#8221; -> ” (ngoặc kép đóng)
 * &#8216; -> ‘ (ngoặc đơn mở)
 * &#8217; -> ’ (ngoặc đơn đóng)
 * &#8230; -> … (dấu ba chấm)
 * &#8211; -> – (gạch ngang ngắn)
 * &#8212; -> — (gạch ngang dài)
 * &#8243; -> ″ (kép phút/giây)
 * &quot; -> "
 * &amp; -> &
 * &#038; -> &
 * &nbsp; -> khoảng trắng
 * Và toàn bộ các mã thập phân/thập lục phân &#...; khác.
 */

export function decodeHtmlEntities(text?: string | null): string {
  if (!text) return '';
  return text
    // Dấu ngoặc kép & đơn thông minh (Smart quotes)
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8243;/g, '″')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    // Dấu gạch ngang & ba chấm
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    // Dấu và & khoảng trắng
    .replace(/&amp;|&#038;|&#38;/g, '&')
    .replace(/&nbsp;|&#160;/g, ' ')
    // Dấu so sánh & ký hiệu bản quyền
    .replace(/&bull;/g, '•')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    // Giải mã bất kỳ mã số thập phân hoặc hex còn sót lại
    .replace(/&#(\d+);/g, (_m, dec) => {
      const code = parseInt(dec, 10);
      return code >= 32 ? String.fromCharCode(code) : '';
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
      const code = parseInt(hex, 16);
      return code >= 32 ? String.fromCharCode(code) : '';
    })
    .normalize('NFC');
}
