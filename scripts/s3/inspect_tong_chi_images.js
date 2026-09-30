const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/tong-chi-data.json', 'utf8'));

console.log('Total items in tong-chi-data.json:', data.length);
data.forEach(item => {
  const isWpBanner = item.bannerImage && item.bannerImage.includes('admin.tunglamhoaphuc.com');
  const isWpFeat = item.featuredImage && item.featuredImage.includes('admin.tunglamhoaphuc.com');
  console.log(`[ID ${item.id}] [${item.category}] ${item.title}`);
  console.log(`   slug: ${item.slug}`);
  console.log(`   banner: ${item.bannerImage} (isWp: ${isWpBanner})`);
  if (item.featuredImage) {
    console.log(`   featured: ${item.featuredImage} (isWp: ${isWpFeat})`);
  }
});
