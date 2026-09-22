import re
import os

p = r'E:\VIDEO AND SOUND\POSTCAST\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH\07_SERIES_KINH_DI_GIAO_PPUD\Kinh Di Giáo - Buổi 02 (Bản Gốc).m4a'
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

forms = re.findall(r'<form[^>]*action="([^"]+)"', html)
print("Forms:", forms)
inputs = re.findall(r'<input[^>]*name="([^"]+)"[^>]*value="([^"]+)"', html)
print("Inputs:", inputs)
links = re.findall(r'href="([^"]+)"', html)
print("Links:", links)
