import fs from 'fs';

const raw = fs.readFileSync('scratch/gdoc_full_raw.txt', 'utf8');
const lines = raw.split('\n');

console.log(`Total lines: ${lines.length}`);

// Find lines that look like main headers or numbers
const headers = [];
lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (
    trimmed.startsWith('STT') ||
    trimmed.startsWith('CÁC TƯỢNG PHÁP') ||
    trimmed.startsWith('CÁC TƯỢNG PHÁP') ||
    trimmed.startsWith('TÔNG CHỈ TU HỌC') ||
    trimmed.startsWith('DÒNG CHẢY HOẰNG PHÁP') ||
    trimmed.startsWith('TRÍ TUỆ PHẬT PHÁP') ||
    trimmed.startsWith('VŨ TRỤ PHẬT GIÁO') ||
    /^[0-9]+\s*$/.test(trimmed) ||
    /^(ĐỨC|PHẬT|BỒ TÁT|TÔN GIẢ|TỔ SƯ|HÒA THƯỢNG|THIỀN SƯ|QUỐC SƯ|HỘ PHÁP|THẬP)/.test(trimmed)
  ) {
    if (trimmed.length > 2 && trimmed.length < 80) {
      headers.push({ line: idx + 1, text: trimmed });
    }
  }
});

console.log(`Found ${headers.length} potential section headers:`);
console.table(headers.slice(0, 50));
