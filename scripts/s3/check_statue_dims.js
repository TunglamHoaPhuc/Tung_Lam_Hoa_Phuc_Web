const fs = require('fs');
const https = require('https');

const targetIds = ['TP0018', 'TP0019', 'TP0043', 'TP0044', 'TP0057', 'TP0079', 'TP0080', 'TP0091'];
const data = JSON.parse(fs.readFileSync('src/data/statues-database.json', 'utf8'));

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (d) => {
        chunks.push(d);
        if (chunks.reduce((a, c) => a + c.length, 0) > 65536) {
          res.destroy();
          resolve(Buffer.concat(chunks));
        }
      });
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', () => resolve(null));
    });
  });
}

async function main() {
  const sharp = require('sharp');
  for (const id of targetIds) {
    const s = data.find(item => item.id === id);
    if (!s || !s.imgUrl) continue;
    try {
      const buf = await checkUrl(s.imgUrl);
      if (buf) {
        const meta = await sharp(buf).metadata();
        console.log(`${s.id} | ${s.name} | ${meta.width}x${meta.height} (ratio ${(meta.width/meta.height).toFixed(2)}) | rot=${s.imgRotation} | ${s.imgUrl}`);
      }
    } catch (e) {
      console.log(`${s.id} error:`, e.message);
    }
  }
}

main().catch(console.error);
