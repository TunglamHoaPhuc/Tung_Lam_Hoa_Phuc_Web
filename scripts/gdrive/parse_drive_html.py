import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = 'https://drive.google.com/drive/folders/1fBO0jl0ETOqdXsS68LH-OFimcJgkBW7r?hl=vi'
req = urllib.request.Request(url, headers=HEADERS)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Save sample HTML
with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/sample_gdrive.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved sample_gdrive.html. Length:", len(html))

# Search for any occurrences of filenames or Vietnamese keywords or extensions
for ext in ['mp3', 'wav', 'docx', 'm4a', 'zip', 'mp4', 'KDG', 'Di Giáo', 'Kinh']:
    found = [m.start() for m in re.finditer(ext, html, re.IGNORECASE)]
    print(f"Keyword '{ext}': {len(found)} occurrences")
    for pos in found[:3]:
        snippet = html[max(0, pos-60):min(len(html), pos+60)]
        print("   Snippet:", repr(snippet))
