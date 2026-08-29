import os
import re
import sys
import json
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

DOCS_DIR = r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download\all_docs'

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

files = sorted(os.listdir(DOCS_DIR))
parsed_docs = {}

for f in files:
    if f.endswith('.docx'):
        path = os.path.join(DOCS_DIR, f)
        text = read_docx(path)
        parsed_docs[f] = text
        print(f"=======================================================")
        print(f"FILE: {f} ({len(text)} chars)")
        print(f"=======================================================")
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        for l in lines[:15]:
            print(f"  {l}")

with open(r'C:\Users\MY PC\Tung_Lam_Hoa_Phuc_Web\drive_download\all_parsed_docs.json', 'w', encoding='utf-8') as out:
    json.dump(parsed_docs, out, ensure_ascii=False, indent=2)

print("\nSaved all parsed docs to all_parsed_docs.json")
