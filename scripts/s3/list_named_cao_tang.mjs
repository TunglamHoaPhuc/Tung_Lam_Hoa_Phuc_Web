import fs from 'fs';

const raw = fs.readFileSync('scratch/cao_tang_s3_files.json', 'utf-8');
const files = JSON.parse(raw);

console.log(`Total files: ${files.length}`);
console.log('Sample filenames:');
files.forEach(f => {
  const name = f.split('/').pop();
  if (!name.startsWith('Untitled')) {
    console.log(` - ${f}`);
  }
});
