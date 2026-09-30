import urllib.request
import re
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

folders = {
    'kinh_di_giao': '1fBO0jl0ETOqdXsS68LH-OFimcJgkBW7r',
    'phap_hoi_niem_phat': '1ckRPiNmVb7HI4P_YlIg2Pf1_qYXD011r',
    'cong_tu_tuoi_tre': '11qERfhz40JBIB2SKtWrUhFOU-m9_T_sR',
    'dai_le_su_kien': '1807ajYfLKDGqM4BGTmUeU9rcqddXXpr8'
}

def parse_gdrive_folder(fid):
    url = f'https://drive.google.com/drive/folders/{fid}?hl=vi'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {fid}: {e}")
        return []
    
    # Pattern: aria-label="([^"]+?)(?:\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary))?"\s+data-handled-by-drag-and-drop="true"\s+ssk='[^']*?:([a-zA-Z0-9_-]{25,})
    results = []
    matches = re.finditer(r'aria-label="([^"]+?)(?:\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary))?"\s+data-handled-by-drag-and-drop="true"\s+ssk=\'[^\']*?:([a-zA-Z0-9_-]{25,})', html)
    for m in matches:
        raw_name = m.group(1).strip()
        file_id = m.group(2).strip()
        # Clean type suffix if present
        is_folder = 'Shared folder' in html[m.start():m.end()+50] or not ('.' in raw_name)
        results.append({
            'name': raw_name,
            'id': file_id,
            'is_folder': is_folder
        })
    return results

all_data = {}
for k, fid in folders.items():
    print(f"\n=======================================================")
    print(f"FOLDER: {k} (ID: {fid})")
    print(f"=======================================================")
    items = parse_gdrive_folder(fid)
    all_data[k] = items
    for i, it in enumerate(items, 1):
        print(f"  {i}. [{'DIR' if it['is_folder'] else 'FILE'}] {it['name']} -> {it['id']}")

with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/parsed_root_folders.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
