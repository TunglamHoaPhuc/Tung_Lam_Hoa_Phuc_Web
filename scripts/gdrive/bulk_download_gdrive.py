import urllib.request
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

DOWNLOAD_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download\all_docs'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# List of files to download
FILES_TO_DOWNLOAD = [
    # Root
    ('1WS4q_khgltMy349fmAlVcXTU7DyIpg3r', 'II_MO_TA_CHUNG_TONG_CHI_TU_HOC.docx', 'tong-quan'),
    # II.1. Tông Phong Truyền Thừa
    ('1NHyvDDDuxIOeD1J6K7k0f4xKagw4xKdPW3J4BsRf-A4', 'II_1_TRANG_CHI_TIET_DOI_THAY.docx', 'tong-phong-truyen-thua'),
    ('1xmYN5lXefgM8lzjsLUursif9e1rNFqwFU6Ri09nTNXk', 'II_1_TRANG_CHI_TIET_MIEN_NAM_CHON_TO.docx', 'tong-phong-truyen-thua'),
    ('1qPnAWxCxtC0JQU68rM-6P4GtyKKU0MbVjRPwWg92xwU', 'II_1_TRANG_CHI_TIET_TIEP_BUOC_THAY_TOI.docx', 'tong-phong-truyen-thua'),
    # II.2. Nền Tảng Tu Học
    ('16eWI-d_irOZtplomwUVk45hTvd5eBotw', 'II_2_1_BO_DE_TAM.docx', 'nen-tang-tu-hoc'),
    ('1fcB2q1LFKNOE_eMjjt8xzO-ui4t3wyNm', 'II_2_2_TAM_QUY.docx', 'nen-tang-tu-hoc'),
    ('1g6PEgzMVBGAYWOQ2aS3t2ILK3X595tS6', 'II_2_2_TRANG_CHI_TIET_TAM_QUY_NGU_GIOI.docx', 'nen-tang-tu-hoc'),
    ('1aLAxGkg-lKovFH_IGNYFNoaLidFyy6M_', 'II_2_3_NGU_GIOI.docx', 'nen-tang-tu-hoc'),
    ('13I3PY2L_iEMpZi8RjWDhy5hbQRqtJQg2', 'II_2_3_THAP_THIEN.docx', 'nen-tang-tu-hoc'),
    ('1NJU2yrz0gg89OqGqQviS0fUeTwckjdIQ', 'II_2_3_TRANG_CHI_TIET_THAP_THIEN.docx', 'nen-tang-tu-hoc'),
    ('1K8XrzH6T4tqHyPqt3GC8cKlCO1GzXvw6', 'II_2_4_BO_TAT_HANH.docx', 'nen-tang-tu-hoc'),
    # II.3. Phương Pháp Hành Trì
    ('1-lq4t3HfYecIFU2OFUC7IpWoO0Ce7-A9', 'II_3_1_NIEM_PHAT.docx', 'phuong-phap-hanh-tri'),
    ('1i_WpBcW6Llsc1MSbCaRxk-rECbXjGnfJ', 'II_3_2_TUNG_KINH.docx', 'phuong-phap-hanh-tri'),
    ('1VNf67U1oFFO1PWKvOv9jeci2PSxL6Q-s', 'II_3_3_THIEN_TAP.docx', 'phuong-phap-hanh-tri'),
    ('1ER4mp8zRTM9O72lzDwf-9yK_5UgvZvMR', 'II_3_4_LAY_PHAT.docx', 'phuong-phap-hanh-tri'),
    ('1pdYOMXeFXkSbigwVwPoSFpQlFn1kSDxK', 'II_3_5_SAM_HOI.docx', 'phuong-phap-hanh-tri'),
    ('1B8M1xBa0XmuaDQJoA2DpZshM2xROdcx-', 'II_3_6_NGHE_PHAP.docx', 'phuong-phap-hanh-tri'),
    ('1ltZ1ysDAiPdNyehnAIlRpu5TP3PEodPW', 'II_3_7_PHUNG_SU.docx', 'phuong-phap-hanh-tri'),
    ('1iDv6EkiTsW_revHsA43kHpuTbM9PtjLU', 'II_3_8_BO_THI_CUNG_DUONG.docx', 'phuong-phap-hanh-tri'),
    # II.4. Lộ Trình Tu Học
    ('1xL0IBA98oeYYN-O_-rFSX1SwWMYUkRjT', 'II_4_1_LT_NGUOI_MOI.docx', 'lo-trinh-tu-hoc'),
    ('1GYnn6c5nX-hMYI5zn8S4B_F49kZ2HCTa', 'II_4_2_LT_NGUOI_TRE.docx', 'lo-trinh-tu-hoc'),
    ('1c0uckxj6i1Mu4rJSTYFYd5VjYgZqTwFs', 'II_4_3_LT_NGUOI_BAN_RON.docx', 'lo-trinh-tu-hoc'),
    ('13iUiINxXQF331ISOW93oFJ9sxG8FNPLQ', 'II_4_4_LT_NGUOI_CHUYEN_TU.docx', 'lo-trinh-tu-hoc'),
]

def download_file(file_id, filename):
    out_path = os.path.join(DOWNLOAD_DIR, filename)
    urls = [
        f'https://docs.google.com/document/d/{file_id}/export?format=docx',
        f'https://drive.google.com/uc?export=download&id={file_id}',
        f'https://drive.usercontent.google.com/download?id={file_id}&export=download&authuser=0',
    ]
    for u in urls:
        try:
            req = urllib.request.Request(u, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
                if len(data) > 500 and not data.startswith(b'<!DOCTYPE') and not data.startswith(b'<html'):
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"✓ Downloaded: {filename} ({len(data)} bytes)")
                    return True
        except Exception as e:
            pass
    print(f"✗ Failed download: {filename} ({file_id})")
    return False

def read_docx(docx_path):
    if not os.path.exists(docx_path):
        return ""
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

print("Starting bulk download...")
for fid, fname, cat in FILES_TO_DOWNLOAD:
    download_file(fid, fname)

print("\nReading downloaded docs:")
for fid, fname, cat in FILES_TO_DOWNLOAD:
    fpath = os.path.join(DOWNLOAD_DIR, fname)
    if os.path.exists(fpath):
        content = read_docx(fpath)
        print(f"\n=======================================================")
        print(f"FILE: {fname} (Cat: {cat}) - Length: {len(content)} chars")
        print(f"=======================================================")
        print(content[:1500])
