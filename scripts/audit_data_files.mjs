import fs from 'fs';
import path from 'path';

const dataFiles = fs.readdirSync('src/data').filter(f => f.endsWith('.ts') || f.endsWith('.json'));

for (const file of dataFiles) {
  const content = fs.readFileSync(path.join('src/data', file), 'utf8');
  const s3Matches = content.match(/https:\/\/[^\s"'`]+backblazeb2[^\s"'`]+/g) || [];
  const localMatches = content.match(/['"]\/images\/[^'"]+['"]/g) || [];
  console.log(`${file}: S3 URLs = ${s3Matches.length}, Local /images = ${localMatches.length}`);
}
