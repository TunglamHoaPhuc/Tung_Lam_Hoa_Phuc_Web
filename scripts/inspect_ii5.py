import urllib.request
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download'

with open(os.path.join(DOWNLOAD_DIR, 'folder_1DffwzTc1XNaDifPYeZafA3QFkA5L2VLH.html'), 'r', encoding='utf-8') as f:
    html = f.read()

# Find II.5 folder ID
idx = html.find('II.5')
if idx != -1:
    print("Found II.5 snippet:")
    print(html[idx-300:idx+300])

# Regex for all folders and files in root HTML
pattern = r'\[\[null,"([a-zA-Z0-9_-]{25,})"\][^\n]{1,500}?\[\[\["([^"]+)"'
items = re.findall(pattern, html)
for fid, fname in items:
    print(f"{fname} -> {fid}")
