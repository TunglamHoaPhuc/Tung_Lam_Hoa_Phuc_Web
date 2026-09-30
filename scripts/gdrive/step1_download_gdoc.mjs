import fs from 'fs';

async function downloadFullDoc() {
  const docId = '1j8QfYITVd55-3rE3IeaTu9sg5_Eg2NILls7NGFaeE08';
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  console.log('Downloading Google Doc from:', exportUrl);
  const res = await fetch(exportUrl);
  const text = await res.text();

  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/gdoc_full_raw.txt', text, 'utf8');
  console.log(`✅ Saved scratch/gdoc_full_raw.txt (${text.length} characters)`);
}

downloadFullDoc().catch(console.error);
