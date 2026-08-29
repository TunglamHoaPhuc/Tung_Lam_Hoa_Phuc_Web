import fs from 'fs';

const filePath = 'C:\\Users\\MY PC\\.gemini\\antigravity-ide\\brain\\1dbd287e-8b0e-4ea2-9548-59a3d3ecce97\\.system_generated\\steps\\1083\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Find all occurrences of document names and search backwards/forwards for IDs
const names = [
  'II. MÔ TẢ CHUNG TÔNG CHỈ TU HỌC.docx',
  'II.2. NỀN TẢNG TU HỌC',
  'II.3. PHƯƠNG PHÁP HÀNH TRÌ',
  'II.4. LỘ TRÌNH TU HỌC',
];

for (const name of names) {
  let idx = 0;
  while ((idx = content.indexOf(name, idx)) !== -1) {
    console.log(`\n--- FOUND ${name} at pos ${idx} ---`);
    const snippet = content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 500));
    console.log(snippet);
    idx += name.length;
  }
}
