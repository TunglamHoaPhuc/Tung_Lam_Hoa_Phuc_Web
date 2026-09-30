import urllib.request
import re
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def download_file(file_id, filename):
    out_path = os.path.join(DOWNLOAD_DIR, filename)
    urls = [
        f'https://drive.google.com/uc?export=download&id={file_id}',
        f'https://docs.google.com/document/d/{file_id}/export?format=docx',
        f'https://docs.google.com/document/d/{file_id}/export?format=txt',
        f'https://drive.google.com/file/d/{file_id}/view',
    ]
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                # Check if it's actual content
                if len(data) > 100:
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"Downloaded {filename} ({len(data)} bytes) from {u}")
                    return True
        except Exception as e:
            # print(f"Error {u}: {e}")
            pass
    print(f"Failed to download {filename} ({file_id})")
    return False

def inspect_folder(folder_id, folder_name):
    print(f"\n==========================================")
    print(f"INSPECTING FOLDER: {folder_name} ({folder_id})")
    print(f"==========================================")
    url = f'https://drive.google.com/drive/folders/{folder_id}'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Failed to fetch folder {folder_name}: {e}")
        return []
    
    # Save folder html
    with open(os.path.join(DOWNLOAD_DIR, f'folder_{folder_id}.html'), 'w', encoding='utf-8') as f:
        f.write(html)
        
    idRegex = r'1[a-zA-Z0-9_-]{27,34}'
    ids = list(set(re.findall(idRegex, html)))
    print(f"Found IDs in {folder_name}:", ids)
    return ids

# 1. Download root docx
download_file('1WS4q_khgltMy349fmAlVcXTU7DyIpg3r', 'II_MO_TA_CHUNG_TONG_CHI_TU_HOC.docx')

# 2. Inspect subfolders
subfolders = [
    ('1EoxQmcC66qsBhkuuRktqOStN2Nje6S3R', 'II.2. NỀN TẢNG TU HỌC'),
    ('1rvzt1pVkCLyM1i-05748OSHbL1JpQvmU', 'II.3. PHƯƠNG PHÁP HÀNH TRÌ'),
    ('1SXnyMTlcDuFK_0o-1YKeAv7nMxRXXNfS', 'II.4. LỘ TRÌNH TU HỌC'),
    ('14udPgS0FOjK_aeTL2H72J3I7MqbFP3rt', 'ITEM_14udPg'),
    ('1gRk-VgMJiZw4QpEz9P6OWyx2aEP6jkRt', 'ITEM_1gRk'),
]

for fid, fname in subfolders:
    inspect_folder(fid, fname)
