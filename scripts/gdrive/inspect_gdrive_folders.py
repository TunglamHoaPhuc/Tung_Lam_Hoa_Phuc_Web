import urllib.request
import re
import json
import os
import sys

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

for name, fid in folders.items():
    print(f"\n=======================================================")
    print(f"FETCHING FOLDER: {name} ({fid})")
    print(f"=======================================================")
    url = f'https://drive.google.com/drive/folders/{fid}?hl=vi'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching: {e}")
        continue
    
    # Search for items pattern in Google Drive HTML
    # Typically window['_DRIVE_ivd'] or data-item-id or JSON chunks
    print(f"HTML Length: {len(html)}")
    
    # Extract titles and IDs
    # Pattern: [\"<ID>\",[\"<PARENT>\"],\"<NAME>\"...
    items = []
    
    # Try finding file names and IDs
    # Pattern in JS arrays: ["0B...", ...] or ["1...", ...]
    matches = re.findall(r'\[\\"([a-zA-Z0-9_-]{25,})\\",\[\\"[^\\"]+\\"\],\\"([^\\"]+)\\"', html)
    if matches:
        for mid, mname in matches:
            try:
                mname_clean = mname.encode('utf-8').decode('unicode_escape')
            except:
                mname_clean = mname
            items.append((mid, mname_clean))
    else:
        # Another pattern: ["<ID>",null,null,null,null,null,null,null,null,"<NAME>"
        matches2 = re.findall(r'"([a-zA-Z0-9_-]{25,})",\[\],null,null,null,null,null,null,null,"([^"]+)"', html)
        if matches2:
            for mid, mname in matches2:
                items.append((mid, mname))
        else:
            # Let's search for anything looking like file names
            names = re.findall(r'\[\\"([^\\]+?\.(?:mp3|wav|m4a|docx|mp4|pdf|xlsx|zip))\\"', html, re.IGNORECASE)
            print(f"Direct media filename matches: {len(names)}")
            for n in set(names):
                print("   -", n)

    print(f"Total structured items found: {len(items)}")
    for mid, mname in items[:25]:
        print(f"   * [{mid}] {mname}")
    if len(items) > 25:
        print(f"   ... and {len(items)-25} more items")
