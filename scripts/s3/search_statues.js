const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/statues-database.json', 'utf8'));

const targets = ['duoc', 'di lac', 'tieu dien', 'dao hanh', 'linh quy'];

console.log('Total statues:', data.length);
data.forEach(s => {
  const name = (s.name || '').toLowerCase();
  const slug = (s.slug || '').toLowerCase();
  const title = (s.title || '').toLowerCase();
  const imgUrl = (s.imgUrl || '').toLowerCase();

  for (const t of targets) {
    if (name.includes(t) || slug.includes(t) || title.includes(t) || imgUrl.includes(t)) {
      console.log(`Match [${t}]: id=${s.id} | slug=${s.slug} | name=${s.name} | imgRotation=${s.imgRotation} | imgUrl=${s.imgUrl}`);
      break;
    }
  }
});
