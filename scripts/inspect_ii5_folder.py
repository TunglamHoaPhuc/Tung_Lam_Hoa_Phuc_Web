import urllib.request
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download'

url = 'https://drive.google.com/drive/folders/1WS4q_khgltMy349fmAlVcXTU7DyIpg3r'
req = urllib.request.Request(url, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    pattern = r'\[\[null,"([a-zA-Z0-9_-]{25,})"\][^\n]{1,500}?\[\[\["([^"]+)"'
    items = re.findall(pattern, html)
    print("Items in II.5 folder:")
    for fid, fname in items:
        print(f" -> {fname} ({fid})")
except Exception as e:
    print(f"Error: {e}")
