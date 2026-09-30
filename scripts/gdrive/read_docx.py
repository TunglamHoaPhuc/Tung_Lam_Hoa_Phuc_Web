import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(docx_path):
    if not os.path.exists(docx_path):
        print(f"File does not exist: {docx_path}")
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
        print(f"Error reading docx {docx_path}: {e}")
        return ""

files = [
    r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download\II_MO_TA_CHUNG_TONG_CHI_TU_HOC.docx',
    r'E:\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\TÔNG CHỈ TU HỌC\TRANG CHI TIẾT - BỒ ĐỀ TÂM.docx',
]

for f in files:
    print(f"\n=======================================================")
    print(f"CONTENT OF: {f}")
    print(f"=======================================================")
    text = read_docx(f)
    print(text[:3000])
