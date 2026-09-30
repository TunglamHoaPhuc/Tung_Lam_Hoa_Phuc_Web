import urllib.request
import urllib.parse
import re
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def download_gdrive_file(file_id, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100000:
        print(f"  [Đã có sẵn]: {os.path.basename(dest_path)} ({os.path.getsize(dest_path)/(1024*1024):.2f} MB)")
        return True

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    # Try different download URLs
    urls = [
        f'https://drive.usercontent.google.com/download?id={file_id}&export=download&authuser=0',
        f'https://drive.google.com/uc?export=download&id={file_id}',
    ]
    
    # For Google Docs/Word
    if dest_path.endswith('.docx'):
        urls.insert(0, f'https://docs.google.com/document/d/{file_id}/export?format=docx')
    elif dest_path.endswith('.txt'):
        urls.insert(0, f'https://docs.google.com/document/d/{file_id}/export?format=txt')
        
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            opener = urllib.request.build_opener()
            with opener.open(req, timeout=60) as resp:
                content_type = resp.headers.get('Content-Type', '')
                
                # Check for virus scan warning page
                initial_chunk = resp.read(8192)
                if b'confirm=' in initial_chunk or b'download_warning' in initial_chunk or b'Google Drive - C' in initial_chunk:
                    # Parse confirm token from HTML
                    html_str = initial_chunk.decode('utf-8', errors='ignore')
                    m_confirm = re.search(r'confirm=([0-9A-Za-z_-]+)', html_str)
                    token = m_confirm.group(1) if m_confirm else 't'
                    confirm_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm={token}&authuser=0"
                    
                    req_confirm = urllib.request.Request(confirm_url, headers=HEADERS)
                    with opener.open(req_confirm, timeout=120) as resp_c:
                        with open(dest_path, 'wb') as f:
                            while True:
                                chunk = resp_c.read(1024*512)
                                if not chunk:
                                    break
                                f.write(chunk)
                        sz = os.path.getsize(dest_path)
                        print(f"  ✓ Tải thành công (confirmed): {os.path.basename(dest_path)} ({sz/(1024*1024):.2f} MB)")
                        return True
                else:
                    with open(dest_path, 'wb') as f:
                        f.write(initial_chunk)
                        while True:
                            chunk = resp.read(1024*512)
                            if not chunk:
                                break
                            f.write(chunk)
                    sz = os.path.getsize(dest_path)
                    if sz > 500:
                        print(f"  ✓ Tải thành công: {os.path.basename(dest_path)} ({sz/(1024*1024):.2f} MB)")
                        return True
        except Exception as e:
            # try next url
            pass
            
    print(f"  ✗ Không thể tải: {os.path.basename(dest_path)} (ID: {file_id})")
    return False

# Master download queue
base_out = r'E:\VIDEO AND SOUND\POSTCAST\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH'

download_tasks = [
    # ── 1. KINH DI GIÁO ──
    {
        'category': '07_SERIES_KINH_DI_GIAO_PPUD',
        'items': [
            ('1HXkHi0iyhrngreK0t7PG6UkNgvBoD9IF', 'Kinh Di Giáo - Buổi 01 (Bản Gốc).mp3'),
            ('1btFa06_DDTnBho0cE66K1V6gSNfeoPId', 'Kinh Di Giáo - Buổi 02 (Bản Gốc).m4a'),
            ('1qSr34bX6pCEeE3QRvMTHVh3zsvs7TuZY', 'Kinh Di Giáo - Buổi 03 (Bản Gốc).m4a'),
            ('1sLCMJEgDSaHUABvUouL6HHTSOJ7ebBGv', 'Kinh Di Giáo - Buổi 04 - Sư Phụ Tâm Hòa (Chùa Hoằng Pháp).m4a'),
            ('1dhYzIoqq_Gi5s8K7CiGRmj81OaHqAVa7', 'Kinh Di Giáo - Buổi 05 (Bản Gốc).m4a'),
        ]
    },
    # ── 2. PHÁP HỘI NIỆM PHẬT ──
    {
        'category': '06_SERIES_PHAP_HOI_NIEM_PHAT_CTNP',
        'items': [
            ('1_ZZrI1wWdm4ACpP5CJRKiADhcdPH2b9Y', 'PHNP Tháng 03 - Kinh A Hàm Giới Luật Pháp Vị Tăng Hữu - ĐĐ. Thích Tâm Hòa.m4a'),
            ('1XCeJB7bRxAG5uwIS7MRX3X0CpypuxdfX', 'PHNP Tháng 04 - Kinh A Hàm (Bản Gốc) - ĐĐ. Thích Tâm Hòa.m4a'),
            ('1GNBuSwvSDdMvZn3RP7Zlp63uv8FSnGGp', 'PHNP Tháng 04 - Tóm tắt Kinh A Hàm.docx'),
            ('1Gp8sCcADi9ikgNQFUMJTt0mTLwu4CS4P', 'PHNP Tháng 05 - Hương Vị Giải Thoát Thứ 8 & Xả Pháp Y - ĐĐ. Thích Tâm Hòa.m4a'),
            ('193JFCWS1Q90t6b2L4y1K6CRKUSt5S7eY', 'PHNP Tháng 06 - Pháp Vị Tăng Hữu Số 8 Xả Pháp Y Thập Thiện - ĐĐ. Thích Tâm Hòa.m4a'),
            ('1YNo7EQnUjQJA4sa8aESdvURZYU6VMlqJ', 'PHNP Tháng 06 - Truyền Pháp Y Thập Thiện - ĐĐ. Thích Tâm Hòa.m4a'),
        ]
    },
    # ── 3. CỘNG TU TUỔI TRẺ ──
    {
        'category': '09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU',
        'items': [
            ('13HVQjevFt_y4_mnREhz7l-Oidd0Hd12b', 'CTTT Tháng 09.2026 - Thầy Tâm Hòa Khai Khóa Pháp Thoại.m4a'),
            ('1LXmbVY-M_arba08wA5uuxh_p3DUTvvtw', 'CTTT Tháng 09.2026 - Sư Phụ Chia Sẻ Đại Lễ Vu Lan.m4a'),
            ('1wj7upEHmGF13hE2-OqKMCnQpWeHDV7UM', 'CTTT Tháng 09.2026 - Lễ Truyền Thọ Tam Quy Ngũ Giới.m4a'),
            ('1VpK5pOk3CrzlKLBJIrIVfe1gakbG-8WQ', 'CTTT Tháng 09.2026 - Pháp Thoại Ngắn Sau Thời Khóa Tụng Kinh.m4a'),
            ('11grmww9XrBZPDxKCUUC0JzMZ2LOxRQfl', 'CTTT - Lễ Vào Hè 2026.m4a'),
        ]
    },
    # ── 4. ĐẠI LỄ SỰ KIỆN ──
    {
        'category': '10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI',
        'items': [
            ('1cX1PcdPHS3HQIwOiHDF6J9rh_GnzDj8v', 'Đại Lễ Phật Đản 2026 - Khai Mạc & Pháp Thoại Sư Phụ.m4a'),
            ('1UZ606Vy79ZTk7450l9jg8j4E0NEQNe_z', 'Đại Lễ Phật Đản 2026 - Bài Khai Mạc.docx'),
            ('1mgUdYNYKYCPcMWwgUBtiu8F-ngtJNYnT', 'Đại Lễ Phật Đản 2026 - Lễ Quy Y Tam Bảo.m4a'),
            ('1L0AJAqYWLnTCRBMe82yW4WL4nYfT3R-K', 'Đại Lễ Phật Đản 2026 - Nghi Thức Quy Y.docx'),
            ('14CmZTZzkeAHvLcsQO3gHtw6xKpkC8bx1', 'Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 3).m4a'),
            ('1kRcR2Vfo4u9IJ10xcH4aoQ8c7tNqkjDV', 'Đại Lễ Phật Đản 2025 - Ghi Chú Bồ Đề Tâm Buổi 3.docx'),
            ('1EHGLEt3DQ0b6vrwDH8I-z8Yjf-2uSHTK', 'Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 2).m4a'),
        ]
    }
]

print("==================================================================")
print("🚀 BẮT ĐẦU TẢI DỮ LIỆU TỪ GOOGLE DRIVE VÀO DUY NHẤT 1 NƠI:")
print(f"👉 {base_out}")
print("==================================================================")

total_files = sum(len(t['items']) for t in download_tasks)
curr = 0

for target in download_tasks:
    cat_dir = os.path.join(base_out, target['category'])
    print(f"\n📂 [{target['category']}]")
    for fid, fname in target['items']:
        curr += 1
        print(f"[{curr}/{total_files}] Đang xử lý: {fname}...")
        out_file = os.path.join(cat_dir, fname)
        download_gdrive_file(fid, out_file)

print("\n==================================================================")
print("🎉 HOÀN TẤT TẢI VÀ BỔ SUNG TOÀN BỘ 4 THƯ MỤC GOOGLE DRIVE!")
print("==================================================================")
