async function fetchGDoc() {
  try {
    const docId = '1j8QfYITVd55-3rE3IeaTu9sg5_Eg2NILls7NGFaeE08';
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const res = await fetch(exportUrl);
    if (res.ok) {
      const text = await res.text();
      console.log(`✅ Successfully fetched Google Doc (${text.length} chars):`);
      console.log(text.slice(0, 1000));
      return;
    }
    console.log('Export format txt status:', res.status);
  } catch (e) {
    console.error('Error fetching GDoc:', e.message);
  }
}

fetchGDoc();
