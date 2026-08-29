async function checkWP() {
  try {
    const res = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/posts?per_page=50&_embed');
    const posts = await res.json();
    console.log(`Found ${posts.length} standard posts:`);
    posts.forEach(p => console.log(`- [${p.id}] ${p.title?.rendered} (${p.link})`));

    const resTypes = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/types');
    const types = await resTypes.json();
    console.log('Post types available:', Object.keys(types));
  } catch (e) {
    console.error('Error fetching WP:', e.message);
  }
}

checkWP();
