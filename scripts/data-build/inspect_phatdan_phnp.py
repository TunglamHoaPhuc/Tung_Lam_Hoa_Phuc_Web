import urllib.request
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def clean_id(raw_id):
    if not raw_id:
        return ""
    return re.sub(r'-\d+-\d+$', '', raw_id).strip()

def parse_gdrive_folder(fid):
    fid = clean_id(fid)
    url = f'https://drive.google.com/drive/folders/{fid}?hl=vi'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {fid}: {e}")
        return []
    
    results = []
    matches = re.finditer(r'aria-label="([^"]+?)(?:\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary))?"\s+data-handled-by-drag-and-drop="true"\s+ssk=\'[^\']*?:([a-zA-Z0-9_-]{25,}[^\']*)', html)
    for m in matches:
        raw_name = m.group(1).strip()
        raw_id = m.group(2).strip()
        cid = clean_id(raw_id)
        is_folder = not ('.' in raw_name) or 'folder' in m.group(0).lower()
        results.append({
            'name': raw_name,
            'id': cid,
            'is_folder': is_folder
        })
    return results

# Deep inspection targets
targets = {
    'PHATDAN_2025_02': '1Ld6JVEOLndTcBye8t3A7_FQvHeBHNX0Y',
    'PHATDAN_2025_03': '1z5DiPXWr92Atfh9NCOj7673KP_cfJedT',
    'PHATDAN_2026_KM': '1EZ6EbiFvamWPxbH6d5E1-6vPr-lY7GQg',
    'PHATDAN_2026_QUYY': '1Y737PQJtTB2VzG5SsLqpmQyRLYf-Dx-d',
    'PHNP_03_AUDIO': '11sNZVtx8cf4plcyTsg2PZGESFDdXgwFZ',
    'PHNP_04_AHAM': '15p687hirmOWdG6WVBMOQVG2VHswDfkvg',
    'PHNP_04_KM': '1dIUI9qVOWbg8c3OKRQeKkL7kxY5sj8bn'
}

for name, fid in targets.items():
    print(f"\n=== {name} ({fid}) ===")
    items = parse_gdrive_folder(fid)
    for it in items:
        print(f"  [{'DIR' if it['is_folder'] else 'FILE'}] {it['name']} -> {it['id']}")
