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

subfolders = {
    # Kinh Di Giao
    'Kinh Di Giao 01': '1hFgvNsk-h1l2xWX8I1qpTYAp7XbHExgP',
    'Kinh Di Giao 02': '1Nf_MfF9Y-yvl6POTosVIHXRmulmAFEjb',
    'Kinh Di Giao 03': '1hJmhBeCz_6F0ifjwggvYIL76sQCZc3jx',
    # Dai le su kien
    'Phat Dan 2025': '1VPnc2yZohkYxodEKqEWjNeoPbiEYwB3D',
    'Phat Dan 2026': '1SASXRbxBlEQXj2RTTLAL8Bcgon1EHx4X',
    # Cong tu tuoi tre
    'CTTT 09.2026': '1az0SNDRq03tGXyV_KJRRlMw__f8pbnkR',
    'CTTT 05.2026': '1FboZlzquRdMI9NCfLnl0CT6ajShIUczv',
    'CTTT Le Vao He 2026': '1StHXpqWYK_rUVSgyDTonlLGaqMFP2jnj',
    # Phap hoi niem phat
    'PHNP 03': '1smvoxTnNgpue6ozbKfegW9UwR-fuJhrP',
    'PHNP 04': '1FZqa2EXExvFg3N_pZ2ukx0zwdXv5wDxQ',
    'PHNP 05': '1e6PR71xYImtsTTevHZ9ULKOVwc8HDiIa',
    'PHNP 06': '1JRfVZ37mRvltcPJ0Joa5tUlmowy5DE4j',
    'PHNP 07': '1_TwGW5LNmnYv8Rdte8cReCwlSGug7xMd'
}

all_sub_data = {}
for name, fid in subfolders.items():
    print(f"\n--- {name} ({fid}) ---")
    items = parse_gdrive_folder(fid)
    all_sub_data[name] = items
    print(f"Items ({len(items)}):")
    for it in items:
        print(f"  [{'DIR' if it['is_folder'] else 'FILE'}] {it['name']} -> {it['id']}")

with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/all_subfolders_items.json', 'w', encoding='utf-8') as f:
    json.dump(all_sub_data, f, ensure_ascii=False, indent=2)
