import urllib.request
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

file_id = '1HXkHi0iyhrngreK0t7PG6UkNgvBoD9IF' # CT_HPHP_KINHDIGIAO_01_ORIGINAL.mp3
filename = 'test_kdg_01.mp3'

url = f'https://drive.usercontent.google.com/download?id={file_id}&export=download&authuser=0'
req = urllib.request.Request(url, headers=HEADERS)
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        content_type = resp.headers.get('Content-Type', '')
        content_length = resp.headers.get('Content-Length', '')
        print(f"Content-Type: {content_type}, Content-Length: {content_length}")
        data = resp.read(1000)
        print("First 100 bytes:", data[:100])
        if b'confirm=' in data:
            print("Virus scan confirmation required!")
except Exception as e:
    print("Download error:", e)
