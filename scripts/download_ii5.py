import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download\all_docs'

FILES_II5 = [
    ('1b6pww9VWMlYOh-9Bijc1OogGa6qkh2ja', 'II_5_1_VAN_HOA_UNG_XU.docx'),
    ('1yv1TVBMYR419Jz3qVVLLdzEWBmfp2QXk', 'II_5_2_OAI_NGHI_NGUOI_CON_PHAT.docx'),
    ('1jYVEVhvllhf_3ha3nyub4fjr4Geex1Wz', 'II_5_3_BON_PHAN_PT_TAI_GIA.docx'),
    ('1dZfetsJqrjXMB0AMmzEXdSN2brBDB2w4', 'II_5_4_AN_CHAY.docx'),
    ('1X9MQqwEn_DmsqrxPjRyhHmg3rGSpKA87', 'II_5_5_PHONG_SINH_BV_MOI_TRUONG.docx'),
]

for fid, fname in FILES_II5:
    out_path = os.path.join(DOWNLOAD_DIR, fname)
    urls = [
        f'https://docs.google.com/document/d/{fid}/export?format=docx',
        f'https://drive.google.com/uc?export=download&id={fid}',
    ]
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 500 and not data.startswith(b'<!DOCTYPE'):
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"Downloaded {fname} ({len(data)} bytes)")
                    break
        except:
            pass
