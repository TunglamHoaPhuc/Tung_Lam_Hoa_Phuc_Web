async function checkAllWP() {
  try {
    const resTongChi = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?per_page=100');
    const tongChi = await resTongChi.json();
    console.log(`\nFound ${tongChi.length} tong-chi posts:`);
    tongChi.forEach(p => console.log(`- [${p.id}] ${p.title?.rendered}`));

    const resPages = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/pages?per_page=100');
    const pages = await resPages.json();
    console.log(`\nFound ${pages.length} pages:`);
    pages.forEach(p => console.log(`- [${p.id}] ${p.title?.rendered}`));
  } catch (e) {
    console.error('Error fetching WP:', e.message);
  }
}

checkAllWP();
