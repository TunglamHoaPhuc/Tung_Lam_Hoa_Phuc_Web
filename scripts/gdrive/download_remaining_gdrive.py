import requests
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

def download_gdrive_file(file_id, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100000:
        sz = os.path.getsize(dest_path) / (1024*1024)
        print(f"  ⚡ [Đã có sẵn]: {os.path.basename(dest_path)} ({sz:.2f} MB)")
        return True

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    temp_path = dest_path + '.part'
    
    url = f'https://drive.google.com/uc?export=download&id={file_id}'
    try:
        r = session.get(url, stream=True, timeout=30)
        if 'text/html' in r.headers.get('Content-Type', ''):
            html = r.text
            m_action = re.search(r'<form[^>]*action="([^"]+)"', html)
            action = m_action.group(1) if m_action else 'https://drive.usercontent.google.com/download'
            inputs = dict(re.findall(r'<input[^>]*name="([^"]+)"[^>]*value="([^"]+)"', html))
            r = session.get(action, params=inputs, stream=True, timeout=120)

        if r.status_code == 200:
            with open(temp_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024*1024):
                    if chunk:
                        f.write(chunk)
                        
            if os.path.getsize(temp_path) > 1000:
                if os.path.exists(dest_path):
                    os.remove(dest_path)
                os.rename(temp_path, dest_path)
                sz = os.path.getsize(dest_path) / (1024*1024)
                print(f"  ✓ Tải thành công: {os.path.basename(dest_path)} ({sz:.2f} MB)")
                return True
    except Exception as e:
        print(f"  ✗ Lỗi tải {os.path.basename(dest_path)}: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    return False

base_out = r'E:\VIDEO AND SOUND\POSTCAST\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH'

remaining_items = [
    # CTTT
    ('09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU', '13HVQjevFt_y4_mnREhz7l-Oidd0Hd12b', 'CTTT Tháng 09.2026 - Thầy Tâm Hòa Khai Khóa Pháp Thoại.m4a'),
    ('09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU', '1LXmbVY-M_arba08wA5uuxh_p3DUTvvtw', 'CTTT Tháng 09.2026 - Sư Phụ Chia Sẻ Đại Lễ Vu Lan.m4a'),
    ('09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU', '1wj7upEHmGF13hE2-OqKMCnQpWeHDV7UM', 'CTTT Tháng 09.2026 - Lễ Truyền Thọ Tam Quy Ngũ Giới.m4a'),
    ('09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU', '11grmww9XrBZPDxKCUUC0JzMZ2LOxRQfl', 'CTTT - Lễ Vào Hè 2026.m4a'),
    # ĐẠI LỄ SỰ KIỆN
    ('10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI', '1cX1PcdPHS3HQIwOiHDF6J9rh_GnzDj8v', 'Đại Lễ Phật Đản 2026 - Khai Mạc & Pháp Thoại Sư Phụ.m4a'),
    ('10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI', '1mgUdYNYKYCPcMWwgUBtiu8F-ngtJNYnT', 'Đại Lễ Phật Đản 2026 - Lễ Quy Y Tam Bảo.m4a'),
    ('10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI', '14CmZTZzkeAHvLcsQO3gHtw6xKpkC8bx1', 'Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 3).m4a'),
    ('10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI', '1EHGLEt3DQ0b6vrwDH8I-z8Yjf-2uSHTK', 'Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 2).m4a'),
]

print("=== TIẾP TỤC TẢI CÁC FILE CÒN LẠI ===")
for folder, fid, fname in remaining_items:
    out_file = os.path.join(base_out, folder, fname)
    print(f"Đang tải: {fname}...")
    download_gdrive_file(fid, out_file)

print("\n🎉 HOÀN TẤT TẢI CÁC FILE CÒN LẠI!")
