const fs = require('fs');
const https = require('https');
const sharp = require('sharp');
const data = JSON.parse(fs.readFileSync('src/data/statues-database.json', 'utf8'));

// Check all statues related to Duoc Su or Di Lac
const candidates = data.filter(s => {
  const str = (s.name + ' ' + s.slug).toLowerCase();
  return str.includes('duoc_su') || str.includes('dược sư') || str.includes('di_lac') || str.includes('di lặc');
});

console.log('Candidates count:', candidates.length);
candidates.forEach(c => {
  console.log(c.id, '|', c.name, '| rot:', c.imgRotation, '| url:', c.imgUrl);
});
