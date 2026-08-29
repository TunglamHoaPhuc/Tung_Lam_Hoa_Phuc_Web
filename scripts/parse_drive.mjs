import fs from 'fs';

const filePath = 'C:\\Users\\MY PC\\.gemini\\antigravity-ide\\brain\\1dbd287e-8b0e-4ea2-9548-59a3d3ecce97\\.system_generated\\steps\\1083\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Total content length:', content.length);

// Look for file entries in Google Drive JSON payload
const regex = /\["([a-zA-Z0-9_-]{25,})",\["([^"]+)"/g;
let m;
const files = [];
while ((m = regex.exec(content)) !== null) {
  files.push({ id: m[1], name: m[2] });
}

console.log('Files found with regex 1:', files);

// Let's also scan all occurrences of file names or titles
const lines = content.split('\n');
console.log('Total lines:', lines.length);

const allStrings = [];
const strRegex = /"([^"]{4,100})"/g;
let match;
while ((match = strRegex.exec(content)) !== null) {
  const s = match[1];
  if (
    s.includes('TÔNG CHỈ') ||
    s.includes('PHÁP') ||
    s.includes('TU HỌC') ||
    s.includes('.doc') ||
    s.includes('.pdf') ||
    s.includes('.jpg') ||
    s.includes('.png') ||
    s.includes('CHƯƠNG') ||
    s.includes('BÀI') ||
    s.includes('Thầy') ||
    s.includes('Hòa Phúc')
  ) {
    allStrings.push(s);
  }
}

console.log('Filtered strings:', Array.from(new Set(allStrings)));
