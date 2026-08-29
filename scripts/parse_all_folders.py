import re
import os
import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download'

def parse_html(file_path):
    print(f"\n=======================================================")
    print(f"PARSING: {file_path}")
    print(f"=======================================================")
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Pattern for item entries in Google Drive
    # Match: [[null,"<ID>"],null,null,null,"<MIME>" ... [[["<TITLE>",null,1]]]
    # Or in JS: \x5b\x22<ID>\x22,\x5b\x22<PARENT>\x22\x5d,\x22<NAME>\x22,\x22<MIME>\x22
    
    # 1. Search for title text with strong tags or aria-label
    titles = re.findall(r'aria-label="([^"]+)"', html)
    print("Aria labels found:", [t for t in set(titles) if len(t) > 3 and not t.startswith('Google')][:20])
    
    # 2. Extract item rows:
    # Pattern in JS arrays
    raw_matches = re.findall(r'\[\\"([a-zA-Z0-9_-]{25,})\\",\[\\"[^\\"]+\\"\],\\"([^\\"]+)\\",\\"([^\\"]+)\\"', html)
    print(f"Raw JS items matched: {len(raw_matches)}")
    for fid, name, mime in raw_matches:
        try:
            name_clean = name.encode('utf-8').decode('unicode_escape')
        except:
            name_clean = name
        print(f" -> [{mime}] {name_clean} (ID: {fid})")
        
    # Also check string patterns with docx / txt / pdf / jpg
    files = re.findall(r'\[\[null,"([a-zA-Z0-9_-]{25,})"\][^\n]{1,500}?\[\[\["([^"]+)"', html)
    print(f"Pattern 2 items matched: {len(files)}")
    for fid, name in files:
        print(f" -> {name} (ID: {fid})")

for fname in os.listdir(DOWNLOAD_DIR):
    if fname.endswith('.html'):
        parse_html(os.path.join(DOWNLOAD_DIR, fname))
