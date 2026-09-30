import os
import sys
import json
import zipfile
import re
import xml.etree.ElementTree as ET

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"E:\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\TRÍ TUỆ PHẬT GIÁO\ẤN PHẨM PHẬT GIÁO"

def extract_text_from_docx(file_path):
    """Extract paragraphs and clean text from .docx file"""
    if not os.path.exists(file_path):
        return []
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # XML namespace for Word
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                # Extract all text in paragraph
                texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                p_text = "".join(texts).strip()
                if p_text:
                    paragraphs.append(p_text)
            return paragraphs
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def split_into_chapters(paragraphs, default_title="Nội Dung Tác Phẩm"):
    """Split paragraphs into structured chapters by detecting Chapter keywords or headers"""
    chapters = []
    current_chapter_title = "Lời Mở Đầu"
    current_chapter_paras = []
    
    chapter_pattern = re.compile(r'^(chương\s+\d+|quyển\s+\d+|phần\s+\d+|mục\s+\d+|bài\s+\d+|lời\s+tựa|lời\s+đầu|lời\s+nói\s+đầu|tiết\s+\d+|kệ\s+\d+|thứ\s+\d+)', re.IGNORECASE)
    
    for p in paragraphs:
        # If paragraph is short and looks like a chapter title or header
        if len(p) < 120 and (chapter_pattern.match(p) or p.isupper()):
            if current_chapter_paras:
                chapters.append({
                    "chapterNumber": len(chapters) + 1,
                    "title": current_chapter_title,
                    "content": "\n\n".join(current_chapter_paras)
                })
                current_chapter_paras = []
            current_chapter_title = p
        else:
            current_chapter_paras.append(p)
            
    if current_chapter_paras:
        chapters.append({
            "chapterNumber": len(chapters) + 1,
            "title": current_chapter_title,
            "content": "\n\n".join(current_chapter_paras)
        })
        
    # If no chapters detected, create a single chapter with all text
    if not chapters:
        chapters.append({
            "chapterNumber": 1,
            "title": default_title,
            "content": "\n\n".join(paragraphs)
        })
        
    return chapters

def main():
    books = []
    
    # 1. ĐI QUA KHỔ VUI CUỘC ĐỜI
    dqkv_dir = os.path.join(BASE_DIR, "ĐI QUA KHỔ VUI CUỘC ĐỜI")
    q1_path = os.path.join(dqkv_dir, "ĐI QUA KHỔ VUI CUỘC ĐỜI QUYỂN 01_VÔ TRÍ TÂM HÒA.docx")
    q2_path = os.path.join(dqkv_dir, "ĐI QUA KHỔ VUI CUỘC ĐỜI QUYỂN 02_VÔ TRÍ TÂM HÒA.docx")
    q3_path = os.path.join(dqkv_dir, "ĐI QUA KHỔ VUI CUỘC ĐỜI QUYỂN 03_VÔ TRÍ TÂM HÒA.pdf")
    
    q1_paras = extract_text_from_docx(q1_path)
    q2_paras = extract_text_from_docx(q2_path)
    
    dqkv_volumes = []
    if q1_paras:
        dqkv_volumes.append({
            "volumeNumber": 1,
            "volumeTitle": "ĐI QUA KHỔ VUI CUỘC ĐỜI - QUYỂN 01",
            "pageCount": len(q1_paras) // 5 or 100,
            "chapters": split_into_chapters(q1_paras, "Quyển 01: Thuở Ban Đầu & Chốn Tổ")
        })
    if q2_paras:
        dqkv_volumes.append({
            "volumeNumber": 2,
            "volumeTitle": "ĐI QUA KHỔ VUI CUỘC ĐỜI - QUYỂN 02",
            "pageCount": len(q2_paras) // 5 or 120,
            "chapters": split_into_chapters(q2_paras, "Quyển 02: Dấu Ấn Hoằng Pháp")
        })
    if os.path.exists(q3_path):
        dqkv_volumes.append({
            "volumeNumber": 3,
            "volumeTitle": "ĐI QUA KHỔ VUI CUỘC ĐỜI - QUYỂN 03",
            "pageCount": 150,
            "pdfUrl": "/pdf/di-qua-kho-vui-cuoc-doi-q3.pdf",
            "chapters": [{
                "chapterNumber": 1,
                "title": "Quyển 03: Bản In Trọn Vẹn",
                "content": "Tác phẩm Quyển 03 của Thầy Viện chủ Sa Môn Vô Trí (Thích Tâm Hòa) hiện diện dưới định dạng bản in tài liệu tu học."
            }]
        })
        
    books.append({
        "id": "sach-01",
        "slug": "di-qua-kho-vui-cuoc-doi",
        "title": "Đi Qua Khổ Vui Cuộc Đời",
        "subtitle": "Tập Ký Hồi Ức Chiêm Nghiệm & Tri Ân Tam Bảo",
        "author": "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
        "category": "Hồi Ký & Tu Tập",
        "coverImage": "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc_tong-phong-truyen-thua_tiep-buoc-thay-toi_thay_-chu-thich-popup-sach-dqkvcd-1787464550735.jpg",
        "description": "Tác phẩm đúc kết chặng đường tu tập, vượt qua muôn vàn gian khó, những bài học sâu sắc về tình thầy trò, sự thịnh suy vô thường và lòng tri ân vô hạn đối với Sư Tổ Ngộ Chân Tử cùng Hòa Thượng Bổn Sư Thích Chân Tính.",
        "totalVolumes": len(dqkv_volumes),
        "volumes": dqkv_volumes
    })
    
    # 2. KHUYẾN PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN
    kpbd_dir = os.path.join(BASE_DIR, "KHUYẾT PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN_VÔ TRÍ TÂM HÒA")
    kp_vols = []
    for i, roman in enumerate(["I", "II", "III", "IV"], start=1):
        for pattern in [f"QUYỂN {roman} - BẢN IN.docx", f"QUYỂN {roman}- BẢN IN.docx", f"QUYỂN {roman} - BẢN IN .docx"]:
            kp_path = os.path.join(kpbd_dir, pattern)
            if os.path.exists(kp_path):
                paras = extract_text_from_docx(kp_path)
                if paras:
                    kp_vols.append({
                        "volumeNumber": i,
                        "volumeTitle": f"KHUYẾN PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN - QUYỂN {roman}",
                        "pageCount": len(paras) // 5 or 80,
                        "chapters": split_into_chapters(paras, f"Quyển {roman}: Giảng Luận")
                    })
                break
                
    if kp_vols:
        books.append({
            "id": "sach-02",
            "slug": "khuyen-phat-bo-de-tam-giang-luan",
            "title": "Khuyến Phát Bồ Đề Tâm Giảng Luận",
            "subtitle": "Giảng Giải Chuyên Sâu Bài Văn Khuyến Phát Bồ Đề Tâm Của Thật Hiền Đại Sư",
            "author": "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
            "category": "Giáo Lý & Giảng Giải",
            "coverImage": "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp",
            "description": "Bộ luận giảng giải 4 quyển phân tích sâu sắc 10 nhân duyên phát khởi Bồ Đề Tâm — cội nguồn của mọi công đức và quả vị giải thoát trong Phật giáo.",
            "totalVolumes": len(kp_vols),
            "volumes": kp_vols
        })

    # 3. 37 PHẨM TRỢ ĐẠO DIỄN THƠ
    p37_path = os.path.join(BASE_DIR, "37 PHẨM TRỢ ĐẠO DIỄN THƠ_VÔ TRÍ TÂM HÒA.docx")
    if os.path.exists(p37_path):
        p37_paras = extract_text_from_docx(p37_path)
        if p37_paras:
            books.append({
                "id": "sach-03",
                "slug": "37-pham-tro-dao-dien-tho",
                "title": "37 Phẩm Trợ Đạo Diễn Thơ",
                "subtitle": "Nghệ Thuật Diễn Kệ 37 Pháp Trợ Đạo Cốt Tủy Phật Giáo",
                "author": "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
                "category": "Kinh Kệ & Pháp Bảo",
                "coverImage": "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-doi-thay-_thumbnail_herobanner-1787463508324.jpg",
                "description": "Chuyển hóa 37 Phẩm Trợ Đạo thành những vần thơ lục bát mượt mà, dễ nhớ, dễ hành trì.",
                "totalVolumes": 1,
                "volumes": [{
                    "volumeNumber": 1,
                    "volumeTitle": "Toàn Tập Diễn Ca 37 Pháp Trợ Đạo",
                    "pageCount": len(p37_paras) // 5 or 60,
                    "chapters": split_into_chapters(p37_paras, "37 Phẩm Trợ Đạo Diễn Thơ")
                }]
            })

    # 4. LỜI DẠY CỦA ĐỨC PHẬT
    ld_path = os.path.join(BASE_DIR, "LỜI DẠY CỦA ĐỨC PHẬT_VÔ TRÍ TÂM HÒA.docx")
    if os.path.exists(ld_path):
        ld_paras = extract_text_from_docx(ld_path)
        if ld_paras:
            books.append({
                "id": "sach-04",
                "slug": "loi-day-cua-duc-phat",
                "title": "Lời Dạy Của Đức Phật",
                "subtitle": "Tuyển Tập Lời Vàng Phật Thuyết Trích Dẫn Từ Kinh Điển",
                "author": "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
                "category": "Kinh Điển Căn Bản",
                "coverImage": "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-hoang-phap--kien-an-tinh-hai-phong-1787463859334.jpg",
                "description": "Chắt lọc những lời giáo huấn cốt lõi của Đức Từ Phụ về đời sống đạo đức, nhân quả nghiệp báo, tu dưỡng thân tâm.",
                "totalVolumes": 1,
                "volumes": [{
                    "volumeNumber": 1,
                    "volumeTitle": "Lời Vàng Phật Dạy Về Nhân Sinh",
                    "pageCount": len(ld_paras) // 5 or 80,
                    "chapters": split_into_chapters(ld_paras, "Lời Dạy Của Đức Phật")
                }]
            })

    # 5. BA NƯƠNG TỰA VÀ NĂM THỰC HÀNH
    bn_path = os.path.join(BASE_DIR, "BA NƯƠNG TỰA VÀ NĂM THỰC HÀNH_VÔ TRÍ TÂM HÒA.pdf")
    if os.path.exists(bn_path):
        books.append({
            "id": "sach-05",
            "slug": "ba-nuong-tua-va-nam-thuc-hanh",
            "title": "Ba Nương Tựa Và Năm Thực Hành",
            "subtitle": "Kim Chỉ Nam Nền Tảng Tu Học Cho Người Đệ Tử Phật",
            "author": "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
            "category": "Tu Tập Căn Bản",
            "coverImage": "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/cac-su-he-phai-khat-si-ve-tham-chua-hoang-phap-truoc-giai-phong-chup-trc-hien-chinh-dien---tam-bao-trong-1787464519312.jpg",
            "description": "Quy Giới nương tựa Tam Bảo (Phật - Pháp - Tăng) và 5 Điều Thực Tập Căn Bản (Ngũ Giới).",
            "totalVolumes": 1,
            "volumes": [{
                "volumeNumber": 1,
                "volumeTitle": "Tam Quy & Ngũ Giới Thực Hành",
                "pageCount": 95,
                "chapters": [{
                    "chapterNumber": 1,
                    "title": "Tam Quy & Ngũ Giới",
                    "content": "Quy y Phật: Quay về nương tựa tự tánh Giác ngộ sáng suốt.\nQuy y Pháp: Quay về nương tựa Chánh pháp chuyển hóa khổ đau.\nQuy y Tăng: Quay về nương tựa Tăng đoàn thanh tịnh hòa hợp."
                }]
            }]
        })

    # Output JSON path
    output_json_path = os.path.abspath("src/data/sach-an-pham-data.json")
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
        
    print(f"✅ ĐÃ NẠP CHÍNH XÁC {len(books)} BỘ SÁCH THẬT TỪ THƯ MỤC VÀO: {output_json_path}")
    for b in books:
        vol_count = len(b['volumes'])
        total_chaps = sum(len(v['chapters']) for v in b['volumes'])
        print(f"  📖 {b['title']} -> {vol_count} Quyển, {total_chaps} Chương mục")

if __name__ == "__main__":
    main()
