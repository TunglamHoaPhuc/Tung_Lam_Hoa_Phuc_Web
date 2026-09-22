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
    '1. KINH DI GIÁO': '1fBO0jl0ETOqdXsS68LH-OFimcJgkBW7r',
    '2. PHÁP HỘI NIỆM PHẬT': '1ckRPiNmVb7HI4P_YlIg2Pf1_qYXD011r',
    '3. CỘNG TU TUỔI TRẺ': '11qERfhz40JBIB2SKtWrUhFOU-m9_T_sR',
    '4. ĐẠI LỄ SỰ KIỆN': '1807ajYfLKDGqM4BGTmUeU9rcqddXXpr8'
}

def get_folder_items(fid):
    url = f'https://drive.google.com/drive/folders/{fid}?hl=vi'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {fid}: {e}")
        return []
    
    # In Google Drive HTML, items appear in:
    # <div ... data-id="<ID>" ... aria-label="<NAME> ..." ...>
    # or in jsdata attributes or JSON
    # Let's find all divs with data-id and aria-label
    results = []
    
    # Method 1: div with data-id and aria-label
    pattern = r'<div[^>]*?data-id="([a-zA-Z0-9_-]{20,})"[^>]*?aria-label="([^"]+)"'
    for mid, mlabel in re.findall(pattern, html):
        clean_label = re.sub(r'\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary)$', '', mlabel)
        results.append({'id': mid, 'name': clean_label, 'raw_label': mlabel})
        
    # Method 2: aria-label first then data-id
    pattern2 = r'aria-label="([^"]+)"[^>]*?data-id="([a-zA-Z0-9_-]{20,})"'
    for mlabel, mid in re.findall(pattern2, html):
        clean_label = re.sub(r'\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary)$', '', mlabel)
        if not any(r['id'] == mid for r in results):
            results.append({'id': mid, 'name': clean_label, 'raw_label': mlabel})
            
    # Method 3: if data-id is not on the div directly, find data-id within 300 chars of aria-label
    if not results:
        # scan for aria-label="..." and find nearby data-id="..."
        for m in re.finditer(r'aria-label="([^"]+?)(?:\s+(?:Shared folder|Google Docs|Audio|Video|Folder|Shared|Binary))?"\s+data-handled-by-drag-and-drop', html):
            name = m.group(1)
            # look around
            pos = m.start()
            sub = html[max(0, pos-200):min(len(html), pos+300)]
            id_m = re.search(r'data-id="([a-zA-Z0-9_-]{20,})"', sub)
            fid_found = id_m.group(1) if id_m else None
            results.append({'id': fid_found, 'name': name})
            
    return results

all_drive_data = {}
for fname, fid in folders.items():
    print(f"\n=======================================================")
    print(f"FOLDER: {fname} (ID: {fid})")
    print(f"=======================================================")
    items = get_folder_items(fid)
    all_drive_data[fname] = items
    print(f"Total items found: {len(items)}")
    for i, it in enumerate(items, 1):
        print(f"  {i}. [{it.get('id')}] {it.get('name')}")

with open('c:/Users/MY PC/Tung_Lam_Hoa_Phuc_Web/scratch/drive_folders_summary.json', 'w', encoding='utf-8') as f:
    json.dump(all_drive_data, f, ensure_ascii=False, indent=2)
