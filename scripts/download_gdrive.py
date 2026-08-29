import urllib.request
import re
import json
import os

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def fetch_folder_items(folder_id):
    url = f'https://drive.google.com/drive/folders/{folder_id}'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching folder {folder_id}: {e}")
        return []
    
    # Save folder HTML for debug
    with open(os.path.join(DOWNLOAD_DIR, f'folder_{folder_id}.html'), 'w', encoding='utf-8') as f:
        f.write(html)
        
    items = []
    # Match pattern: ["<ID>",["<PARENT_ID>"],"<NAME>","<MIME_TYPE>"
    # Pattern in JS data: \x5b\x22([a-zA-Z0-9_-]{25,})\x22,\x5b\x22[^\x22]+\x22\x5d,\x22([^\x22]+)\x22,\x22([^\x22]+)\x22
    pattern = r'\[\\"([a-zA-Z0-9_-]{20,})\\",\[\\"[^\\"]+\\"\],\\"([^\\"]+)\\",\\"([^\\"]+)\\"'
    for m in re.finditer(pattern, html):
        file_id, name, mime = m.groups()
        # unescape unicode
        name = name.encode().decode('unicode_escape')
        items.append({'id': file_id, 'name': name, 'mime': mime})
        
    # Also test another pattern: ["<ID>",null,null,null,"<MIME>" ... "<NAME>"
    pattern2 = r'\[\[null,"([a-zA-Z0-9_-]{20,})"\][^\n]{1,300}?"([^"\n]+)"'
    
    print(f"Folder {folder_id} found {len(items)} items.")
    return items

def download_file(file_id, name, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    # try direct download
    urls = [
        f'https://drive.google.com/uc?export=download&id={file_id}',
        f'https://docs.google.com/document/d/{file_id}/export?format=docx',
        f'https://docs.google.com/document/d/{file_id}/export?format=txt',
    ]
    out_path = os.path.join(out_dir, name)
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                if len(data) > 200 and not data.startswith(b'<!DOCTYPE'):
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"Downloaded: {name} ({len(data)} bytes) from {u}")
                    return True
        except Exception as e:
            pass
    print(f"Failed to download binary for {name} ({file_id})")
    return False

root_id = '1DffwzTc1XNaDifPYeZafA3QFkA5L2VLH'
items = fetch_folder_items(root_id)
for it in items:
    print(it)
