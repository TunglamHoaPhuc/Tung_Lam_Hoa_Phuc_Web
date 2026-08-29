import fs from 'fs';

const raw = fs.readFileSync('scratch/gdoc_full_raw.txt', 'utf8');
const lines = raw.split('\n');

for (let i = 0; i < Math.min(lines.length, 120); i++) {
  const line = lines[i];
  if (line.trim()) {
    console.log(`[L${i + 1}] ${line.replace(/\t/g, ' [TAB] ').slice(0, 140)}`);
  }
}
