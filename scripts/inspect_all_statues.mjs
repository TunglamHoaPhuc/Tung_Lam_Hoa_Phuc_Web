import sharp from 'sharp';
import fs from 'fs';

async function checkAll() {
  const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));
  const statueKeys = s3Keys.filter(k => k.includes('bao_tuong_phat_giao') && k.endsWith('.webp'));

  console.log(`Checking ${statueKeys.length} statue keys...`);
  const report = [];

  for (const k of statueKeys.slice(0, 30)) {
    try {
      const url = `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${k}`;
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      report.push({ key: k, width: meta.width, height: meta.height, ratio: (meta.width / meta.height).toFixed(2) });
    } catch (e) {
      report.push({ key: k, error: e.message });
    }
  }

  console.table(report);
}

checkAll().catch(console.error);
