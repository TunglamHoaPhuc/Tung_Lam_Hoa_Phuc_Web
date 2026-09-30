const fs = require('fs');
const https = require('https');
const path = require('path');
const sharp = require('sharp');

const targetIds = ['TP0018', 'TP0019', 'TP0043', 'TP0044', 'TP0057', 'TP0079', 'TP0080', 'TP0091'];
const data = JSON.parse(fs.readFileSync('src/data/statues-database.json', 'utf8'));

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  const tmpDir = path.resolve('scripts/tmp_images');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  for (const id of targetIds) {
    const s = data.find(i => i.id === id);
    if (!s || !s.imgUrl) continue;
    const dest = path.join(tmpDir, `${id}.webp`);
    try {
      await download(s.imgUrl, dest);
      const meta = await sharp(dest).metadata();
      console.log(`${s.id} | ${s.name} | ${meta.width}x${meta.height} (ratio ${(meta.width/meta.height).toFixed(2)}) | url: ${path.basename(s.imgUrl)}`);
    } catch (e) {
      console.log(`${s.id} error:`, e.message);
    }
  }
}

main().catch(console.error);
