import re

with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/sample_gdrive.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Look for aria-label or data-id
print("Searching for items in HTML...")
items = re.findall(r'aria-label="([^"]+?)(?:\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary))?"\s+data-handled-by-drag-and-drop', html)
print(f"Found aria-labels: {len(items)}")
for it in items:
    print("  *", it)

# Look for data-id or IDs associated with these labels
# Let's inspect the tags containing aria-label
tags = re.findall(r'(<div[^>]*aria-label="[^"]+"[^>]*>)', html)
print(f"\nFound divs: {len(tags)}")
for t in tags[:10]:
    print("  div:", t)

# Look for IDs in nearby data attributes
id_matches = re.findall(r'data-id="([a-zA-Z0-9_-]{20,})"', html)
print(f"\ndata-id matches: {len(id_matches)}")
for i in id_matches[:10]:
    print("  id:", i)

# Look for pattern: [\"<ID>\", ... \"<NAME>\"]
blob_matches = re.findall(r'\["([a-zA-Z0-9_-]{25,})"[^\]]*?"([^"\\]+?\.(?:m4a|mp3|wav|docx|pdf|zip))"', html)
print(f"\nBlob matches: {len(blob_matches)}")
for b in blob_matches[:10]:
    print("  blob:", b)
