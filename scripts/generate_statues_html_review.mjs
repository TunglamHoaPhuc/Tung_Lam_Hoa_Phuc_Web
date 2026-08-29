import fs from 'fs';

const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));
const statueKeys = s3Keys.filter(k => k.includes('bao_tuong_phat_giao') && k.endsWith('.webp'));

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Review All Statues Orientation</title>
  <style>
    body { background: #1a1a1a; color: #fff; font-family: sans-serif; padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .card { background: #2a2a2a; border-radius: 8px; overflow: hidden; padding: 8px; text-align: center; }
    .img-box { width: 100%; height: 260px; display: flex; align-items: center; justify-content: center; background: #111; overflow: hidden; }
    img { max-width: 100%; max-height: 100%; object-fit: contain; }
    p { font-size: 11px; word-break: break-all; margin: 8px 0 0; color: #ccc; }
  </style>
</head>
<body>
  <h1>Tất cả ảnh Tôn Tượng (${statueKeys.length} ảnh)</h1>
  <div class="grid">
`;

for (const k of statueKeys) {
  const url = `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${k}`;
  html += `
    <div class="card">
      <div class="img-box">
        <img src="${url}" loading="lazy" />
      </div>
      <p>${k.split('/').pop()}</p>
    </div>
  `;
}

html += `
  </div>
</body>
</html>
`;

fs.writeFileSync('public/review_statues.html', html, 'utf8');
console.log('✅ Generated public/review_statues.html');
