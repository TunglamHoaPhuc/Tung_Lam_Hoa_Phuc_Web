import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\public\images\tong-chi'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# URL candidates for Chùa Định Thành, HT Thích Lệ Trang, Chùa Huệ Nghiêm, HT Thích Minh Thông
images_to_fetch = [
    {
        'name': 'chua-dinh-thanh-ht-thich-le-trang.jpg',
        'urls': [
            'https://phatgiao.org.vn/images/2022/07/28/chua-dinh-thanh-thich-le-trang.jpg',
            'https://giacngo.vn/files/f1/2022/07/28/chua-dinh-thanh.jpg',
            'https://static.giacngo.vn/images/2023/11/ht-thich-le-trang.jpg',
        ]
    },
    {
        'name': 'chua-hue-nghiem-luat-vien.jpg',
        'urls': [
            'https://phatgiao.org.vn/images/2021/04/15/chua-hue-nghiem-binh-tan.jpg',
            'https://giacngo.vn/files/f1/2021/04/15/chua-hue-nghiem.jpg',
        ]
    },
    {
        'name': 'tuyen-luat-su-thich-minh-thong.jpg',
        'urls': [
            'https://giacngo.vn/files/f1/2022/10/ht-thich-minh-thong.jpg',
            'https://phatgiao.org.vn/images/2022/10/ht-thich-minh-thong-luat-su.jpg',
        ]
    }
]

for item in images_to_fetch:
    dest = os.path.join(DOWNLOAD_DIR, item['name'])
    for u in item['urls']:
        try:
            req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                if len(data) > 1000 and not data.startswith(b'<!DOCTYPE'):
                    with open(dest, 'wb') as f:
                        f.write(data)
                    print(f"Downloaded {item['name']} ({len(data)} bytes) from {u}")
                    break
        except Exception as e:
            pass
    if not os.path.exists(dest):
        print(f"Could not download {item['name']}, will use local fallback or copy")
