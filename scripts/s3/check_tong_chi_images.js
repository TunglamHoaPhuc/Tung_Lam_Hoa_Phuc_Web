const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/tong-chi-data.json', 'utf8'));

const wpUrls = new Set();
data.forEach(item => {
  const str = JSON.stringify(item);
  const matches = str.match(/https:\/\/admin\.tunglamhoaphuc\.com\/wp-content\/uploads\/[^\s"',\\]+/g) || [];
  matches.forEach(u => wpUrls.add(u));
});

console.log('Total unique admin.tunglamhoaphuc.com images in tong-chi-data.json:', wpUrls.size);
Array.from(wpUrls).forEach(u => console.log('WP URL:', u));
